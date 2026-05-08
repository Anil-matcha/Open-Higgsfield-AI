# API Reference

Every HTTP endpoint added by the batch subsystem. All paths are relative to the `web` service (default `http://localhost:3000`). Auth is via `x-api-key` header (preferred) or `muapi_key` cookie; some endpoints don't require it (read-only listing of internal state).

> **Convention** — every error response is `{ error: '<message>' }` with the appropriate status. Successful responses are `{ <resourceName>: <object> }` or `{ <resourceName>s: [<objects>] }`. Endpoints that don't return a resource use `{ ok: true }`.

## Provider registry

### `GET /api/providers`

List all configured provider adapters.

**Response 200**:
```json
{
  "providers": [
    { "id": "muapi",     "label": "MuAPI",              "defaultModel": "seedance-v2.0-i2v" },
    { "id": "segmind",   "label": "Segmind",            "defaultModel": "seedance-2.0" },
    { "id": "byteplus",  "label": "BytePlus ModelArk",  "defaultModel": "dreamina-seedance-2-0-260128" },
    { "id": "openrouter","label": "OpenRouter",         "defaultModel": "bytedance/seedance-2.0" }
  ]
}
```

The wizard's BatchShell augments this list with a `hasKey` boolean (computed server-side from env presence) before passing it to `NewBatchWizard`.

## Trainers

### `GET /api/trainers`

**Response 200**: `{ trainers: [...] }` ordered by `createdAt asc`.

### `POST /api/trainers`

Create a trainer with an image upload. **Multipart form**:

| Field      | Type   | Required | Notes                                           |
|------------|--------|----------|-------------------------------------------------|
| name       | string | yes      | Display name                                    |
| csvLabel   | string | no       | Used by auto-mapper. Unique across trainers.    |
| image      | file   | yes      | jpg / png / webp / gif                          |

Side effects:
- Writes the file to `/data/uploads/trainers/<cuid>.<ext>` (the `uploads_data` volume).
- Best-effort upload to MuAPI CDN (skipped if no `x-api-key`/`muapi_key` available).
- Inserts the row, then `update`s with `imageUrl` and `localPath`.

**Response 201**: `{ trainer, muapiNote }` where `muapiNote` is `null` on success or a string explaining why the CDN upload didn't happen.

**Errors**:
- `400` — `name is required`, `image file is required`, `Invalid multipart body`.
- `409` — `csvLabel "..." is already used by trainer "..."`.
- `500` — both MuAPI and local write failed (rare; trainer row is rolled back).

### `DELETE /api/trainers/:id`

**Response 200**: `{ ok: true }`.

**Errors**:
- `409` — Trainer is referenced by N active jobs (`queued`/`submitting`/`polling`). Pause or cancel those batches first.
- `404` — Trainer not found (Prisma `P2025`).

## Studios

Identical shape to `/api/trainers`. Same fields, same constraints, same error semantics. Substitute `trainer` → `studio` everywhere.

- `GET /api/studios`
- `POST /api/studios` (multipart: `name`, `csvLabel`, `image`)
- `DELETE /api/studios/:id`

## Local upload streaming

### `GET /api/uploads/:kind/:name`

Streams a file from the local volume. Used by the wizard thumbnail strip and the `BatchDetail` video player when the provider returns local URLs (Segmind, OpenRouter).

| Path param | Allowed values                |
|------------|-------------------------------|
| `kind`     | `trainers`, `studios`, `videos` |
| `name`     | URI-encoded filename inside that kind directory |

**Response 200**: file bytes with appropriate `Content-Type`. `Cache-Control: private, max-age=3600`.

**Errors**:
- `404` — unknown asset kind, or file doesn't exist.

## Batches

### `GET /api/batches`

List all batches. **Response 200**:
```json
{ "batches": [
  {
    "id": "...",
    "name": "...",
    "provider": "muapi",
    "model": "seedance-v2.0-i2v",
    "duration": 15,
    "quality": "480p",
    "aspectRatio": "16:9",
    "concurrency": 5,
    "status": "running",
    "total": 255,
    "done": 12,
    "failed": 0,
    "createdAt": "2026-...",
    "updatedAt": "2026-..."
  }
]}
```

Ordered by `createdAt desc`. Joined relations (jobs/trainers/studios) **are not included** — that's the per-batch detail endpoint below.

### `POST /api/batches`

Create a batch with all its jobs in one request. **JSON body**:

| Field       | Type    | Required | Default              | Notes                                                                |
|-------------|---------|----------|----------------------|----------------------------------------------------------------------|
| name        | string  | yes      |                      |                                                                      |
| provider    | string  | yes      |                      | Must match a registered provider id                                  |
| model       | string  | no       | provider.defaultModel|                                                                      |
| duration    | int     | no       | 15                   |                                                                      |
| quality     | string  | no       | `'basic'`            | Wizard sends `'480p' / '720p' / '1080p'`                             |
| aspectRatio | string  | no       | `'16:9'`             |                                                                      |
| concurrency | int     | no       | 5                    |                                                                      |
| jobs        | array   | yes      |                      | Non-empty. See job shape below.                                       |

**Job shape** (per row):
```json
{
  "rowIndex": 0,
  "practiceName": "Mountain pose",
  "trainerId": "cuid_or_null",
  "studioId": "cuid_or_null",
  "prompt": "raw practice description",
  "startPosition": "...",
  "cameraAngle": "...",
  "duration": 15,
  "quality": "480p",
  "aspectRatio": "16:9"
}
```

Per-row `duration`/`quality`/`aspectRatio` override the batch defaults if present.

The created batch starts in `status: 'draft'` — call `start` to begin generation.

**Response 201**: `{ batch: { id, name, provider, status, total, createdAt } }` (selected fields only).

**Errors**:
- `400` — `name is required`, `provider is required`, `Unknown provider: ...`, `jobs must be a non-empty array`, `Invalid JSON body`.

### `GET /api/batches/:id`

Fetch the full batch with all jobs joined. Used by `BatchDetail.jsx` (polled every 3s).

**Response 200**: `{ batch: { ..., jobs: [{...job, trainer:{...}, studio:{...}}, ...] } }` — jobs ordered by `rowIndex asc`. Trainer/studio joins include `id`, `name`, `csvLabel`, `imageUrl` only.

**Errors**:
- `404` — Batch not found.

### `POST /api/batches/:id/start`

Flip `status: draft|paused → running` and any `draft|cancelled` jobs in the batch to `queued`. Idempotent — calling on an already-running batch returns 200 with the unchanged batch.

**Errors**:
- `404` — Batch not found.
- `409` — `Cannot start batch in status "<status>"` (e.g., `completed` or `cancelled`).

### `POST /api/batches/:id/pause`

`status: running → paused`. The worker stops claiming new jobs for this batch but lets in-flight ones complete naturally.

**Errors**:
- `404` — Batch not found.
- `409` — `Can only pause running batches (was "<status>")`.

### `POST /api/batches/:id/resume`

`status: paused → running`.

**Errors**:
- `404` — Batch not found.
- `409` — `Can only resume paused batches (was "<status>")`.

### `POST /api/batches/:id/cancel`

`status: → cancelled` from any state except already `completed`/`cancelled`. Bulk-flips `queued`/`draft` jobs to `cancelled`. **In-flight jobs (`submitting`/`polling`) finish naturally** — cancellation doesn't kill upstream provider tasks.

**Errors**:
- `404` — Batch not found.
- `409` — `Batch already <status>`.

### `POST /api/batches/:id/estimate-cost`

Calls the provider's pricing endpoint (if available) and multiplies by row count.

**Headers**: `x-api-key: <provider key>` required.

**Response 200 (provider supports it)**:
```json
{
  "perJob": 0.018,
  "rows": 255,
  "total": 4.59,
  "currency": "USD",
  "raw": { ... }
}
```

**Response 200 (provider doesn't expose pricing)**:
```json
{
  "supported": false,
  "message": "OpenRouter does not expose a pricing API — see the provider's pricing page for per-clip rates.",
  "rows": 255,
  "perJob": null,
  "total": null,
  "currency": null
}
```

**Errors**:
- `401` — API key for provider "..." required.
- `404` — Batch not found.
- `400` — Unknown provider.
- `502` — Cost estimate failed (upstream pricing API errored).

### `GET /api/batches/:id/export`

Stream a CSV of all rows with status. Columns:
```
Row, Practice Name, Trainer, Studio, Status, Video URL, Error, Retries
```

**Response 200**: `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="<slug>-results.csv"`.

**Errors**:
- `404` — Batch not found.

## Jobs

### `POST /api/jobs/:id/retry`

Re-queue a `failed` job. Fully resets it: `status='queued'`, `retries=0`, `error=null`, `billed=null`, `nextAttemptAt=null`, `providerRequestId=null`, `startedAt=null`, `completedAt=null`.

Side effects:
- Decrements `Batch.failed`.
- If the parent batch was `completed`, flips it back to `running` so the worker picks the requeued job up.

**Response 200**: `{ job: <updated job> }` — includes the `billed` field from the prior failed attempt is now `null` after reset.

**Errors**:
- `404` — Job not found.
- `409` — `Cannot retry a job in status "<status>". Only failed jobs can be retried.` Guards against racing the worker on `polling` / `submitting` jobs (which would risk double-charge).

## Conventions across the surface

- **CUIDs** for all primary keys, never UUIDs.
- **Timestamps** are ISO 8601 strings in JSON. Postgres stores them as `timestamptz`.
- **Statuses** are lowercase strings, not enums (Prisma supports enums; we picked strings to avoid migration ceremony for what's effectively a constant set).
- **Pagination**: not implemented. The endpoints return all rows. Acceptable today (one team, hundreds of jobs per batch). If you ever fetch >5k jobs at once, add cursor pagination to the detail endpoint first.
- **Error bodies** always carry `{ error }` — no `code`/`details` shape. Match this when adding new endpoints.
