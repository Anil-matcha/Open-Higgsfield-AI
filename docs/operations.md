# Operations

Day-to-day commands and mental model for running the batch system.

## First-time setup

```bash
# 1. Clone, install deps (host-side, for prisma migrate dev)
git clone <fork-url>
cd Open-Generative-AI
npm install

# 2. Create .env
cp .env.example .env
# Edit and fill at minimum one of:
#   MUAPI_API_KEY=...
#   SEGMIND_API_KEY=...
#   BYTEPLUS_API_KEY=...      (with BYTEPLUS_REGION=ap-southeast)
#   OPENROUTER_API_KEY=...
# DATABASE_URL is already set for the compose network.

# 3. Build and start everything
docker compose up -d --build

# 4. Verify
docker compose ps                          # web, worker, postgres all "up (healthy)"
docker compose logs web | tail -n 30       # should see "Ready in ..." and migrations applied
docker compose logs worker | tail -n 30    # should see "starting" with providersWithKeys

# 5. Open the UI
open http://localhost:3000/batch
```

If the worker logs `providersWithKeys: []`, the env vars didn't reach the container — usually a typo in `.env` or you ran `docker compose restart` (which doesn't re-read env) instead of `up -d`.

## Environment variables

| Var                  | Where    | Required | Purpose                                                       |
|----------------------|----------|----------|---------------------------------------------------------------|
| `DATABASE_URL`       | web, worker | yes   | Postgres connection. Defaults to `postgresql://ogai:ogai_dev_pw@postgres:5432/ogai` for compose. |
| `MUAPI_API_KEY`      | web, worker | one of  | MuAPI key. Web uses for cost-estimate; worker uses for submit/poll. |
| `SEGMIND_API_KEY`    | web, worker | one of  |                                                               |
| `BYTEPLUS_API_KEY`   | web, worker | one of  | Provisioning key from BytePlus console.                       |
| `BYTEPLUS_REGION`    | web, worker | no      | Default `ap-southeast`. **Don't set to `ap-southeast-1`** — DNS doesn't resolve. |
| `OPENROUTER_API_KEY` | web, worker | one of  |                                                               |
| `MUAPI_BASE_URL`     | web, worker | no      | Override MuAPI host. Default `https://api.muapi.ai`.          |
| `WORKER_TICK_MS`     | worker    | no       | Tick interval. Default 2000.                                   |
| `UPLOAD_DIR`         | web, worker | no      | Default `/data/uploads`. Mapped to the `uploads_data` volume. |

At least one of the four provider keys must be set, otherwise the wizard's provider dropdown is fully greyed out. Multiple keys are fine — the wizard enables all providers with a key.

## Day-to-day workflow

```bash
# Frontend (JS/JSX/CSS) edits
docker compose restart web
# then hard-refresh the browser (Ctrl+Shift+R) — Next bundles are cached aggressively

# Worker (worker/, lib/providers/, lib/promptTemplate.js) edits
docker compose restart worker
# OR if you changed dependencies:
docker compose up -d --build worker

# Schema changes
# 1. Edit prisma/schema.prisma
npx prisma migrate dev --name <description>
# 2. Restart the web container so it picks up the new client
docker compose restart web

# Tail logs
docker compose logs -f worker
docker compose logs -f web
docker compose logs -f         # all three

# Postgres CLI
docker compose exec postgres psql -U ogai -d ogai

# Inspect rows
docker compose exec postgres psql -U ogai -d ogai \
  -c "SELECT id, status, retries, error FROM jobs WHERE batch_id='<batchId>' ORDER BY row_index"
```

For host-side migrations, point at `localhost:5433`:
```bash
DATABASE_URL=postgresql://ogai:ogai_dev_pw@localhost:5433/ogai \
  npx prisma migrate dev --name your_change
```

## Scaling

We run a **single worker container** today. Two patterns to scale up if needed:

### Vertical (more jobs per existing worker)

- Bump `Batch.concurrency` per batch (UI dropdown). The worker honors it without restart.
- Tune `WORKER_TICK_MS` lower (e.g., 1000ms) if you want faster pickup of newly-queued jobs. Trade-off: more DB queries per second.

### Horizontal (multiple worker containers)

The claim query is already safe (`FOR UPDATE SKIP LOCKED`), so you can run N workers without code changes. In `docker-compose.yml`:

```yaml
worker:
  ...
  deploy:
    replicas: 3
```

Or compose's swarm/k8s equivalent. Each replica picks up disjoint subsets of queued rows; the math is `total_inflight ≤ sum(batch.concurrency for running batches)` — concurrency is a per-batch cap, not per-worker cap.

**Don't** scale the web container expecting more throughput — the web service does no generation work; the bottleneck is always the worker (or the upstream provider).

## Monitoring

We don't ship a metrics endpoint. Pragmatic substitutes:

```sql
-- per-batch progress
SELECT name, status, total, done, failed,
       round(100.0 * done / NULLIF(total,0), 1) AS pct
FROM batches
WHERE status IN ('running', 'paused')
ORDER BY created_at DESC;

-- per-provider failure rate (last 24h)
SELECT b.provider, j.status, COUNT(*)
FROM jobs j JOIN batches b ON b.id = j.batch_id
WHERE j.created_at > NOW() - INTERVAL '24 hours'
GROUP BY b.provider, j.status
ORDER BY b.provider, j.status;

-- jobs stuck in submitting/polling for a long time
SELECT id, batch_id, status, started_at, NOW() - started_at AS age
FROM jobs
WHERE status IN ('submitting', 'polling')
  AND started_at < NOW() - INTERVAL '20 minutes'
ORDER BY started_at ASC;
```

Worker log events are JSON-per-line (see [worker-internals.md](worker-internals.md#logging)). Ship them somewhere queryable if the team grows beyond one operator.

## Backups

Two stateful surfaces:

- **Postgres** (`postgres_data` named volume). Standard `pg_dump`:
  ```bash
  docker compose exec postgres pg_dump -U ogai ogai > backup-$(date +%F).sql
  ```
- **Uploaded images and rendered videos** (`uploads_data` named volume). Mounted at `/data/uploads` in both `web` and `worker`. To back up:
  ```bash
  docker run --rm -v ogai_uploads_data:/data -v $(pwd):/backup alpine \
    tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
  ```

For a self-host deployment without separate storage, run both on a schedule.

## Restoring

```bash
# Postgres
cat backup.sql | docker compose exec -T postgres psql -U ogai -d ogai

# Uploads
docker run --rm -v ogai_uploads_data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/uploads-2026-05-08.tar.gz -C /data
```

## Stopping cleanly

```bash
docker compose stop worker     # finishes current tick, exits
docker compose stop web        # immediate
docker compose stop postgres   # last
docker compose down            # remove containers (keeps volumes)
docker compose down -v         # ALSO removes volumes — destructive, you'll lose data
```

The `down -v` form is what you want when wiping local state for a clean test. Don't run it in production.

## Common operational tasks

### Force-fail a batch's stuck `polling` jobs

If a provider had an outage and left a batch with phantom `polling` jobs that won't time out, the wall-clock deadline (default 30 min) eventually catches them. To do it right now:

```sql
UPDATE jobs
SET status='failed',
    error='Manual fail — phantom polling state after provider outage',
    completed_at=NOW()
WHERE batch_id='<batchId>' AND status='polling';

UPDATE batches SET failed = failed + (
  SELECT COUNT(*) FROM jobs WHERE batch_id='<batchId>' AND status='failed'
                            AND error LIKE 'Manual fail%'
)
WHERE id='<batchId>';
```

Then click Retry on the rows you want to redrive. Retries reset the counter correctly via the API.

### Bulk retry all failed jobs in a batch

The UI exposes per-job retry only. For bulk, either click through (small batches) or:

```sql
WITH failed_jobs AS (
  SELECT id FROM jobs WHERE batch_id='<batchId>' AND status='failed'
)
UPDATE jobs SET
  status='queued', retries=0, error=NULL,
  next_attempt_at=NULL, provider_request_id=NULL,
  started_at=NULL, completed_at=NULL
WHERE id IN (SELECT id FROM failed_jobs);

UPDATE batches SET
  failed = 0,
  status = CASE WHEN status='completed' THEN 'running' ELSE status END
WHERE id='<batchId>';
```

The UI's per-job retry is preferable because it preserves the audit trail (each job's `retries` count). Only batch-update when you're explicitly choosing to forget the failure history.

### Re-import a CSV without the wizard

```bash
# Dump the CSV parser by hand:
cat your.csv | docker compose exec -T web node -e "
  const Papa = require('papaparse');
  process.stdin.pipe(/* ... */);
"
```

In practice this never comes up — the wizard is the only entry point and works fine for any CSV that matches the Rasika column shape.

## Production deployment differences (vs local)

The compose file is dev-flavored. For a real deploy:

- Replace `POSTGRES_PASSWORD: ogai_dev_pw` with a real secret (env var or secret manager).
- Bind-mount or use a managed Postgres instead of the in-compose container, so it survives compose-down.
- Pin `image: open-generative-ai:latest` to a specific tag and push to a registry.
- Add a reverse proxy (nginx, Caddy) terminating TLS, fronting `web` on 3000.
- Worker doesn't need to be exposed externally — keep it on the internal network only.
- Consider running migrations as a one-shot `init-container` rather than letting `web` apply them on every restart.

There's no managed-cloud target today. The setup is intentionally portable to any Docker host.
