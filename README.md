# Open Generative AI — Open-Source Alternative to Higgsfield AI, Freepik, Krea, Openart AI

> **The free, open-source alternative to Higgsfield AI, Freepik, Krea, Openart AI.** Generate AI images and videos using 200+ state-of-the-art models — without the closed ecosystem or subscription fees.

## 🌐 Try it Online — No Install Required

**Hosted version:** [https://dev.muapi.ai/open-generative-ai](https://dev.muapi.ai/open-generative-ai)

Use all four studios (Image, Video, Lip Sync, Cinema) directly in your browser — no Node.js, no setup. Sign up for a free account to start generating. The hosted version is always up to date with the latest models.

**Community:** Join [Discord](https://discord.gg/sqFYv8ugND) for discussions and support

**Happy Horse top video model coming soon:** Follow [Happy Horse AI](https://github.com/Anil-matcha/HappyHorse-1.0-API) for updates   

---

## ⬇️ Download Desktop App

One-click installers — no Node.js or terminal required.

| Platform | Download |
|---|---|
| macOS Apple Silicon (M1/M2/M3/M4) | [Open Generative AI-1.0.0-arm64.dmg](https://github.com/Anil-matcha/Open-Generative-AI/releases/download/v1.0.0/Open.Generative.AI-1.0.0-arm64.dmg) |
| macOS Intel (x64) | [Open Generative AI-1.0.0.dmg](https://github.com/Anil-matcha/Open-Generative-AI/releases/download/v1.0.0/Open.Generative.AI-1.0.0.dmg) |
| Windows (x64 + ARM64) | [Open Generative AI Setup 1.0.0.exe](https://github.com/Anil-matcha/Open-Generative-AI/releases/download/v1.0.0/Open.Generative.AI.Setup.1.0.0.exe) |

All releases: [github.com/Anil-matcha/Open-Generative-AI/releases](https://github.com/Anil-matcha/Open-Generative-AI/releases)

### macOS Installation Guide

Because the app is not notarized by Apple, macOS Gatekeeper will block it on first launch. Follow these steps:

**Step 1** — Mount the DMG and drag the app to `/Applications`

**Step 2** — Open Terminal and run:
```bash
xattr -cr "/Applications/Open Generative AI.app"
```

**Step 3** — Right-click the app in `/Applications` → click **Open** → click **Open** again on the dialog

> You only need to do this once. After that, the app opens normally.

**Alternative (no Terminal):**
1. Try to open the app — macOS will block it
2. Go to **System Settings → Privacy & Security**
3. Scroll down to find _"Open Generative AI was blocked"_
4. Click **Open Anyway** → **Open**

### Windows Installation — SmartScreen warning fix

Windows SmartScreen may show a warning because the installer is not code-signed:

1. Click **More info** on the SmartScreen dialog
2. Click **Run anyway**

The app will install silently to `%LocalAppData%` with a Start Menu shortcut.

---

Open Generative AI is an open-source AI image, video, cinema, and lip sync studio that brings creative workflows to everyone. Powered by [Muapi.ai](https://muapi.ai), it supports text-to-image, image-to-image, text-to-video, image-to-video, and audio-driven lip sync generation across models like Flux, Nano Banana, Midjourney, Kling, Sora, Veo, Seedream, Infinite Talk, LTX Lipsync, Wan 2.2, and more — all from a sleek, modern interface you can self-host and customize.

**Why Open Generative AI instead of Higgsfield AI, Freepik, Krea AI, Openart AI?**
- **Free & open-source** — no subscription, no vendor lock-in
- **Self-hosted** — your data stays on your machine
- **200+ models** — text-to-image, image-to-image, text-to-video, image-to-video, lip sync
- **Multi-image input** — feed up to 14 reference images into compatible models
- **Lip Sync Studio** — animate portraits or sync lips to any audio with 9 dedicated models
- **Extensible** — add your own models, modify the UI, build on top of it

For a deep dive into the technical architecture and the philosophy behind the "Infinite Budget" cinema workflow, see our [comprehensive guide and roadmap](https://medium.com/@anilmatcha/).

![Studio Demo](docs/assets/studio_demo.webp)

## ✨ Features

- **Image Studio** — Generate images from text prompts (50+ text-to-image models) or transform existing images (55+ image-to-image models). Switches model set automatically based on whether a reference image is provided. Quality and resolution controls visible for models that support them.
- **Multi-Image Input** — Upload up to 14 reference images for compatible edit models (Nano Banana 2 Edit, Flux Kontext Dev, GPT-4o Edit, and more). Multi-select picker with order badges, batch upload, and a "Use Selected" confirmation flow.
- **Video Studio** — Generate videos from text prompts (40+ text-to-video models) or animate a start-frame image (60+ image-to-video models). Same intelligent mode switching as Image Studio.
- **Lip Sync Studio** — Animate portrait images or sync lips on existing videos using audio. 9 dedicated models across two modes: portrait image + audio → talking video, and video + audio → lipsync video.
- **Cinema Studio** — Interface for photorealistic cinematic shots with pro camera controls (Lens, Focal Length, Aperture)
- **Upload History** — Reference images are uploaded once and stored locally. A picker panel lets you reuse any previously uploaded image across sessions — no re-uploading.
- **Smart Controls** — Dynamic aspect ratio, resolution/quality, and duration pickers that adapt to each model's capabilities (including t2i models with resolution or quality options)
- **Generation History** — Browse, revisit, and download all past generations (persisted in browser storage)
- **Image & Video Download** — One-click download of generated outputs in full resolution
- **API Key Management** — Secure API key storage in browser localStorage (never sent to any server except Muapi)
- **Responsive Design** — Works seamlessly on desktop and mobile with dark glassmorphism UI

### 🖼️ Image Studio — Dual Mode

The Image Studio automatically switches between two model sets:

| Mode | Trigger | Models | Prompt |
| :--- | :--- | :--- | :--- |
| **Text-to-Image** | Default (no image) | 50+ t2i models (Flux, Nano Banana 2, Seedream 5.0, Ideogram, GPT-4o, Midjourney…) | Required |
| **Image-to-Image** | Reference image uploaded | 55+ i2i models (Kontext, Nano Banana 2 Edit, Seedream 5.0 Edit, Seededit, Upscaler…) | Optional |

#### Newly Added Models

| Model | Type | Key Features |
| :--- | :--- | :--- |
| **Nano Banana 2** | Text-to-Image | Google Gemini 3.1 Flash Image · Resolution 1K/2K/4K · Google Search enhancement · aspect ratio `auto` |
| **Nano Banana 2 Edit** | Image-to-Image | Up to **14 reference images** · Resolution 1K/2K/4K · Google Search enhancement |
| **Seedream 5.0** | Text-to-Image | ByteDance · Quality basic/high · 8 aspect ratios · up to 4K |
| **Seedream 5.0 Edit** | Image-to-Image | ByteDance · Natural language style transfer · Quality basic/high |

#### Multi-Image Input

Models that accept multiple reference images expose a multi-select picker when active:

| Model | Max Images |
| :--- | :--- |
| Nano Banana 2 Edit | 14 |
| Nano Banana Edit | 10 |
| Flux Kontext Dev I2I | 10 |
| Kling O1 Edit Image | 10 |
| GPT-4o Edit / GPT Image 1.5 Edit | 10 |
| Bytedance Seedream Edit v4 / v4.5 | 10 |
| Vidu Q2 Reference to Image | 7 |
| Flux 2 Flex/Pro Edit | 8 |
| Nano Banana Pro Edit | 8 |
| Flux Kontext Pro/Max I2I | 2 |
| Wan 2.5/2.6 Image Edit | 2–3 |
| Qwen Image Edit Plus / 2511 | 3 |
| GPT-4o Image to Image | 5 |
| Flux 2 Klein 4b/9b Edit | 4 |

When a multi-image model is selected the upload trigger switches to multi-select mode:
- **Checkboxes with order numbers** — images are sent to the model in the order you select them
- **Batch upload** — pick multiple files at once from your file dialog
- **Count badge** on the trigger shows how many images are active; a `+` badge appears when more slots are available
- **"Use Selected" button** confirms and closes the picker

### 🎬 Video Studio — Dual Mode

The Video Studio follows the same pattern:

| Mode | Trigger | Models | Prompt |
| :--- | :--- | :--- | :--- |
| **Text-to-Video** | Default (no image) | 40+ t2v models (Kling, Sora, Veo, Wan, Seedance 2.0, Hailuo, Runway…) | Required |
| **Image-to-Video** | Start frame uploaded | 60+ i2v models (Kling I2V, Veo3 I2V, Runway I2V, Wan I2V, Seedance 2.0 I2V, Midjourney I2V…) | Optional |

#### Newly Added Models

| Model | Type | Key Features |
| :--- | :--- | :--- |
| **Seedance 2.0** | Text-to-Video | ByteDance · Aspect ratios 16:9 / 9:16 / 4:3 / 3:4 · Duration 5 / 10 / 15s · Quality basic/high |
| **Seedance 2.0 I2V** | Image-to-Video | ByteDance · Animate images into video · Up to 9 reference images · Aspect ratios 16:9 / 9:16 / 4:3 / 3:4 · Duration 5 / 10 / 15s · Quality basic/high |
| **Seedance 2.0 Extend** | Video Extension | ByteDance · Seamlessly continue any Seedance 2.0 generation · Preserves style, motion & audio · Optional continuation prompt · Duration 5 / 10 / 15s · Quality basic/high |
| **Grok Imagine T2V** | Text-to-Video | xAI · Duration 6 / 10 / **15s** · Modes: fun / normal / spicy · Aspect ratios 9:16 / 16:9 / 2:3 / 3:2 / 1:1 |
| **Grok Imagine I2V** | Image-to-Video | xAI · Duration 6 / 10 / **15s** · Modes: fun / normal / spicy · Cinematic motion from still images |

### 🎙️ Lip Sync Studio

The **Lip Sync Studio** generates audio-driven talking videos using 9 models across two input modes:

| Mode | Trigger | Description |
| :--- | :--- | :--- |
| **Portrait Image** | Default | Upload a portrait image + audio file → animated talking video |
| **Video** | Switch to Video mode | Upload an existing video + audio file → lipsync video |

#### Image-based Models (Portrait Image + Audio → Video)

| Model | Endpoint | Resolutions | Prompt |
| :--- | :--- | :--- | :--- |
| **Infinite Talk** | `infinitetalk-image-to-video` | 480p, 720p | Optional |
| **Wan 2.2 Speech to Video** | `wan2.2-speech-to-video` | 480p, 720p | Optional |
| **LTX 2.3 Lipsync** | `ltx-2.3-lipsync` | 480p, 720p, 1080p | Optional |
| **LTX 2 19B Lipsync** | `ltx-2-19b-lipsync` | 480p, 720p, 1080p | Optional |

#### Video-based Models (Video + Audio → Lipsync Video)

| Model | Endpoint | Resolutions | Prompt |
| :--- | :--- | :--- | :--- |
| **Sync Lipsync** | `sync-lipsync` | — | — |
| **LatentSync** | `latentsync-video` | — | — |
| **Creatify Lipsync** | `creatify-lipsync` | — | — |
| **Veed Lipsync** | `veed-lipsync` | — | — |
| **Infinite Talk V2V** | `infinitetalk-video-to-video` | 480p, 720p | Optional |

**How it works:**
1. Select **Portrait Image** or **Video** mode using the toggle
2. Upload your portrait image (or video) using the image/video upload button
3. Upload your audio file using the audio upload button
4. Optionally enter a prompt to guide the motion style
5. Select a model and resolution (where supported), then click **Generate**

Generation history is saved separately in `lipsync_history` and pending jobs resume automatically on page reload.

### 🎥 Cinema Studio Controls

The **Cinema Studio** offers precise control over the virtual camera, translating your choices into optimized prompt modifiers:

| Category | Available Options |
| :--- | :--- |
| **Cameras** | Modular 8K Digital, Full-Frame Cine Digital, Grand Format 70mm Film, Studio Digital S35, Classic 16mm Film, Premium Large Format Digital |
| **Lenses** | Creative Tilt, Compact Anamorphic, Extreme Macro, 70s Cinema Prime, Classic Anamorphic, Premium Modern Prime, Warm Cinema Prime, Swirl Bokeh Portrait, Vintage Prime, Halation Diffusion, Clinical Sharp Prime |
| **Focal Lengths** | 8mm (Ultra-Wide), 14mm, 24mm, 35mm (Human Eye), 50mm (Portrait), 85mm (Tight Portrait) |
| **Apertures** | f/1.4 (Shallow DoF), f/4 (Balanced), f/11 (Deep Focus) |

### 📁 Upload History & Picker

Every image you upload is saved locally (URL + thumbnail) so you never upload the same file twice:

- Click the upload button to open the **reference image picker**
- Previously uploaded images appear in a 3-column grid with thumbnails
- **Single-image models** — click a thumbnail to instantly select and close
- **Multi-image models** — toggle multiple thumbnails (shown with order numbers), then click **Use Selected**
- Upload new images with the **Upload files** button (supports multi-file selection in multi-image mode)
- Remove individual images from history with the ✕ button
- History persists across browser sessions (stored in `localStorage`)

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Muapi.ai](https://muapi.ai) API key

### Setup

```bash
# Clone the repository
git clone https://github.com/Anil-matcha/Open-Generative-AI.git
cd Open-Generative-AI

# Install dependencies (installs root + packages/studio workspace)
npm install

# Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser. You'll be prompted to enter your Muapi API key on first use.

### Production Build

```bash
npm run build
npm run start
```

### Desktop App Build

Build native desktop apps with Electron:

```bash
# macOS (DMG — Intel + Apple Silicon)
npm run electron:build

# Windows (NSIS installer — x64 + ARM64)
npm run electron:build:win

# Both platforms in one pass
npm run electron:build:all
```

Installers are output to the `release/` folder. Pre-built binaries are also available on the [Releases page](https://github.com/Anil-matcha/Open-Generative-AI/releases).

## 🏗️ Architecture

The app is a **Next.js monorepo** with a shared `packages/studio` component library.

```
Open-Generative-AI/
├── app/                        # Next.js App Router
│   ├── layout.js               # Root layout (Tailwind, fonts)
│   ├── page.js                 # Redirects → /studio
│   └── studio/
│       └── page.js             # Studio page — renders StandaloneShell
├── components/
│   ├── StandaloneShell.js      # Tab nav + BYOK (API key from localStorage)
│   └── ApiKeyModal.js          # API key entry modal
├── packages/
│   └── studio/                 # Shared React component library
│       └── src/
│           ├── index.js        # Exports: ImageStudio, VideoStudio, LipSyncStudio, CinemaStudio
│           ├── models.js       # 200+ model definitions (single source of truth)
│           ├── muapi.js        # API client (named exports, apiKey as first param)
│           └── components/
│               ├── ImageStudio.jsx    # Dual-mode t2i/i2i studio
│               ├── VideoStudio.jsx    # Dual-mode t2v/i2v studio
│               ├── LipSyncStudio.jsx  # Portrait/video + audio → talking video
│               └── CinemaStudio.jsx   # Pro studio with camera controls
├── next.config.mjs             # transpilePackages: ['studio']
├── tailwind.config.js
└── package.json                # workspaces: ["packages/studio"]
```

The `packages/studio` library is also consumed by the hosted version on [muapi.ai](https://muapi.ai) — model updates made in `packages/studio/src/models.js` apply to both the self-hosted app and the hosted version automatically.

## 🔌 API Integration

The app communicates with [Muapi.ai](https://muapi.ai) using a two-step pattern:

1. **Submit** — `POST /api/v1/{model-endpoint}` with prompt and parameters
2. **Poll** — `GET /api/v1/predictions/{request_id}/result` until status is `completed`

Authentication uses the `x-api-key` header. During development, a Vite proxy handles CORS by routing `/api` requests to `https://api.muapi.ai`.

File uploads use `POST /api/v1/upload_file` (multipart/form-data) and return a hosted URL that is passed to image-conditioned models. For multi-image models the full `images_list` array is forwarded to the API in one request.

Lip sync jobs use the same two-step pattern: a dedicated `processLipSync()` method accepts `image_url` or `video_url` alongside `audio_url`, dispatches to the model's endpoint, and polls until the output video URL is available.

## 🎨 Supported Model Categories

| Category | Count | Examples |
|---|---|---|
| **Text-to-Image** | 50+ | Flux Dev, Nano Banana 2, Seedream 5.0, Ideogram v3, Midjourney v7, GPT-4o, SDXL |
| **Image-to-Image** | 55+ | Nano Banana 2 Edit (×14), Flux Kontext Pro, GPT-4o Edit, Seededit v3, Upscaler, Background Remover |
| **Text-to-Video** | 40+ | Kling v3, Sora 2, Veo 3, Wan 2.6, Seedance 2.0, Seedance 2.0 Extend, Seedance Pro, Hailuo 2.3, Runway Gen-3 |
| **Image-to-Video** | 60+ | Kling v2.1 I2V, Veo3 I2V, Runway I2V, Seedance 2.0 I2V, Midjourney v7 I2V, Hunyuan I2V, Wan2.2 I2V |
| **Lip Sync** | 9 | Infinite Talk I2V, Wan 2.2 Speech to Video, LTX 2.3 Lipsync, LTX 2 19B Lipsync, Sync, LatentSync, Creatify, Veed, Infinite Talk V2V |

## 🛠️ Tech Stack

- **Next.js 14** — App Router, server components, fast dev server
- **React 18** — Studio UI components
- **Tailwind CSS v3** — Utility-first styling
- **npm workspaces** — Monorepo with shared `packages/studio` library
- **Muapi.ai** — AI model API gateway

## 🤔 How is this different from Higgsfield AI, Freepik, Krea, Openart AI?

**Open Generative AI** is a community-driven, open-source alternative that provides similar creative capabilities without the closed ecosystem:

| | Other providers | Open Generative AI |
| :--- | :--- | :--- |
| **Cost** | Subscription-based | Free (open-source) |
| **Models** | Proprietary | 200+ open & commercial models |
| **Multi-image input** | Limited | Up to 14 images per request |
| **Lip sync** | No | 9 models, image & video modes |
| **Hosted version** | Subscription | Free at [muapi.ai/open-generative-ai](https://muapi.ai/open-generative-ai) |
| **Self-hosting** | No | Yes |
| **Customizable** | No | Fully hackable |
| **Data privacy** | Cloud-based | Your data stays local |
| **Source code** | Closed | MIT licensed |

## 📄 License

MIT

## 🙏 Credits

Built with [Muapi.ai](https://muapi.ai) — the unified API for AI image and video generation models.

---
**Deep Dive**: For more details on the "AI Influencer" engine, upcoming "Popcorn" storyboarding features, and the future of this project, read the [full technical overview](https://medium.com/@anilmatcha/).

---
*Looking for a free Higgsfield AI, Freepik, Krea, Openart AI alternative? Open Generative AI is an open-source AI image and video generation studio and Higgsfield AI, Freepik, Krea, Openart AI replacement that you can self-host, customize, and extend.*

This project is an independent, experimental, and open-source initiative and is not affiliated with, endorsed by, or associated with Higgsfield Inc., Freepik, Krea AI, OpenArt AI, or any of their respective companies, products, or services. Any references to third-party platforms, models, or technologies are made solely for interoperability, benchmarking, research, or educational purposes. All trademarks, logos, and brand names are the property of their respective owners. If any content in this repository creates confusion or raises concerns, please contact us and we will promptly review and address it.
