# Onboarding

Get productive on the **batch video generation** subsystem of this fork. Read this once end-to-end, then keep it open as a map while you read code.

For upstream Higgsfield-clone material (image studio, agents, workflow DAG), see `README.md` and `project_knowledge.md` — those features still ship and are untouched by anything documented here.

---

## 1. What this fork adds

Upstream is a single-user image studio that proxies to MuAPI. We bolted on a **CSV-driven batch video pipeline** for the Ahoum somatic-practice project: upload a 255-row CSV → auto-map characters/studios to uploaded reference images → pick a provider → start → walk away → download a results CSV with per-row video URLs.

New surface area lives entirely in:

```
prisma/schema.prisma        # 4 tables: trainers, studios, batches, jobs
worker/index.js             # long-lived Node loop, separate container
lib/providers/*.js          # 4 video-model adapters (common interface)
lib/promptTemplate.js       # builds the prompt sent to each provider
lib/csvParser.js            # parses the Rasika-style CSV into Job rows
app/batch/                  # the new UI route
app/api/batches/**          # CRUD + start/pause/resume/cancel/export/estimate-cost
app/api/trainers/**         # reference-image CRUD
app/api/studios/**          # reference-image CRUD
app/api/jobs/[id]/retry/    # re-queue a failed job
components/batch/*          # NewBatchWizard, BatchDetail, BatchesTab, etc.
docker-compose.yml          # adds postgres + worker services
```

If a file is **not** in that list and you're touching it for batch work, double-check — you're probably in upstream code.

---

## 2. Architecture in one diagram

```
┌──────────────┐     HTTP    ┌──────────────┐
│  Browser     │ ──────────→ │  web (Next)  │
│  /batch UI   │ ←────────── │              │
└──────────────┘             └──────┬───────┘
                                    │ Prisma
                                    ▼
                             ┌──────────────┐
                             │  postgres    │   trainers, studios,
                             │              │   batches, jobs
                             └──────┬───────┘
                                    ▲ Prisma (every 2s)
                                    │
                             ┌──────┴───────┐    HTTP    ┌────────────────┐
                             │  worker      │ ─────────→ │  provider APIs │
                             │  node loop   │ ←───────── │  (4 of them)   │
                             └──────────────┘            └────────────────┘
```

**Three docker-compose services**: `web`, `worker`, `postgres`. The worker is split out from Next.js on purpose — it's a long-lived loop that survives request timeouts, browser closes, and dev rebuilds. Postgres doubles as the queue (no Redis, no BullMQ); claim safety comes from `FOR UPDATE SKIP LOCKED`.

---

## 3. Local dev — first 10 minutes

```bash
# 1. Provider keys + DB url
cp .env.example .env
# fill at minimum one of: MUAPI_API_KEY, SEGMIND_API_KEY, BYTEPLUS_API_KEY, OPENROUTER_API_KEY
# (you'll see only providers with a key in the wizard dropdown)

# 2. Build & start everything
docker compose up -d --build

# 3. Migrations run on web container start; verify with:
docker compose exec postgres psql -U ogai -c "\dt"
# expect: trainers, studios, batches, jobs

# 4. Tail worker logs in one terminal
docker compose logs -f worker

# 5. Open the UI
# http://localhost:3000/batch
```

Day-to-day:

- Edit JS/JSX → `docker compose restart web` (or rebuild if you edited deps).
- Edit `worker/index.js` or `lib/providers/*` → `docker compose restart worker` (or rebuild — worker bakes JS at build time, no hot reload).
- After a `web` rebuild, **hard-refresh the browser** (`Ctrl+Shift+R`). The wizard JS is bundled and the browser will happily serve a stale `_next/static` file.
- Schema change → `npx prisma migrate dev --name <change>` against the running postgres (the host port is `5433`, see `docker-compose.yml`).

---

## 4. The four database tables

```
Trainer / Studio    reference images. csvLabel ("Trainer 1", "Studio 4")
                    is what the auto-mapper joins on against the CSV.
                    localPath = file on /data/uploads volume.
                    imageUrl  = optional CDN URL (some providers cache).

Batch               one row per CSV upload. Tracks provider/model/duration/
                    quality/aspectRatio/concurrency + status/total/done/failed.
                    status: draft → running ↔ paused → completed | cancelled

Job                 one row per CSV row. FK to batch + trainer + studio.
                    status: queued → submitting → polling → done | failed
                    providerRequestId is the upstream task id we poll on.
                    nextAttemptAt drives backoff after retryable failures.
```

### Naming gotcha — `quality` actually stores resolution

The `Job.quality` and `Batch.quality` columns are a historical name. They now hold **resolution strings**: `'480p'`, `'720p'`, `'1080p'`. The wizard exposes them as a Resolution dropdown. Each adapter passes them through unchanged **except MuAPI**, whose API only understands `'basic' | 'high'`. The translation happens at the adapter boundary in `lib/providers/muapi.js` — don't hunt for it in the worker.

---

## 5. Job lifecycle

```
                    ┌─ retry (manual) ──┐
                    ▼                   │
queued ─→ submitting ─→ polling ─→ done │
   ▲           │            │        │  │
   │           │            │        │  │
   └─ backoff ─┴── failed ──┴────────┴──┘
       (retries < 3)         (retries ≥ 3
                              OR Terminal)
```

What flips each transition (all in `worker/index.js`):

- **queued → submitting**: `claimJobs()` SELECTs queued rows with `FOR UPDATE SKIP LOCKED`, then bulk-updates them to `submitting`. This is atomic — two workers cannot claim the same row.
- **submitting → polling**: provider's `submit()` returned a `providerRequestId`. We persist it; subsequent ticks poll on it.
- **submitting → done** (rare, sync providers): provider's `submit()` returned a `videoUrl` directly. Today only Segmind sync mode does this.
- **polling → done**: provider's `pollResult()` returned `{status: 'done', videoUrl}`.
- **\* → failed**: either a `TerminalProviderError` was thrown (no retry — same input will fail the same way) **or** retries hit 3 with regular Errors.
- **failed → queued** (`POST /api/jobs/[id]/retry`): resets retries, clears `providerRequestId`, and bumps the parent batch back to `running` if it had auto-completed.

### Crash recovery (`recoverOrphans()` at boot)

- `polling` jobs are **safe** — we have `providerRequestId`, the next tick resumes polling. Free.
- `submitting` jobs are **dangerous** — we may have already fired the upstream HTTP request and gotten charged, but crashed before persisting the request id. Re-submitting would double-charge. The recovery path marks them `failed` with a clear error telling the user to verify on the provider dashboard before clicking Retry.

### Wall-clock deadline

Each provider exports `maxPollMinutes` (typically 30). If a job has been `polling` longer than that, the worker fails it terminally with a "may still complete on provider side, check dashboard" message. This stops dead `providerRequestId`s from polling forever.

---

## 6. The provider abstraction

All four providers ultimately serve **Bytedance Seedance 2.0 i2v**, but at different price points, with different content policies, and different request shapes. The adapter pattern hides those differences from the worker.

```js
// lib/providers/<id>.js — every adapter exports:
export const id            // matches Batch.provider
export const label         // human label for UI
export const defaultModel  // hard-coded model id
export const maxPollMinutes

export async function submit({ apiKey, prompt, imageBuffer, imageMime,
                               studioImageBuffer, studioImageMime,
                               duration, quality, resolution, aspectRatio,
                               model, jobId })
  // returns { providerRequestId, videoUrl? }
  // if videoUrl is set, worker skips polling

export async function pollResult({ apiKey, providerRequestId })
  // returns { status: 'pending'|'done', videoUrl? }
  // throws TerminalProviderError on policy/4xx/malformed responses

export async function uploadAsset({ apiKey, file, fileName })
  // returns { url } — used by trainer/studio create routes
  // throw if the provider has no asset host (BytePlus)

export async function estimateCost({ apiKey, batch })
  // returns { perJob, currency, raw } — optional
  // OpenRouter and BytePlus omit this; the API route handles that gracefully
```

Registry: `lib/providers/index.js`. To add a fifth provider:

1. Create `lib/providers/<id>.js` exporting the shape above.
2. Import + register it in `lib/providers/index.js`.
3. Add `<ID>_API_KEY` to both `web` and `worker` env in `docker-compose.yml`.
4. Add a hint case in `components/batch/NewBatchWizard.jsx`'s `resolutionHint()` if the provider has unusual resolution support.
5. `docker compose up -d --build`. The wizard auto-discovers it.

### Two input modes

Every Seedance variant accepts EITHER:

- **i2v (first-frame)** — single image becomes the first frame; model animates outward from it.
- **reference images** — 1+ images act as visual anchors for character/style/environment; model freely composes the scene.

These are **mutually exclusive** at the upstream API. The worker decides per job:

- Trainer only → first-frame mode.
- Trainer + studio → reference-image mode (both go in as anchors).

Each adapter implements the switch in its own way:

| Provider   | First-frame mode                       | Reference mode                                         |
|------------|----------------------------------------|--------------------------------------------------------|
| MuAPI      | `images_list: [trainer]`               | `images_list: [trainer, studio]`                       |
| Segmind    | `first_frame_url`                      | `reference_images: [trainer, studio]` (no first_frame) |
| BytePlus   | content array, role=`first_frame`      | content array, both with role=`reference_image`        |
| OpenRouter | `frame_images` with `first_frame` type | `input_references` (mutually exclusive with frames)    |

`lib/promptTemplate.js` adapts the prompt text to match: when `hasStudioImage: true`, it cites "person shown in image 1 / studio shown in image 2"; when false, it falls back to text-only `@Trainer 1` / `@Studio 1` mentions.

### `TerminalProviderError`

Adapters throw this for **non-retryable** failures (4xx client errors, content-policy rejections, malformed responses). The `billed` flag tells the user whether the provider likely charged for the failed attempt:

- `billed: false` — 4xx that never started generation. Safe to retry without paying twice.
- `billed: true` — policy rejection on a 2xx, generation ran. Retry will re-bill.
- `billed: null` — unknown; user should verify on the provider dashboard.

The worker persists this to `Job.billed` (Boolean?) so it's part of the API response and queryable from SQL — readers can warn the user before retry. Cleared back to `null` on manual retry.

---

## 7. Per-provider quirks (already in code, don't re-discover them)

**MuAPI**

- Quality vocabulary is `basic | high`, not pixel resolutions. Translated at adapter boundary; everywhere else uses `480p / 720p / 1080p`.
- Has its own asset CDN; `uploadAsset` works.

**Segmind**

- `upload-asset` endpoint returns the URL list as either `urls` or `file_urls` depending on the day. Adapter accepts both — don't "fix" one of them.
- Sync mode: certain models return the MP4 in the response body, no polling needed. The adapter detects this and returns `videoUrl` directly from `submit()`. The worker handles it.
- 1080p is accepted but may fall back at runtime — the wizard hint warns about this.

**BytePlus (ModelArk)**

- Region must be `ap-southeast`. **Not** `ap-southeast-1` — that DNS doesn't resolve. `BYTEPLUS_REGION` defaults to the correct value; if someone overrides it, point them at this paragraph.
- No asset upload endpoint — `uploadAsset` throws. Images are sent inline as base64 data URLs in every `submit()` call.
- Free tier doesn't include Dreamina-Seedance — needs a paid resource pack. `ModelNotOpen` errors mean account state, not code bug.
- 1080p unsupported. Real-person filter is on (Bytedance B2B policy).

**OpenRouter**

- Sends `Idempotency-Key: <jobId>` on submit so retries on policy rejections don't double-charge. Don't strip this.
- No `estimateCost`. The API route returns `{supported: false, message}` and the wizard renders a neutral info panel — this is expected, not a bug.
- 1080p unsupported. Real-person filter is on (same upstream Bytedance B2B policy as BytePlus).

---

## 8. Common debugging paths

**"Why is my job stuck?"**
Worker logs are JSON-per-line. Filter by event:

```bash
docker compose logs worker | grep submit.fail
docker compose logs worker | grep poll.terminal
docker compose logs worker | grep poll.deadline_exceeded
```

The `err` field is the upstream message verbatim. `terminal: true` means it won't auto-retry — fix the input.

**"Wizard greys out a provider I configured"**
Worker startup log shows `providersWithKeys: ["muapi","segmind",...]`. If your provider isn't there, the env var didn't reach the container. Check `.env` and that you ran `docker compose up -d` (not `restart` — `restart` doesn't re-read env).

**"Estimate panel says 'pricing API not exposed'"**
That provider has no `estimateCost`. Expected for OpenRouter and BytePlus. Not a bug.

**"Retry button looks like it did nothing"**
It re-queues the job and flips `batch.status` from `completed` back to `running` — both transitions live in `app/api/jobs/[id]/retry/route.js`. The worker picks it up on the next 2s tick. If nothing happens after 5s, check worker logs for `submit.fail`.

**"Studio image isn't influencing the video"**
Confirm reference-image mode is firing. Check the worker log for the corresponding `submit.ok` and look at the request body in the provider's dashboard. If the adapter is in first-frame mode, it means `studioAsset` was null in `loadAssetBuffer` — usually a missing `localPath` on the Studio row.

---

## 9. How not to break things

Hard-won rules from this codebase:

- **Don't poll without a deadline.** Every provider must export `maxPollMinutes`. Without it, dead `providerRequestId`s poll forever.
- **Don't mix charge-safety semantics.** A `TerminalProviderError` MUST set `billed` correctly. Defaulting to `null` is fine; lying with `false` when the provider actually charged is not.
- **Don't add an "auto-retry" for content-policy rejections.** They are deterministic — retrying re-bills and re-fails. Use `TerminalProviderError`, which skips the backoff loop.
- **Don't store per-trainer CDN URLs and reuse them across providers.** Each provider has its own asset host (or none). The worker re-uploads from disk per job; trainer rows keep `localPath` as the source of truth.
- **Don't bypass the `csvLabel` auto-mapper for one-off tweaks.** The wizard's per-row override dropdown handles that; if you find yourself wanting to touch the parser, you probably want the override instead.
- **Don't widen scope inside a bug fix.** Branch-per-change, PR-per-change. The git log makes it obvious which commit caused which behavior — keep it that way.

---

## 10. Where to look for X

| Need to…                               | File                                              |
|----------------------------------------|---------------------------------------------------|
| Add a provider                         | `lib/providers/<id>.js` + `lib/providers/index.js` |
| Change retry/backoff policy            | `worker/index.js` → `markFailureWithBackoff`      |
| Change crash-recovery semantics        | `worker/index.js` → `recoverOrphans`              |
| Change polling deadline                | `lib/providers/<id>.js` → `maxPollMinutes` export |
| Change the prompt format               | `lib/promptTemplate.js`                           |
| Change CSV column mapping              | `lib/csvParser.js`                                |
| Change wizard defaults / hints         | `components/batch/NewBatchWizard.jsx`             |
| Change job lifecycle states            | `prisma/schema.prisma` + `worker/index.js`        |
| Add a batch-level action               | `app/api/batches/[id]/<action>/route.js`          |
| Add a column to the export CSV         | `app/api/batches/[id]/export/route.js`            |

---

That's the whole map. Read `worker/index.js` and `lib/providers/segmind.js` end-to-end after this — between them they exercise every pattern in the system.

---

## 11. Going deeper

ONBOARDING.md is the orientation. Once you've read it and skimmed those two files, the [`docs/`](docs/) tree has the deep dives:

| Doc                                                 | When to read                                                              |
|-----------------------------------------------------|---------------------------------------------------------------------------|
| [`docs/architecture.md`](docs/architecture.md)      | First. Why the three-service split, why Postgres-as-queue, decision log.  |
| [`docs/data-model.md`](docs/data-model.md)          | Before any schema change. Every table, column, index; both state machines.|
| [`docs/providers.md`](docs/providers.md)            | Before touching any adapter. Each provider's upstream contract + quirks.   |
| [`docs/worker-internals.md`](docs/worker-internals.md) | Before changing the tick loop, claim, retry, or recovery logic.        |
| [`docs/api-reference.md`](docs/api-reference.md)    | Lookup. Every endpoint with request/response shape.                       |
| [`docs/operations.md`](docs/operations.md)          | Day-to-day commands: env vars, migrations, logs, scaling, backups.        |
| [`docs/troubleshooting.md`](docs/troubleshooting.md)| Symptom-first index for known failure modes.                              |
| [`docs/adding-a-provider.md`](docs/adding-a-provider.md) | Tutorial — plug a 5th video model in 5 steps.                        |

Update the relevant doc in the same PR that changes the underlying behavior. Drift here costs the next person hours.
