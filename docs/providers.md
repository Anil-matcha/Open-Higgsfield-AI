# Provider Reference

Four adapters live in `lib/providers/`, all serving Bytedance Seedance 2.0 i2v at different price points and policy levels. This page documents each one's contract with the upstream API plus the per-provider quirks the codebase already handles.

## Common adapter contract

Every adapter exports the same shape (registered in [`lib/providers/index.js`](../lib/providers/index.js)):

```js
export const id              // matches Batch.provider
export const label           // human-readable, used in UI dropdowns
export const defaultModel    // hardcoded model id
export const maxPollMinutes  // wall-clock ceiling for polling

async submit({ apiKey, prompt, imageBuffer, imageMime, imageFileName,
               studioImageBuffer, studioImageMime, studioImageFileName,
               jobId, duration, quality, resolution, aspectRatio, model })
  // returns { providerRequestId } for async, or { videoUrl } for sync
  // throws TerminalProviderError on 4xx / policy / malformed response
  // throws Error on 5xx / network (worker retries with backoff)

async pollResult({ apiKey, providerRequestId })
  // returns { status: 'pending' | 'done', videoUrl? }
  // same throw conventions

async uploadAsset({ apiKey, file, fileName })   // optional
  // returns { url } — only used by trainer/studio create routes
  // throw if the provider has no asset host

async estimateCost({ apiKey, batch })           // optional
  // returns { perJob, currency, raw }
  // omit if the provider has no pricing API
```

Two of these are optional. The wizard handles their absence gracefully (greyed-out cost panel, no provider-CDN trainer thumbnails for that provider).

## The two input modes

Every adapter switches between **first-frame mode** (i2v) and **reference-image mode** (multi-image anchors) at submit time, based on whether `studioImageBuffer` is populated.

| Adapter      | First-frame mode body                       | Reference-image mode body                                       | Mutually exclusive in upstream API? |
|--------------|---------------------------------------------|------------------------------------------------------------------|-------------------------------------|
| MuAPI        | `images_list: [trainer]`                    | `images_list: [trainer, studio]`                                | No (extends array)                  |
| Segmind      | `first_frame_url: <trainer>`                | `reference_images: [trainer, studio]` (no `first_frame_url`)    | **Yes**                             |
| BytePlus     | content array, role=`first_frame`           | content array, both with role=`reference_image`                 | **Yes**                             |
| OpenRouter   | `frame_images: [{frame_type:'first_frame'}]`| `input_references: [{image_url}, {image_url}]`                  | **Yes**                             |

Three of four upstream APIs treat first_frame and reference-images as mutually exclusive. We always honor that — never mix the two even when MuAPI would let us — so output behavior stays consistent across providers.

When reference-image mode is used, `lib/promptTemplate.js` rewrites the prompt text to cite "the person shown in image 1" / "the studio shown in image 2" instead of the text-only `@Trainer 1` / `@Studio 1` mentions. This matches Seedance's reference-image convention and produces more identity-locked output.

## MuAPI

**File**: `lib/providers/muapi.js`. **Default model**: `seedance-v2.0-i2v`. **Pattern**: async (submit + poll).

```
POST {MUAPI_BASE}/api/v1/upload_file       # multipart, x-api-key
  → { url }

POST {MUAPI_BASE}/api/v1/{model}           # JSON, x-api-key
  body: { prompt, images_list, aspect_ratio, duration, quality }
  → { request_id }

GET {MUAPI_BASE}/api/v1/predictions/{id}/result
  → { status: completed | succeeded | success | failed | error,
      outputs: [...], video_url? }
```

`MUAPI_BASE` defaults to `https://api.muapi.ai` and can be overridden with `MUAPI_BASE_URL`.

**Quality vocabulary**: `basic | high`. The adapter translates from our resolution strings at submit and at estimate-cost time:

```js
quality === 'high' || quality === '1080p' ? 'high' : 'basic'
```

See `lib/providers/muapi.js:43-48` (submit) and `:139-148` (estimateCost). Don't translate elsewhere — keep the translation at the adapter boundary.

**Asset upload**: yes, MuAPI hosts our trainer/studio images on its CDN. The trainer create route uploads to MuAPI as a best-effort secondary write. If MuAPI is down or the user lacks credits, the local copy is the fallback.

**estimateCost**: yes, via `POST /api/v1/app/calculate_dynamic_cost`. Body shape `{ task_name: model, payload: {aspect_ratio, duration, quality} }`. The response field name varies (`cost` / `price` / `amount`); the adapter probes all three.

**Quirks**:

- The adapter has its own `MUAPI_BASE` constant — environment override is `MUAPI_BASE_URL`, not `MUAPI_BASE`. (Yes, the inconsistency is annoying. We keep it for backwards compat.)
- `pollResult` swallows 5xx errors as `{status:'pending'}` to ride out transient outages.

## Segmind

**File**: `lib/providers/segmind.js`. **Default model**: `seedance-2.0`. **Pattern**: **sync** (submit returns the MP4 itself).

```
POST https://workflows-api.segmind.com/upload-asset
  body: { data_urls: [base64...] }, x-api-key
  → { urls: [...] }    OR    { file_urls: [...] }     # adapter accepts either

POST https://api.segmind.com/v1/{model}
  body: { prompt, duration, aspect_ratio, resolution,
          first_frame_url | reference_images }
  x-api-key
  → response body IS the MP4 (Content-Type: video/mp4)
```

Because the response body is the MP4 itself, the adapter writes it to `/data/uploads/videos/<jobId>.mp4` and returns `{videoUrl: '/api/uploads/videos/...'}` directly from `submit()`. The worker sees this and skips the polling step entirely. See `worker/index.js:163-181`.

**`pollResult` is unreachable** in normal operation. If a job ever lands in `polling` state with this adapter (a bug or future refactor mistake), `pollResult` throws `TerminalProviderError` so the worker fails the job immediately instead of spinning until the wall-clock deadline.

**Resolution**: 480p / 720p / 1080p. The wizard hint warns 1080p may fall back to a lower res at runtime per Segmind's own error guide; 720p is the safest "high quality" pick.

**Asset upload**: yes, via the same `upload-asset` endpoint. Trainer/studio create routes can use this if MuAPI isn't configured.

**estimateCost**: not implemented. Wizard renders a neutral "see provider pricing page" message.

**Quirks**:

- `upload-asset` returns the URL list as either `urls` or `file_urls` depending on which version of their API is live. Adapter accepts both; **don't** "fix" it to one shape — you'll break things the next time they rotate.
- A 2xx response with non-video content-type means a policy rejection (face filter, text filter). The generation **was billed**. Adapter throws `TerminalProviderError(..., {billed: true})`.

## BytePlus (ModelArk)

**File**: `lib/providers/byteplus.js`. **Default model**: `dreamina-seedance-2-0-260128`. **Pattern**: async (submit + poll).

```
POST https://ark.{REGION}.bytepluses.com/api/v3/contents/generations/tasks
  Authorization: Bearer <ARK_API_KEY>
  body: {
    model,
    content: [
      { type: 'text', text: prompt },
      { type: 'image_url', image_url: { url: 'data:...' }, role: 'first_frame' | 'reference_image' },
      ...
    ],
    resolution, ratio, duration, watermark: false
  }
  → { id }

GET https://ark.{REGION}.bytepluses.com/api/v3/contents/generations/tasks/{id}
  → { status: queued | running | succeeded | failed | expired,
      content: { video_url? } | content: [{video_url}], video_url? }
```

`REGION` comes from `BYTEPLUS_REGION` env var, default `ap-southeast`. **Not** `ap-southeast-1` — that DNS doesn't resolve. The default is correct; if you see DNS errors, someone overrode it.

**Resolution**: 480p / 720p only. 1080p is unsupported; the wizard hint blocks the user from picking it for BytePlus. The model itself rejects 1080p with a 4xx.

**Asset upload**: **not supported**. BytePlus has no public storage endpoint. Images go inline as base64 data URLs in every `submit()`. `uploadAsset` throws.

**estimateCost**: not implemented.

**Quirks**:

- Account-level activation: `Dreamina-Seedance-2-0-260128` isn't included in the free tier. Errors with code `ModelNotOpen` mean the user has to purchase a resource pack at `https://console.byteplus.com`. Not a code bug.
- Content-policy filter: `InputImageSensitiveContentDetected.PrivacyInformation` rejects real-person photos at the B2B API tier. Same Bytedance policy that affects OpenRouter. See troubleshooting.md.
- The polling response shape isn't documented explicitly. The adapter probes `data.video_url`, `data.content.video_url`, `data.content[].video_url.url`, `data.output.video_url`, and `data.outputs[0]` (string only) — see `lib/providers/byteplus.js:125-138`.

## OpenRouter

**File**: `lib/providers/openrouter.js`. **Default model**: `bytedance/seedance-2.0`. **Pattern**: async (submit + poll), then **stream-to-local** for download.

```
POST https://openrouter.ai/api/v1/videos
  Authorization: Bearer <OPENROUTER_API_KEY>
  Idempotency-Key: <jobId>
  body: {
    model, prompt, resolution, aspect_ratio, duration,
    frame_images | input_references
  }
  → 202 { id, polling_url, status: 'pending' }

GET https://openrouter.ai/api/v1/videos/{id}
  Authorization: Bearer ...
  → { status, unsigned_urls?: [...] }

GET unsigned_urls[0]            # auth-required! same Bearer token
  → MP4 bytes
```

Unlike the other three providers, OpenRouter's "completed" URL is **auth-protected**. The browser can't render it directly. So the adapter:

1. Polls until `status='completed'`.
2. Downloads the MP4 server-side (using the same Bearer token) to `/data/uploads/videos/<jobId>.mp4`.
3. Returns the local `/api/uploads/videos/...` URL to the worker.

This adds a download leg to the happy path but keeps the API key out of the browser. See `lib/providers/openrouter.js:133-148` (`streamToLocal`).

**Resolution**: 480p / 720p only. Same Bytedance Seedance constraint as BytePlus.

**Idempotency**: `Idempotency-Key: <jobId>` is set on every submit. If a network blip causes us to retry a submit that the upstream already received, OpenRouter returns the same response and **does not re-bill**. Don't strip this header — it's a non-negotiable charge-safety primitive.

**Asset upload**: not supported. Images go inline as base64.

**estimateCost**: not implemented. Token-based pricing on Seedance: input is free, output (the video itself) is billed at ~$7/1M output tokens with token count `(h * w * duration * 24) / 1024`. The wizard's "see provider pricing page" message is the right surface — we can't reproduce their per-account rate accurately enough to publish a number.

**Quirks**:

- Same B2B real-person filter as BytePlus. Throws `TerminalProviderError({billed: true})` on a `failed` or `error` poll status, `{billed: false}` on `cancelled`/`canceled`.
- 5xx on poll is swallowed as `{status:'pending'}` (transient).
- `streamToLocal` 4xx (expired or revoked signed URL) is terminal with `billed: true` — the video was generated and billed; retrying just re-fetches the same dead URL.

## Per-provider trade-offs at a glance

| Trait                          | MuAPI                | Segmind            | BytePlus              | OpenRouter           |
|--------------------------------|----------------------|---------------------|-----------------------|----------------------|
| Pattern                        | Async (submit+poll)  | Sync                | Async                 | Async + download leg |
| Asset CDN upload               | Yes                  | Yes                 | No (inline base64)    | No (inline base64)   |
| Cost estimate API              | Yes                  | No                  | No                    | No                   |
| Real-person filter             | No                   | No                  | Yes (B2B policy)      | Yes (B2B policy)     |
| 1080p support                  | Yes (→ 'high')       | Yes (may fall back) | No                    | No                   |
| Idempotency key                | n/a                  | n/a                 | n/a                   | Yes                  |
| `maxPollMinutes`               | 30                   | 10 (unused)         | 30                    | 30                   |
| Output URL                     | Provider CDN         | Local volume        | Provider CDN          | Local volume         |

If you're picking a provider for a new use case:

- **Cheapest, smallest blast radius for first smoke test**: Segmind. Sync mode means errors surface immediately; no polling state to debug.
- **Best price-per-second for production at scale**: OpenRouter. Token billing favors short clips at lower resolutions; the auth-protected output is the only operational gotcha.
- **B2B compliance / business account**: BytePlus directly. Same model as OpenRouter, no middleman. Budget for the resource-pack purchase.
- **Real human faces / permissive content policy**: MuAPI or Segmind. The Bytedance B2B tier (BytePlus + OpenRouter) blocks real-person photos.

## Adding a new provider

See [adding-a-provider.md](adding-a-provider.md) for the step-by-step.
