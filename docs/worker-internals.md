# Worker Internals

Source: [`worker/index.js`](../worker/index.js). This page is a guided read of that file.

## The tick loop

```js
while (!stopping) {
  try { await tick(); } catch (err) { log('tick.error', { err: err.message }); }
  await sleep(TICK_MS);   // default 2000ms
}
```

`TICK_MS` defaults to 2000 (env: `WORKER_TICK_MS`). Every tick does two things in sequence:

1. **`tick()`** — finds running batches, calculates per-batch concurrency slots, claims queued jobs to fill them, and dispatches submits in parallel. (`worker/index.js:57-86`.)
2. **`pollPending()`** — independent of batch status. Finds all `polling` jobs (across batches) and polls them. Polling jobs in `paused` batches are still polled — pausing only stops *new* claims. (`worker/index.js:199-206`.)

The loop catches errors so a bad tick can't crash the process; the next tick starts fresh.

## Claim safety

```sql
SELECT id FROM jobs
WHERE batch_id = ? AND status = 'queued'
  AND (next_attempt_at IS NULL OR next_attempt_at <= NOW())
ORDER BY row_index ASC
LIMIT ?
FOR UPDATE SKIP LOCKED
```

Wrapped in a Prisma `$transaction`; the same transaction immediately bulk-updates the matched ids to `status='submitting'`. See `worker/index.js:88-107`.

`FOR UPDATE SKIP LOCKED` is the canonical Postgres queue-claim primitive: each worker takes a row-level lock on the matched ids, and any concurrent worker passes over those locked rows entirely instead of blocking. Two key properties:

- **No double-claim.** Worker A and Worker B running the same SELECT will get disjoint sets.
- **No head-of-line blocking.** If row 17 is locked by another worker, the SELECT just skips to row 18 — it doesn't wait.

We run a single worker container today, so the property we use most is the second (atomic claim within one process). The first matters only if we ever scale horizontally — which we can do without code changes.

`ORDER BY row_index ASC` keeps generation in CSV order, which is what users expect. Without it the claim is FIFO-ish but not deterministic.

## Concurrency math

```js
const inflight = await prisma.job.count({
  where: { batchId: batch.id, status: { in: ['submitting', 'polling'] } },
});
const slots = batch.concurrency - inflight;
if (slots <= 0) return;
```

`Batch.concurrency` is the **max in-flight count** for that batch, not the max claim per tick. If concurrency is 5 and 4 jobs are polling, the next tick claims 1 new one. Once a job leaves `polling` (to `done` or `failed`), the slot frees up and the next tick refills.

Cross-batch concurrency is **unbounded** at the worker level — if you have 3 running batches each with concurrency 5, the worker submits up to 15 simultaneously. If you need a global cap, add a `MAX_TOTAL_INFLIGHT` env check in `tick()`.

## Submit path

```
submitJob(jobId)
  ├── findUnique({include: {trainer, studio, batch}})
  ├── loadAssetBuffer(trainer)         # required
  ├── loadAssetBuffer(studio).catch(→null)   # optional
  ├── renderPrompt({trainer, studio, job, hasStudioImage})
  ├── provider.submit({...})
  │
  ├── if result.videoUrl:              # sync providers (Segmind)
  │     UPDATE job SET status='done', videoUrl, completedAt
  │     UPDATE batch SET done = done + 1
  │
  └── else:
        UPDATE job SET status='polling', providerRequestId
```

The trainer is required (the worker errors if `job.trainer` is null); the studio is optional and `loadAssetBuffer` failures are absorbed (treated as "no studio") to handle the legacy case where a studio file is missing on disk.

`renderPrompt` is **stateless** — it takes the same inputs every retry, produces the same prompt. The provider sees an identical request on a retry, which combines with OpenRouter's `Idempotency-Key` to make retries truly idempotent for that provider.

### Sync vs async dispatch

If `provider.submit()` returns `{videoUrl}` (Segmind sync mode), the worker writes done state in a single transaction and increments `batch.done`. This bypasses the polling loop entirely.

If it returns `{providerRequestId}` (everyone else), the worker stores the id and lets `pollPending` pick it up next tick.

## Poll path

```
pollPending()
  ├── findMany({status:'polling', providerRequestId: not null}, take: 50)
  └── Promise.all(... pollJob(job))

pollJob(job)
  ├── deadline check: if (now - startedAt) > maxPollMinutes:
  │       markTerminalFailure("Generation exceeded ...")
  ├── provider.pollResult({apiKey, providerRequestId})
  │
  ├── if status='done':
  │     UPDATE job SET status='done', videoUrl, completedAt
  │     UPDATE batch SET done = done + 1
  │
  └── else if pending: leave for next tick
```

The `take: 50` is a soft cap on simultaneous polls per tick. At the 2-second tick rate, a backlog of 200 polling jobs takes ~8 seconds to round-robin through them all — that's fine; provider-side state changes much slower than that.

### Wall-clock deadline

Every adapter exports `maxPollMinutes` (typically 30, Segmind's 10 is unused since it's sync). If `now - startedAt > maxPollMinutes * 60_000`, the worker terminally fails the job with a message telling the user to verify on the provider dashboard before retrying. See `worker/index.js:217-230`.

Why a hard deadline: a `providerRequestId` can become a phantom — the upstream task expired but the API still returns 200 with `status='pending'` forever. Without a deadline, that job polls until heat-death of the universe. The deadline says "we believe this is dead; mark it failed; user can decide to retry."

## Error handling

```
provider.submit / pollResult throws:
  ├── TerminalProviderError → markTerminalFailure (no retry, status='failed' immediately)
  └── any other Error       → markFailureWithBackoff (retries++, status='queued', nextAttemptAt = now + backoff)
```

`TerminalProviderError` is the explicit signal that the same input will fail the same way (4xx, policy rejection, malformed response). Retrying it would re-bill (if `billed: true`) or just fail again (if `billed: false`). The adapter is responsible for setting `billed` correctly — see [providers.md](providers.md).

### Backoff curve

```
backoffMs = min(10 * 3^retries, 300) * 1000
```

| Attempt # | retries (after) | wait until next attempt |
|-----------|-----------------|-------------------------|
| 1 (initial) | 0             | 10 s                    |
| 2           | 1             | 30 s                    |
| 3           | 2             | 90 s                    |
| 4           | 3             | (failed)                |

Retries beyond 3 mark the job `failed`. Manual retry resets the count.

The cap `min(..., 300)` doesn't kick in at the current `> 3` cutoff. It's there as a safety net if someone bumps the cap to 5 or 10.

### Counter atomicity

`done` and `failed` increments on `Batch` are **always inside the same transaction** as the corresponding job state change. See `worker/index.js` → `submitJob`'s sync-done branch, `markTerminalFailure`, and `markFailureWithBackoff`'s retries-exceeded branch. This means the displayed batch progress is consistent with the underlying job statuses; you can't see a `done=5/total=255` while only 4 jobs are actually `done`.

### `billed` flag persistence

`markTerminalFailure(jobId, errorMsg, billed)` writes the third arg to `Job.billed`. Callers:

- Adapter terminal during submit/poll → passes `err.billed` from the `TerminalProviderError`.
- Wall-clock deadline → passes `null` (the upstream may or may not have billed; we don't know).
- `recoverOrphans` for crashed `submitting` jobs → passes `null` (same reason — the HTTP request may or may not have completed before the crash).

The retry endpoint clears `billed` back to `null` along with `error` and the lifecycle fields, so the column reflects the LATEST attempt only.

## Crash recovery (`recoverOrphans`)

Runs once at boot, before the main loop starts. See `worker/index.js:367-405`.

Two cases:

### `submitting` jobs — DANGEROUS

The worker may have:
1. Sent the upstream HTTP request → success → got charged.
2. Crashed before persisting `providerRequestId`.

If we re-claim and re-submit, we double-charge. **Recovery: mark them all failed** with a clear error directing the user to verify on the provider dashboard before clicking Retry. Manual recovery is annoying, but auto-retry would be worse — silently double-billing real money.

This is conservative on purpose. If you find a way to make submit transactionally idempotent across crashes (e.g., by writing a "submit-attempt" row with a deterministic id before the HTTP call), we could safely auto-retry. Until then, fail safe.

### `polling` jobs — SAFE

We have `providerRequestId` already persisted, so the next `pollPending` tick picks them up using their stored id. Just log how many we found; no state mutation needed.

## What stops a tick

```js
process.on('SIGINT', () => { stopping = true; });
process.on('SIGTERM', () => { stopping = true; });
```

The `while (!stopping)` loop exits cleanly after the current tick finishes. `prisma.$disconnect()` runs after. This means `docker compose stop worker` finishes the in-flight tick gracefully — no need for `--time` flags.

## Logging

Single-function `log(event, fields)` writes one JSON line per call. Conventional events:

| Event                    | Meaning                                                      |
|--------------------------|--------------------------------------------------------------|
| `starting`               | Boot, with provider keys present                             |
| `recover.submitting`     | How many orphaned submitting jobs were marked failed         |
| `recover.polling`        | How many polling jobs will resume on next tick               |
| `tick.error`             | A tick threw — we keep looping                               |
| `submit.ok`              | Async submit succeeded; jobId + providerRequestId            |
| `submit.sync_done`       | Sync submit succeeded; jobId + videoUrl                      |
| `submit.fail`            | Submit threw; terminal flag and billed flag                  |
| `poll.done`              | Poll returned done                                           |
| `poll.terminal`          | Poll threw TerminalProviderError                             |
| `poll.deadline_exceeded` | Wall-clock cap hit                                           |
| `poll.error`             | Generic poll error (will retry next tick)                    |
| `job.retry`              | Generic failure → backoff                                    |
| `job.failed`             | Hit retries > 3                                              |
| `batch.completed`        | All jobs settled                                             |

Filter via `docker compose logs worker | grep <event>`. The fields are JSON; pipe to `jq` for structured queries.

## Tuning knobs

| Knob                  | Where                      | Effect                                                      |
|-----------------------|-----------------------------|-------------------------------------------------------------|
| `WORKER_TICK_MS`      | env (default 2000)         | Higher = lower DB load, slower reaction to state changes    |
| `Batch.concurrency`   | per-batch field            | In-flight cap for that batch                                |
| `provider.maxPollMinutes` | per adapter            | Wall-clock deadline; bump if a provider is genuinely slow   |
| Backoff base/exp      | `worker/index.js:307`      | `10 * 3^retries`. Steeper for spammy retry, shallower for fast recovery |
| `pollPending take`    | `worker/index.js:203`      | 50. Bump if you have >200 concurrent polls and want lower per-job poll latency |

Don't touch the claim query (`FOR UPDATE SKIP LOCKED`) without testing under concurrent worker load. The current shape is correct.
