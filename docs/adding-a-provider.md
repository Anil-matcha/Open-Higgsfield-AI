# Adding a New Video Provider

End-to-end tutorial. Plugging a 5th provider into the system takes one new file plus three small edits.

The example uses a fictional **"Lumen"** provider with an async submit/poll API that supports both i2v (single image) and reference-image (multi-image) modes.

## Prerequisites

Before writing the adapter, you need:

1. The provider's HTTP API documented at request-body level: model id, fields for prompt / image / duration / resolution / aspect ratio, the polling response shape.
2. An API key.
3. One verified successful generation through the provider's own playground or curl — establishes that the model works for your use case before you wire it through our system.

If you skip step 3 and start adapting blind, every bug you hit could be ours OR theirs and you won't know which.

## Step 1: Write the adapter

Create `lib/providers/lumen.js`:

```js
// Lumen adapter — describe model + pattern in one short header.
//
// POST {BASE}/v1/generate                   # JSON, x-api-key
//   body: { model, prompt, image_urls, duration, resolution, aspect_ratio }
//   → { task_id }
//
// GET {BASE}/v1/generate/{task_id}
//   → { status: queued|processing|done|failed, output_url? }

import { TerminalProviderError } from './errors.js';

const BASE = process.env.LUMEN_BASE_URL || 'https://api.lumen.example';

export const id = 'lumen';
export const label = 'Lumen';
export const defaultModel = 'lumen-i2v-1.0';
// Pick a value above the provider's documented worst-case generation time.
// Worker uses this as the wall-clock deadline; phantom polling beyond this
// is terminally failed.
export const maxPollMinutes = 20;

const TERMINAL_OK = new Set(['done', 'completed', 'success']);
const TERMINAL_FAIL = new Set(['failed', 'error', 'cancelled']);

export async function submit({
  apiKey, prompt,
  imageBuffer, imageMime,
  studioImageBuffer, studioImageMime,
  duration, resolution, aspectRatio, model,
}) {
  const trainerDataUrl = `data:${imageMime || 'image/jpeg'};base64,${imageBuffer.toString('base64')}`;
  const studioDataUrl = studioImageBuffer
    ? `data:${studioImageMime || 'image/jpeg'};base64,${studioImageBuffer.toString('base64')}`
    : null;

  // Lumen accepts an array of images. With studio present we send both as
  // anchors; otherwise a single trainer image acts as the first frame.
  // (If your provider has mutually-exclusive modes, pick one or the other —
  // see Segmind/OpenRouter/BytePlus adapters for that pattern.)
  const image_urls = studioDataUrl ? [trainerDataUrl, studioDataUrl] : [trainerDataUrl];

  const payload = {
    model: model || defaultModel,
    prompt,
    image_urls,
    duration,
    resolution: resolution || '480p',
    aspect_ratio: aspectRatio,
  };

  const res = await fetch(`${BASE}/v1/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = `Lumen ${res.status}: ${text.slice(0, 300)}`;
    if (res.status >= 400 && res.status < 500) {
      // 4xx never started generation — safe to declare not billed.
      throw new TerminalProviderError(msg, { billed: false });
    }
    // 5xx and network errors fall through to retry/backoff in the worker.
    throw new Error(msg);
  }

  const data = await res.json();
  if (!data.task_id) {
    throw new TerminalProviderError(
      `Lumen: no task_id in response: ${JSON.stringify(data).slice(0, 200)}`,
      { billed: null },
    );
  }
  return { providerRequestId: data.task_id };
}

export async function pollResult({ apiKey, providerRequestId }) {
  const res = await fetch(`${BASE}/v1/generate/${providerRequestId}`, {
    headers: { 'x-api-key': apiKey },
  });

  if (!res.ok) {
    if (res.status >= 500) return { status: 'pending' };  // transient
    const text = await res.text().catch(() => '');
    throw new TerminalProviderError(
      `Lumen poll ${res.status}: ${text.slice(0, 200)}`,
      { billed: null },
    );
  }

  const data = await res.json();
  const s = (data.status || '').toLowerCase();

  if (TERMINAL_OK.has(s)) {
    if (!data.output_url) {
      throw new TerminalProviderError(
        `Lumen done but no output_url: ${JSON.stringify(data).slice(0, 200)}`,
        { billed: true },
      );
    }
    return { status: 'done', videoUrl: data.output_url };
  }
  if (TERMINAL_FAIL.has(s)) {
    throw new TerminalProviderError(
      data.error?.message || data.message || `Lumen status: ${s}`,
      { billed: s === 'failed' || s === 'error' },
    );
  }
  return { status: 'pending' };
}

// Optional. Skip if Lumen has no asset host — images are sent inline above.
export async function uploadAsset() {
  throw new Error('Lumen does not provide an asset upload endpoint; images are sent inline per job.');
}

// Optional. Skip if Lumen has no pricing API.
// export async function estimateCost({ apiKey, batch }) { ... }
```

### Adapter checklist

The above hits every load-bearing concern:

- [x] Exports `id`, `label`, `defaultModel`, `maxPollMinutes`.
- [x] `submit()` returns `{ providerRequestId }` for async, or `{ videoUrl }` for sync.
- [x] `submit()` throws `TerminalProviderError` on 4xx with **explicit `billed`**.
- [x] `submit()` throws regular `Error` on 5xx (worker retries).
- [x] `pollResult()` returns `{status: 'pending'|'done', videoUrl?}` or throws `TerminalProviderError`.
- [x] Both functions handle the studio image conditionally — passes both anchors when present, single image when not.
- [x] `BASE` is overridable via env var so tests can point at a fake.
- [x] Truncates response text in error messages (`text.slice(0, 300)`) so logs stay readable.

## Step 2: Register the adapter

Add to `lib/providers/index.js`:

```js
import * as muapi from './muapi.js';
import * as segmind from './segmind.js';
import * as byteplus from './byteplus.js';
import * as openrouter from './openrouter.js';
import * as lumen from './lumen.js';   // ← new

const REGISTRY = {
  [muapi.id]: muapi,
  [segmind.id]: segmind,
  [byteplus.id]: byteplus,
  [openrouter.id]: openrouter,
  [lumen.id]: lumen,                   // ← new
};
```

That's it for the registry. `getProvider(id)` and `listProviders()` automatically pick up new entries.

## Step 3: Wire env vars

In `docker-compose.yml`, add `LUMEN_API_KEY` to **both** the `web` and `worker` services:

```yaml
services:
  web:
    environment:
      ...
      - LUMEN_API_KEY=${LUMEN_API_KEY:-}

  worker:
    environment:
      ...
      - LUMEN_API_KEY=${LUMEN_API_KEY:-}
```

In `worker/index.js`, add to the `API_KEYS` map:

```js
const API_KEYS = {
  muapi: process.env.MUAPI_API_KEY || '',
  segmind: process.env.SEGMIND_API_KEY || '',
  byteplus: process.env.BYTEPLUS_API_KEY || '',
  openrouter: process.env.OPENROUTER_API_KEY || '',
  lumen: process.env.LUMEN_API_KEY || '',     // ← new
};
```

Add to `.env.example`:
```
LUMEN_API_KEY=
```

## Step 4: (Optional) Add a wizard hint

If your provider has unusual resolution support, add a case in `components/batch/NewBatchWizard.jsx` → `resolutionHint(provider)`:

```js
function resolutionHint(provider) {
  if (provider === 'openrouter' || provider === 'byteplus') return '1080p is not supported on this provider — pick 480p or 720p.';
  if (provider === 'segmind') return '1080p is accepted but may fall back at runtime — 720p is the safest high-quality option.';
  if (provider === 'muapi') return 'MuAPI translates 1080p to its internal "high" quality.';
  if (provider === 'lumen') return 'Lumen accepts 480p only. Higher resolutions error out.';   // ← new
  return '';
}
```

The wizard pulls the rest of the provider data (label, defaultModel, hasKey) automatically from `/api/providers`.

## Step 5: Smoke test

```bash
docker compose up -d --build

# Worker should show all providers including lumen
docker compose logs worker | grep starting
# providersWithKeys: ["muapi","segmind","byteplus","openrouter","lumen"]
```

Now in the UI:

1. Upload one trainer + one studio (re-using existing rows is fine).
2. Create a batch with a 1-row CSV, pick **Lumen** as the provider, set duration 5s.
3. Save and start. Watch worker logs:
   ```bash
   docker compose logs -f worker
   ```
4. Expected log progression:
   - `submit.ok jobId=... providerRequestId=... provider=lumen`
   - `poll.done jobId=... videoUrl=...` (after a few ticks)
5. Open the BatchDetail view — the video URL should play.

If anything 4xx's, hit the same payload through Lumen's playground first. The adapter is < 100 lines; if a difference between our request and the playground request is the cause, it'll show up immediately in a JSON diff.

## What if the provider is sync (response IS the video)?

See `lib/providers/segmind.js` as the reference. Key differences:

- `submit()` reads the response body as a buffer and writes to `/data/uploads/videos/<jobId>.mp4`.
- Returns `{videoUrl: '/api/uploads/videos/...'}` directly from `submit()` — no `providerRequestId`.
- The worker's `submitJob` recognizes the videoUrl and skips polling (`worker/index.js:163-181`).
- `pollResult` should still exist but throw / return failed — it should never be called.

## What if the provider's "completed" URL needs auth?

See `lib/providers/openrouter.js`. Pattern:

1. Provider returns `unsigned_urls: [...]` in the poll response.
2. Adapter fetches the bytes server-side using its own API key.
3. Writes to `/data/uploads/videos/<jobId>.mp4`.
4. Returns the local `/api/uploads/videos/...` URL — keeps the API key out of the browser.

## What if the provider supports per-request idempotency?

Always use it. Pattern from OpenRouter:

```js
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
};
if (jobId) headers['Idempotency-Key'] = jobId;
```

`jobId` is in the kwargs passed to `submit()` (`worker/index.js:150`). Same `jobId` on a retry → upstream returns cached response → no double charge. This is one of the few primitives that's almost free to add and saves real money under failure.

## Don't do these

- **Don't** add an `estimateCost` that calls the provider with a probe submission. Cost estimation must be free; if the provider doesn't expose a pricing API, omit `estimateCost` entirely. The wizard handles its absence.
- **Don't** make `pollResult` retry the submit on `failed`. Failed-on-poll means generation ran. Retry would re-bill.
- **Don't** swallow 4xx errors as `pending`. They're terminal; let `TerminalProviderError` propagate.
- **Don't** read API keys directly inside the adapter via `process.env.X`. The worker passes `apiKey` explicitly so the same adapter can be unit-tested against a fake server with a fake key.
- **Don't** add provider-specific UI components. The wizard renders the same shape for every provider; if you need a provider-specific config, add a generic field in `Batch` first and let all providers use it.

## Checklist before opening the PR

- [ ] Adapter exports the full contract; `lib/providers/index.js` registers it.
- [ ] Env var added to both web and worker services in `docker-compose.yml` AND to `.env.example`.
- [ ] Worker `API_KEYS` map includes the new id.
- [ ] `resolutionHint` covers your provider's resolution caveats.
- [ ] Smoke test passes: 1 row, real trainer, real studio, watch the worker log it through.
- [ ] [providers.md](providers.md) updated with the new row in the comparison table and a dedicated section.
- [ ] [troubleshooting.md](troubleshooting.md) gets new entries for any quirks discovered during the smoke test.
