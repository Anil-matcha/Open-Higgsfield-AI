# Troubleshooting

Symptom-first index. When something breaks, find the row that matches the symptom, follow the diagnosis steps, apply the fix.

## Worker log filters you'll use constantly

```bash
docker compose logs -f worker | grep submit.fail
docker compose logs -f worker | grep poll.terminal
docker compose logs -f worker | grep poll.deadline_exceeded
docker compose logs -f worker | grep recover.submitting
docker compose logs -f worker | grep tick.error
```

Every log line is JSON. Pipe to `jq` for structured filtering:

```bash
docker compose logs --no-color worker | grep submit.fail | jq 'select(.terminal == true)'
```

## Symptoms

### Wizard greys out a provider I configured

**Diagnose**:
```bash
docker compose logs worker | grep starting
# expect: providersWithKeys: ["muapi","segmind","byteplus","openrouter"]
```
If your provider isn't in the list, the env var didn't reach the container.

**Fix**:
1. Check `.env` for typos in the var name (`MUAPI_API_KEY`, not `MUAPI_KEY`).
2. Re-run `docker compose up -d` (NOT `restart` — `restart` doesn't re-read env vars).
3. Hard-refresh the browser; the wizard reads `/api/providers` server-side and Next caches.

---

### "Provider 'X' does not support cost estimation" / cost panel says "see provider pricing page"

**Cause**: Working as designed. OpenRouter and BytePlus don't expose a pricing API. The estimate-cost endpoint returns `200 { supported: false, message }`; the wizard renders the message neutrally.

**Fix**: Click through. The batch will still create and run. See providers.md for actual per-provider rates.

---

### Job stuck in `polling` forever

**Diagnose**:
```sql
SELECT id, batch_id, status, started_at, NOW() - started_at AS age,
       provider_request_id
FROM jobs WHERE status='polling'
ORDER BY started_at ASC;
```
- If `age < provider.maxPollMinutes`: it's still legitimately polling. Leave it.
- If `age > maxPollMinutes`: the wall-clock deadline didn't fire. That's a worker bug.

**Fix**:
1. Check worker logs for `poll.error` events on this job — repeated transient failures (5xx, network) keep the job in `polling` without making progress.
2. If the upstream provider task genuinely died, manually fail it:
   ```sql
   UPDATE jobs SET status='failed',
                   error='Manual fail — phantom polling',
                   completed_at=NOW()
   WHERE id='<jobId>';
   UPDATE batches SET failed = failed + 1 WHERE id='<batchId>';
   ```
3. Click Retry in UI to re-queue.

---

### `InputImageSensitiveContentDetected.PrivacyInformation` on OpenRouter / BytePlus

**Cause**: Bytedance's B2B API tier rejects real-person photos via a content-policy filter. This is **not bypassable in code** — it's an upstream policy decision.

**Fix**:
1. Confirm: hit OpenRouter's playground at `https://openrouter.ai/playground?model=bytedance/seedance-2.0` with the same image; you'll see the same rejection. That's the upstream filter, not our middleware.
2. Use MuAPI or Segmind for batches with real human faces — those providers have a permissive policy.
3. For BytePlus specifically: contact ByteDance sales for a B2B account with relaxed policy if you need real-person generation through them. Not something the team has needed.

---

### BytePlus `fetch failed` / DNS error

**Cause**: `BYTEPLUS_REGION` is set to `ap-southeast-1` (the AWS-style region name) instead of `ap-southeast` (BytePlus's actual region name).

**Fix**:
```env
BYTEPLUS_REGION=ap-southeast
```
Restart the worker. Verify with:
```bash
docker compose exec worker getent hosts ark.ap-southeast.bytepluses.com
# expect: an IP address. If you see "no such host", the region is still wrong.
```

---

### BytePlus `ModelNotOpen`

**Cause**: Account state — the Dreamina-Seedance model isn't free-tier. The user needs to purchase a resource pack.

**Fix**: Send the user to https://console.byteplus.com/. Not a code bug.

---

### Segmind upload-asset returned no URL / "expected N url(s), got 0"

**Diagnose**: Inspect the actual response shape:
```bash
docker compose logs worker | grep upload-asset
```
Segmind has shipped both `urls` and `file_urls` for this endpoint at different times. The adapter at `lib/providers/segmind.js:62` accepts both.

**Fix**: If you see a third response shape (e.g., `assets`, `data.urls`), update the adapter to accept it. Don't "normalize" to one shape on Segmind's behalf — they may rotate again.

---

### Segmind returned non-video content-type

**Cause**: Policy rejection on a 2xx response. Generation **was billed**.

**Fix**: The job is correctly marked `failed` with `billed: true`. Don't retry — you'll re-bill and re-fail. Modify the prompt or image to avoid the policy hit.

---

### "Studio image isn't influencing the video" / output looks like trainer-only

**Diagnose**:
```bash
docker compose logs worker | grep submit.ok | tail -n 5
```
Look at the request body in the corresponding provider dashboard. If you see `first_frame_url` (Segmind) / `frame_images` (OpenRouter) / `role: 'first_frame'` (BytePlus) / `images_list: [trainer]` (MuAPI), the adapter went into i2v mode — meaning `studioAsset` was null.

**Causes**:
1. The studio row has no `localPath` (legacy data). Re-upload via the UI.
2. The file at `localPath` doesn't exist on the volume (deleted, container recreated without volume).

**Fix**:
```sql
SELECT id, name, local_path FROM studios;
```
For each row, check `docker compose exec worker ls -la <local_path>`. Re-upload missing ones.

---

### Retry button looks like it did nothing

**Cause**: The retry endpoint succeeded, but the worker didn't claim within 5 seconds.

**Diagnose**:
```sql
SELECT id, status, retries, next_attempt_at, started_at
FROM jobs WHERE id='<jobId>';
```
- Status `queued`, `next_attempt_at` null → worker should pick it up next tick. Check worker logs for `submit.ok` for this job.
- Status `queued`, `next_attempt_at` in the future → backoff is still pending.
- Status not `queued` → the retry didn't actually flip it. Check `app/api/jobs/[id]/retry/route.js` for an unhandled error.

If the worker logs show no `submit.ok` for this job over multiple ticks: the parent batch's `status` may be `paused` or `cancelled` (worker only claims for `running` batches). Resume or restart the batch.

---

### Worker crashed with `recover.submitting` count > 0 on next start

**Cause**: The worker died mid-submit (process kill, container OOM, deploy). Some jobs were marked `submitting` in the DB but the upstream HTTP request status is unknown — they may have been billed and succeeded, or never reached the provider.

**Fix**: Recovery already marked them `failed` with a clear error. **Don't auto-retry.** For each affected job:
1. Check the provider dashboard for a corresponding completed task in the timeframe.
2. If the provider has the video, manually update the row:
   ```sql
   UPDATE jobs SET status='done', video_url='<url>', completed_at=NOW()
   WHERE id='<jobId>';
   UPDATE batches SET done=done+1, failed=failed-1 WHERE id='<batchId>';
   ```
3. If the provider has nothing for that timeframe, click Retry — it's safe (you weren't billed).

---

### Containers won't start after pull

**Diagnose**:
```bash
docker compose logs web | tail -n 50
docker compose logs worker | tail -n 50
```
Common issues:
- **Migration drift**: web fails on startup with a Prisma migration error. Run `npx prisma migrate dev` host-side against `localhost:5433`, then `docker compose up -d`.
- **Volume mismatch**: `uploads_data` was wiped (e.g., by `docker compose down -v`); existing trainer rows reference files that no longer exist. Either re-upload via UI or restore from backup.

---

### Browser shows stale wizard / dropdown after redeploy

**Cause**: Next.js `_next/static` bundles are cached aggressively by the browser.

**Fix**: Hard-refresh (`Ctrl+Shift+R` on Win/Linux, `Cmd+Shift+R` on macOS). If that doesn't help, open DevTools → Application → Clear storage. The wizard JS is bundled at web build time, not runtime — `docker compose restart web` is enough; you don't need to rebuild unless you changed deps.

---

### Per-row CSV "Studio 4" not auto-mapped

**Cause**: No `Studio` row with `csvLabel = 'Studio 4'`. The fallback in the wizard is to leave it blank, which the auto-mapper then fills with `studios[0]?.id` (the first studio in the table).

**Fix**: Either upload a Studio with `csvLabel: 'Studio 4'` via the UI, or use the per-row dropdown in Step 2 of the wizard to pick a different one.

---

### Job has no error but never completes

**Diagnose**:
```sql
SELECT id, status, started_at, completed_at, provider_request_id, error
FROM jobs WHERE id='<jobId>';
```

If `provider_request_id IS NULL` and `status='polling'`: a code bug — the worker shouldn't transition to `polling` without an id. File a bug.

If `provider_request_id` is set but `started_at` is more than 30 minutes ago: the wall-clock deadline should have terminated it. Check worker logs for `poll.deadline_exceeded` for that id; if absent, the worker isn't running or is failing every tick. Check `tick.error` events.

---

### Cost estimate is way off

**Causes** (most common first):
1. Wrong `quality` — `'1080p'` is much pricier than `'480p'`. Confirm what you set in the wizard.
2. MuAPI's translation: the cost endpoint expects `'basic'`/`'high'`. If you wrote a custom value, it falls through to `'basic'`. See `lib/providers/muapi.js:142`.
3. The provider's pricing changed and our `defaultModel` is now mapped to a different tier upstream. Compare the response `raw` field against the provider's pricing page.

The estimate uses `perJob * batch.total`. It does **not** account for retries — actual bill may be higher if jobs retry on policy rejection (but `TerminalProviderError` with `billed: false` means no retry, so that's the rare case).

---

## Escalation

If the symptom isn't here:

1. **Search the logs.** Worker log lines are JSON; even rare events have stable event names.
2. **Read the adapter.** Each `lib/providers/<id>.js` is < 200 lines and has the upstream API contract documented inline.
3. **Reproduce in the provider's playground.** All four providers expose a web UI for one-off requests. Match the request body the worker is sending and confirm the failure happens there too — that distinguishes our bugs from upstream behavior.
4. **Open an issue.** Include the worker log slice, the provider, the model, the batch+job ids, and the symptom.
