# Documentation Index

Detailed reference for the batch video generation subsystem of this fork.

If you haven't already, **read [`/ONBOARDING.md`](../ONBOARDING.md) first** — it's the 15-minute orientation that gives you the map. These docs are the deep dives you reach for once you start touching real code.

## Reading order

For a new contributor coming in cold, read in this order:

1. **[architecture.md](architecture.md)** — what the three services actually do, why we use Postgres-as-queue, the request/data flow from CSV upload to MP4 download.
2. **[data-model.md](data-model.md)** — every table, column, index, foreign key. The job lifecycle as a state machine.
3. **[providers.md](providers.md)** — the 4 adapters in detail: their upstream APIs, the request shapes we send, how each handles the i2v vs reference-image switch, billing semantics, and per-provider quirks.
4. **[worker-internals.md](worker-internals.md)** — the tick loop, the FOR UPDATE SKIP LOCKED claim, retry/backoff math, the wall-clock deadline, crash-recovery for orphaned `submitting` rows.
5. **[api-reference.md](api-reference.md)** — every HTTP endpoint with request/response shapes. Use this as a lookup, not a tutorial.
6. **[operations.md](operations.md)** — local dev workflow, environment variables, migrations, log-tailing recipes, scaling.
7. **[troubleshooting.md](troubleshooting.md)** — symptom → cause → fix index for the failure modes we've already seen.
8. **[adding-a-provider.md](adding-a-provider.md)** — step-by-step tutorial for plugging a 5th video model into the system.

## How to use this directory

- Every doc cites real file paths (e.g., `worker/index.js:88-107`). When the code moves, update the doc — these aren't just narrative, they're navigation.
- Don't add tutorials for upstream features (image studio, agents, workflow). Those live in `/README.md` and `/project_knowledge.md` — keep this tree focused on the batch system.
- If you add a new provider, update **providers.md** and **adding-a-provider.md** in the same PR. Drift here costs the next person hours.
- Code comments stay short (per `/CLAUDE.md`); the *why* lives here.
