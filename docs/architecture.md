# Architecture

## The three-service split

```
┌──────────────┐     HTTP    ┌──────────────┐
│  Browser     │ ──────────→ │  web         │   container: open-gen-ai
│  /batch UI   │ ←────────── │  Next.js 15  │   port: 3000
└──────────────┘             └──────┬───────┘
                                    │ Prisma over TCP
                                    ▼
                             ┌──────────────┐
                             │  postgres    │   container: ogai-postgres
                             │  16-alpine   │   host port: 5433
                             └──────┬───────┘
                                    ▲ Prisma
                                    │ tick every 2s
                             ┌──────┴───────┐    HTTPS    ┌─────────────────┐
                             │  worker      │ ──────────→ │  provider APIs  │
                             │  Node loop   │ ←────────── │  4 adapters     │
                             └──────────────┘             └─────────────────┘
```

All three are services in `docker-compose.yml`. They share an `uploads_data` volume mounted at `/data/uploads`. The worker connects to Postgres at the compose-network DNS name `postgres:5432`; the host machine reaches Postgres at `localhost:5433`.

### Why the worker is a separate container

If the worker ran inside Next.js (e.g., a `setInterval` in an API route), three things break:

1. **Hot reload kills it.** Every dev file save would interrupt mid-flight provider polls.
2. **Request timeouts cap it.** A polling loop is conceptually long-lived; serverless-style runtime timeouts truncate it.
3. **Scaling is wrong.** You'd want to scale web horizontally for traffic and worker horizontally for video throughput. Coupling them forces both to scale together.

A separate Node process owned by `worker/index.js` avoids all three. It reads from the same Postgres the web container writes to — the queue is the database.

### Why Postgres-as-queue (no Redis, no BullMQ)

Our `jobs` table **is** the domain. Every row carries `practiceName`, `trainerId`, `videoUrl`, `prompt` and is exposed in the UI, retry endpoint, and CSV export. A queue library would add a parallel `pgboss.job` (or similar) table that mirrors `jobs` via a foreign key, and we'd write coordination code to keep them in sync. The library's value (retry/backoff/concurrency) is a few dozen lines we already have, written explicitly:

- **Retries**: `Job.retries` + `Job.nextAttemptAt`. See `worker/index.js:282-319` (`markFailureWithBackoff`).
- **Concurrency**: `Batch.concurrency` minus a `COUNT WHERE status IN ('submitting','polling')`. See `worker/index.js:72-86` (`advanceBatch`).
- **Claim safety**: `SELECT … FOR UPDATE SKIP LOCKED`. See `worker/index.js:88-107` (`claimJobs`).
- **Crash recovery**: explicit reconciliation pass at boot. See `worker/index.js:367-405` (`recoverOrphans`).

The trade we accept: 2-second polling latency on the worker side. For multi-minute video generations, that's invisible.

## Request / data flow

### Path 1 — Trainer/studio image upload

```
Browser → POST /api/trainers (multipart)
        → Next.js route handler (app/api/trainers/route.js)
            ├── prisma.trainer.create({...})            # row first, get id
            ├── saveLocalBackup(...)                    # write to /data/uploads/trainers
            ├── uploadFileToMuapi(apiKey, file)         # best-effort to MuAPI CDN
            └── prisma.trainer.update({imageUrl, localPath})
        → 201 { trainer }
```

The double-write (local + remote CDN) is intentional. Local is the source of truth for the worker to re-upload to whichever provider runs the job. The CDN URL is for the wizard's thumbnail strip — fast to display, doesn't hit our box.

### Path 2 — Batch creation

```
Browser parses CSV in-memory via PapaParse → per-row trainer/studio overrides → POST /api/batches
        → Next.js route handler (app/api/batches/route.js)
            └── prisma.batch.create({
                  ...settings,
                  status: 'draft',
                  jobs: { create: cleanedJobs }    # nested write, atomic
                })
        → 201 { batch }
        → wizard then POSTs /api/batches/:id/start to flip jobs queued and batch running
```

Batches start in `draft` so the user can review the count and cost before kicking off generation. `start` is a separate idempotent endpoint.

### Path 3 — Job execution (the worker's loop)

```
worker/index.js tick (every 2s)
  ├── prisma.batch.findMany({where: {status: 'running'}})
  │
  ├── for each running batch:
  │     ├── inflight = COUNT(jobs WHERE status IN ('submitting','polling'))
  │     ├── slots = batch.concurrency - inflight
  │     ├── ids = claimJobs(batchId, slots)        # FOR UPDATE SKIP LOCKED
  │     └── Promise.all(ids.map(submitJob))
  │
  └── pollPending()
        ├── findMany({status: 'polling', providerRequestId: not null}, take: 50)
        └── for each: provider.pollResult() → done | pending | TerminalProviderError
```

`submitJob` reads the trainer/studio image buffers from disk, builds the prompt via `lib/promptTemplate.js`, calls `provider.submit(...)`, and updates the row to `polling` (or `done` if the provider responded synchronously). A `TerminalProviderError` skips the retry loop; anything else triggers exponential backoff.

## Decision log

These are the architectural choices that newcomers tend to question. Documented here so they don't get re-debated in PRs.

### Trainer images stored locally, not in object storage

We use a Docker volume (`uploads_data`) instead of S3 or similar. Reasoning:

- The worker re-uploads the trainer **per provider per job**, because each provider has its own CDN (or no CDN — BytePlus, OpenRouter send inline base64). A canonical S3 URL would still need to be fetched + re-uploaded; it doesn't save round-trips.
- Single-tenant deployment. No multi-region requirement.
- Self-host friendliness. Adding S3 means adding AWS credentials to the deploy story.

If we ever go multi-region, swap `lib/localUploadStore.js` to write to S3 instead. The contract is `saveLocalBackup` / `readLocal` / `publicUrlFor`; nothing else assumes a filesystem.

### `Job.quality` actually stores resolution strings

Historical name. Originally MuAPI's vocabulary (`basic | high`); we kept the column name when generalizing. Today the values are `'480p'`, `'720p'`, `'1080p'`, with the MuAPI adapter translating at its boundary. The choice was:

- (a) Rename the column `resolution` (migration + every adapter touched) **vs.**
- (b) Document the shift in code comments and move on.

We picked (b). The migration cost was real; the readability cost is one comment in `worker/index.js:152-156` and one in `lib/providers/muapi.js:43-48`. Future-proofing tip: if we add support for non-pixel quality dimensions (e.g., bitrate tiers), do the rename then.

### One Postgres database, no read replica

Worker reads + writes `jobs`. Web reads + writes `jobs`. They share the same instance. At our throughput (single-digit batches per day, hundreds of jobs per batch) the contention isn't worth splitting. If we ever scale to thousands of concurrent batches, the next move is read replicas for the BatchDetail polling endpoint, not a different DB.

### No WebSockets — UI polls every 3s

`BatchDetail.jsx` polls `GET /api/batches/:id` every 3 seconds. Trade-off vs. push:

- (Push) WebSocket from web → browser, fanned out from a Postgres LISTEN. Lower latency, but adds a long-lived connection layer the rest of the stack doesn't have.
- (Poll) 3-second poll. Higher latency, simpler infra, no extra failure mode.

For multi-minute video generations, 3 seconds of staleness is invisible. Pick push if and when latency matters (e.g., a real-time collaboration feature on top of this).

### `TerminalProviderError` carries `billed` semantics

Adapters know more about a failure than the worker does. A 4xx that never started generation (`billed: false`) and a 2xx-with-policy-rejection that already ran (`billed: true`) are both "non-retryable" — but the user's response should differ. `TerminalProviderError.billed` lets the UI explain the difference instead of saying "it failed, sorry" generically. See `lib/providers/errors.js`.

## What's deliberately NOT here

- **Authentication / multi-tenancy.** Single shared deploy. The trainer/studio/batch tables have no `userId`. If you want per-user isolation, that's a v2.
- **Per-tenant API keys.** All four provider keys are set via env vars on the worker container. The web container additionally reads them from cookies for cost-estimate / one-off calls, but the worker never reads from cookies.
- **A managed queue.** See above — Postgres is the queue.
- **Real-time stream of generation progress.** Providers don't expose streaming progress; we surface `queued / submitting / polling / done`.

## File map

| Concern                       | File                                        |
|-------------------------------|---------------------------------------------|
| Service definitions           | `docker-compose.yml`                        |
| Schema + migrations           | `prisma/schema.prisma`, `prisma/migrations/`|
| Prisma singleton (web)        | `lib/prisma.js`                             |
| Image upload helpers          | `lib/localUploadStore.js`, `lib/muapiUpload.js` |
| Provider registry             | `lib/providers/index.js`                    |
| Provider adapters             | `lib/providers/{muapi,segmind,byteplus,openrouter}.js` |
| Terminal-error class          | `lib/providers/errors.js`                   |
| Prompt builder                | `lib/promptTemplate.js`                     |
| CSV parser                    | `lib/csvParser.js`                          |
| Worker tick loop              | `worker/index.js`                           |
| Wizard / progress UI          | `components/batch/*`                        |
| HTTP routes                   | `app/api/{batches,jobs,trainers,studios,providers,uploads}/**` |
