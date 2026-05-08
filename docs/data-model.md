# Data Model

Source of truth: [`prisma/schema.prisma`](../prisma/schema.prisma). This page explains it.

## Entity-relationship diagram

```
┌─────────────┐     1     ┌─────────────┐     N    ┌─────────────┐
│  Trainer    │ ◄──────── │     Job     │ ────────►│   Studio    │
│             │     N     │             │     1    │             │
│ csvLabel U  │           │ batchId FK  │          │ csvLabel U  │
│ imageUrl    │           │ trainerId?  │          │ imageUrl    │
│ localPath   │           │ studioId?   │          │ localPath   │
└─────────────┘           │ prompt      │          └─────────────┘
                          │ status      │
                          │ providerReq │
                          │ videoUrl    │
                          │ retries     │
                          │ nextAttempt │
                          │ ...         │
                          └──────┬──────┘
                                 │ N
                                 ▼ 1
                          ┌─────────────┐
                          │   Batch     │
                          │             │
                          │ provider    │
                          │ status      │
                          │ total/done  │
                          │ /failed     │
                          └─────────────┘
```

`U` = unique constraint, `FK` = foreign key, `?` = nullable.

## `Trainer` and `Studio`

Identical shape, different semantic meaning:

- **Trainer** is the person animated in the video.
- **Studio** is the environment (room, set) the person is animated in.

| Column     | Type      | Notes                                                                |
|------------|-----------|----------------------------------------------------------------------|
| id         | cuid PK   |                                                                      |
| name       | String    | Display name in the wizard / cards.                                  |
| csvLabel   | String? U | Joined against the CSV's `Character` / `Studio` columns. Unique so the auto-mapper can't ambiguously match. |
| imageUrl   | String    | Best-display URL: provider CDN if upload succeeded, else `/api/uploads/{kind}/<file>`. |
| localPath  | String?   | Absolute path on the `uploads_data` volume. **This is the source of truth** — the worker reads from here every time. |
| createdAt  | DateTime  | For sort order in the cards UI.                                      |

Why both `imageUrl` and `localPath`: `imageUrl` is for the browser (one HTTP hop, no auth); `localPath` is for the worker (no network, just `readFile`). The CDN URL can expire, the local copy doesn't.

### Deleting

`DELETE /api/trainers/:id` blocks if any job still references the trainer in `queued`, `submitting`, or `polling` status. See `app/api/trainers/[id]/route.js:7-18`.

## `Batch`

One row per CSV upload. Holds the **per-batch** generation settings — rows that override these set their own `Job.duration` / `Job.quality` / `Job.aspectRatio`.

| Column      | Type      | Default         | Notes                                                                                        |
|-------------|-----------|-----------------|----------------------------------------------------------------------------------------------|
| id          | cuid PK   |                 |                                                                                              |
| name        | String    |                 | User-supplied label.                                                                         |
| provider    | String    |                 | Matches `Provider.id` from `lib/providers/index.js` (`muapi`, `segmind`, `byteplus`, `openrouter`). |
| model       | String    | seedance-v2.0-i2v | Provider-specific model id; defaults to that provider's `defaultModel` export.             |
| duration    | Int       | 15              | Seconds. Snapped to 5/10/15 by the CSV parser.                                               |
| quality     | String    | basic           | **Stores resolution strings** (`480p`/`720p`/`1080p`) despite the name. See architecture.md. |
| aspectRatio | String    | 16:9            | `16:9` / `9:16` / `4:3` / `3:4`.                                                             |
| concurrency | Int       | 5               | Max simultaneous in-flight jobs the worker will run.                                         |
| status      | String    | draft           | `draft` → `running` ⇄ `paused` → `completed` / `cancelled`. State machine below.             |
| total       | Int       | 0               | Set on create from `jobs.length`.                                                            |
| done        | Int       | 0               | Incremented by worker on each `done` job (atomically with the job update).                  |
| failed      | Int       | 0               | Incremented on each terminal failure. Decremented if the user retries that failed job.       |
| createdAt   | DateTime  |                 |                                                                                              |
| updatedAt   | DateTime  |                 | Auto-updated by Prisma.                                                                      |

### `Batch.status` state machine

```
                  start                pause
              ┌──────────┐         ┌─────────┐
   draft ────►│ running  │ ◄─────► │ paused  │
              └─────┬────┘         └────┬────┘
                    │ all jobs settled  │
                    ▼                   │
              ┌──────────┐              │
              │completed │ ◄─ retry ───┐│
              └──────────┘             ││
                                        │
              ┌──────────┐              │
              │cancelled │ ◄────────────┘
              └──────────┘     cancel from any state except completed/cancelled
```

Transition map:

| From       | To         | Triggered by                                                                                  |
|------------|------------|-----------------------------------------------------------------------------------------------|
| draft      | running    | `POST /api/batches/:id/start`                                                                 |
| paused     | running    | `POST /api/batches/:id/resume`                                                                |
| running    | paused     | `POST /api/batches/:id/pause` (in-flight jobs finish; worker stops claiming new ones)         |
| running    | completed  | Worker (`maybeMarkCompleted`) when `done + failed + cancelled >= total`                       |
| running    | cancelled  | `POST /api/batches/:id/cancel`                                                                |
| paused     | cancelled  | same                                                                                          |
| draft      | cancelled  | same                                                                                          |
| completed  | running    | `POST /api/jobs/:id/retry` when the retried job's parent batch had auto-completed             |

The retry path's batch flip is non-obvious — see `app/api/jobs/[id]/retry/route.js:30-32`. Without it, the worker (which filters `status: 'running'`) never picks the requeued job up.

## `Job`

One row per CSV row. Most of the schema is metadata you'd expect; the lifecycle columns are what makes it interesting.

| Column            | Type       | Notes                                                                                            |
|-------------------|------------|--------------------------------------------------------------------------------------------------|
| id                | cuid PK    |                                                                                                  |
| batchId           | FK         | Cascade delete: deleting a batch deletes its jobs.                                                |
| rowIndex          | Int        | Original CSV row order. Used for ORDER BY in the claim query and CSV export.                     |
| practiceName      | String     | Display label in the progress table.                                                             |
| trainerId         | FK?        | Nullable so wizard can save a draft batch with unmapped rows. Worker errors at submit-time.      |
| studioId          | FK?        | Nullable. Trainer-only is a valid mode (i2v); studio adds reference-image mode.                  |
| prompt            | String     | The raw `Practice Description` from the CSV. The full prompt is rebuilt by `lib/promptTemplate.js` per submit. |
| startPosition     | String?    | Goes into the prompt template as the opening pose.                                               |
| cameraAngle       | String?    | Goes into the prompt template as the camera setup line.                                          |
| aspectRatio       | String     | Inherited from batch by default; per-row overridable.                                            |
| duration          | Int        | Same.                                                                                            |
| quality           | String     | **Resolution string** — same naming gotcha as `Batch.quality`.                                   |
| status            | String     | See state machine below.                                                                         |
| retries           | Int        | 0–3. At 4 the job becomes `failed`. Reset to 0 on manual retry.                                  |
| providerRequestId | String?    | Set by `submitJob` on async providers; the polling step uses it. Nullable because Segmind sync mode never sets it. |
| videoUrl          | String?    | Final URL once `status='done'`. Either `/api/uploads/videos/<file>` (Segmind, OpenRouter) or a provider CDN URL (MuAPI, BytePlus). |
| error             | String?    | Truncated to 1000 chars on write. Cleared on retry.                                              |
| billed            | Boolean?   | Persisted from `TerminalProviderError.billed` on terminal failure. `null` = unknown / not applicable. Cleared on retry. See `worker/index.js:markTerminalFailure`. |
| nextAttemptAt     | DateTime?  | Earliest moment the claim query is allowed to repick this job. Set by `markFailureWithBackoff`.  |
| startedAt         | DateTime?  | Stamped when claimed. Used to compute the wall-clock deadline.                                   |
| completedAt       | DateTime?  | Stamped on terminal `done` or `failed`.                                                          |
| createdAt         | DateTime   |                                                                                                  |

### `Job.status` state machine

```
              claim                       submit            poll
              ┌─────┐                  ┌──────────┐     ┌──────────┐
  queued ────►│submi├─────────────────►│ polling  │────►│   done   │
   ▲    ▲     │tting│                  └────┬─────┘     └──────────┘
   │    │     └──┬──┘                       │
   │    │        │ TerminalProviderError    │ TerminalProviderError
   │    │        │                          ▼
   │    │        │                     ┌──────────┐
   │    │        └────────────────────►│  failed  │
   │    │                              └────┬─────┘
   │    │                                   │
   │    │ retries < 3                       │ retry endpoint
   │    └────  backoff (queued + nextAttemptAt)
   │
   └── retry endpoint (clears retries, providerRequestId, error)
```

Transition map:

| From       | To         | Triggered by                                                                                            |
|------------|------------|---------------------------------------------------------------------------------------------------------|
| queued     | submitting | `claimJobs` SELECT … FOR UPDATE SKIP LOCKED + UPDATE                                                    |
| submitting | polling    | Async provider returned `{providerRequestId}`                                                           |
| submitting | done       | Sync provider (Segmind) returned `{videoUrl}` directly                                                  |
| submitting | failed     | `TerminalProviderError` thrown by `submit()`                                                            |
| submitting | queued     | Generic `Error` thrown; `retries++`, `nextAttemptAt = now + backoff`                                    |
| polling    | done       | `pollResult` returned `{status:'done', videoUrl}`                                                       |
| polling    | failed     | `TerminalProviderError` from `pollResult` **or** wall-clock deadline exceeded                           |
| failed     | queued     | `POST /api/jobs/:id/retry` (full reset: retries=0, providerRequestId=null, error=null, nextAttemptAt=null) |
| queued     | cancelled  | `POST /api/batches/:id/cancel` (only `queued` and `draft` jobs are cancelled; in-flight finish naturally) |
| draft      | queued     | `POST /api/batches/:id/start`                                                                            |

### Backoff curve

Set by `worker/index.js:307` (`markFailureWithBackoff`):

```
backoffMs = min(10 * 3^retries, 300) * 1000
```

| Attempt # | retries (after failure) | wait until next attempt           |
|-----------|-------------------------|-----------------------------------|
| 1         | 0 → 1                   | 10 s                              |
| 2         | 1 → 2                   | 30 s                              |
| 3         | 2 → 3                   | 90 s                              |
| 4         | 3 → 4                   | **failed** (retries > 3 path)     |

`retries` is read **before** incrementing, so on the first failure `retries=0` and the wait is `10 * 3^0 = 10 s`. The 300-second cap doesn't kick in at the current `nextRetries > 3` cutoff, but lives there as a safety net if someone bumps the cap.

## Indexes

Two non-trivial composite indexes on `Job`:

```prisma
@@index([batchId, status])               // for advanceBatch's count + claim
@@index([status, nextAttemptAt])         // for pollPending's WHERE
```

Single-column indexes on FKs and `csvLabel` are implicit. If you add a new query path (e.g., "find all jobs by trainer"), check whether it triggers a sequential scan in `EXPLAIN ANALYZE` first — every batch run scans `jobs` heavily, so adding a redundant index is cheap relative to a missing one.

## Why these defaults

- `concurrency: 5` — enough to amortize provider latency without tripping per-account rate limits at any of the 4 providers we currently support. Bumpable per batch.
- `quality: 'basic'` (default in DB) — wizard now defaults to `'480p'`, but old rows from the v0 schema still hold `'basic'`. The MuAPI adapter handles both.
- `aspectRatio: '16:9'` — the Rasika CSV's default aspect ratio. Switch to `9:16` for vertical formats.
- `duration: 15` — the maximum Seedance i2v supports. Lower values are snapped down; higher values aren't allowed by the parser.

## Migration history

Live in `prisma/migrations/`. To add a new migration:

```bash
npx prisma migrate dev --name your_change
```

The host port is `5433` (see `docker-compose.yml`). If Prisma can't connect, double-check `DATABASE_URL` in your shell — for host-side `prisma migrate dev`, use `localhost:5433`; the in-container `web` and `worker` services reach Postgres via the compose network at `postgres:5432`.

In production, migrations run on `web` container start (not the worker — running them twice from two services is unnecessary and risks racing).
