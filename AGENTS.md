# AGENTS.md — Open Generative AI

> Compact guardrails for coding agents working in this repo.

## Setup (non-negotiable)

`npm install` alone **does not work**. Workspace packages must be built **after** submodules are populated.

```bash
# One-shot (required on every fresh clone)
npm run setup
# expands to: git submodule update --init --recursive && npm install && npm run build:packages
```

- `packages/Vibe-Workflow` and `packages/Open-Poe-AI` are **Git submodules**. If they are empty, the build fails.
- `build:packages` order: `workflow-builder` → `ai-agent` → `studio`. Do not change the order.

If you see `Couldn't find a 'pages' directory`, re-run `npm run setup` — the `app/` folder exists at root, so this error means submodules are missing or you are not in the repo root.

## Two frontends, one shared library

This repo ships **two separate frontend applications**:

| Target | Entry | Builder | Source dirs | Config |
|---|---|---|---|---|
| **Hosted web** | `app/studio/page.js` | Next.js 15 (`npm run dev`) | `app/`, `components/` | `next.config.mjs`, `middleware.js` |
| **Desktop app** | `src/main.js` | Vite 5 (`npm run vite:build`) | `src/`, `index.html` | `vite.config.mjs`, `electron/main.js` |

Both consume `packages/studio` (React components compiled with Babel).

- **Web:** Next.js App Router. `middleware.js` proxies `/api/v1`, `/api/workflow`, `/api/app` to `https://api.muapi.ai`.
- **Desktop:** Vite SPA loaded by Electron. `vite.config.mjs` proxies `/api` to the same origin. Electron registers IPC handlers for local model inference.

> **Editing UI code?** Check which app you are affecting. Studio components live in `packages/studio/`, but surrounding shell code is duplicated (or similar) between `app/` and `src/`.

## Dev commands

```bash
# Web version (Next.js) → http://localhost:3000
npm run dev

# Desktop app (Electron + Vite)
npm run electron:dev

# Production build (Next.js only)
npm run build
npm run start

# Package builders (called by setup)
npm run build:studio       # Babel + Tailwind in packages/studio
npm run build:workflow     # packages/Vibe-Workflow/packages/workflow-builder
npm run build:agent        # packages/Open-Poe-AI/packages/agents
```

## Workspace / npm links

`next.config.mjs`:
```js
transpilePackages: ['studio', 'ai-agent', 'workflow-builder']
```

`jsconfig.json` path maps:
- `ai-agent` → `./packages/Open-Poe-AI/packages/agents/src/index.js`
- `workflow-builder` → `./packages/Vibe-Workflow/packages/workflow-builder/src/index.js`

Root `package.json` links them with `file:` protocol so both Next.js and Vite resolve them:
- `"studio": "*"` (npm workspace)
- `"workflow-builder": "file:./packages/Vibe-Workflow/packages/workflow-builder"`
- `"ai-agent": "file:./packages/Open-Poe-AI/packages/agents"`

## Local Inference (Electron only)

Desktop builds include two local engines. **The web build has no local inference** — it always calls the cloud API.

1. **sd.cpp** (`electron/lib/localInference.js`)
   - Downloads `sd-cli` binary + weights into `app.getPath('userData')/local-ai/`.
   - macOS Apple Silicon only (x86_64 is unsupported upstream).
   - Uses `DYLD_LIBRARY_PATH` / `LD_LIBRARY_PATH` to find `libstable-diffusion.dylib`.

2. **Wan2GP** (`electron/lib/wan2gpProvider.js`)
   - HTTP client to a user-run Gradio server.
   - Probes `/info` to resolve `api_name` aliases, because endpoint names drift between Wan2GP versions.

Electron IPC surface is exposed in `electron/preload.js` under `window.localAI`.

## Testing / Verification

There is **no automated test suite** in this repo (`package.json` has no `test` script). Verification is manual:

```bash
# Sanity-check web build
npm run build

# Sanity-check desktop renderer build
npm run vite:build
# then inspect dist/ output
```

## Known gotchas

- **Tailwind version:** `project_knowledge.md` mentions v4, but the repo actually uses **Tailwind v3** (`tailwindcss@^3.4.0` in root `package.json`). `postcss.config.js` is the active pipeline.
- **macOS Intel:** Local `sd.cpp` inference is unsupported. The `pickBinaryAsset` logic explicitly returns `null` for `darwin` + non-`arm64`.
- **Electron `webSecurity: false`:** Required so the renderer can load local image URLs from `userData`. Do not enable `contextIsolation: false` or `nodeIntegration: true`; keep `preload.js` as the only bridge.
- **Missing `app` data dir on Windows:** `C:\Users\<user>\AppData\Roaming\open-generative-ai\local-ai`.
- **Unhandled IPC promises in renderer:** Modal components that call `window.localAI.*()` must always `.catch()` or `try/catch`. Uncaught rejections in the renderer can terminate the Electron window.

## File reference map

| Concern | File(s) |
|---|---|
| Model definitions (200+ models) | `packages/studio/src/models.js` |
| API client (Muapi) | `packages/studio/src/muapi.js` |
| Next.js middleware / proxy | `middleware.js` |
| Vite proxy / build | `vite.config.mjs` |
| Electron main process | `electron/main.js` |
| Electron preload (IPC surface) | `electron/preload.js` |
| Local sd.cpp engine | `electron/lib/localInference.js` |
| Local Wan2GP engine | `electron/lib/wan2gpProvider.js` |
| Model catalog (local weights) | `electron/lib/modelCatalog.js` |
| Studio library exports | `packages/studio/src/index.js` |
| Tailwind + PostCSS config | `tailwind.config.js`, `postcss.config.js` |
