# Open Higgsfield AI — Open-Source Alternative to Higgsfield AI

> **The free, open-source alternative to Higgsfield AI.** Generate AI images and cinematic shots using 20+ state-of-the-art models — without the closed ecosystem or subscription fees.

Open Higgsfield AI is an open-source AI image and cinema studio that brings Higgsfield-style creative workflows to everyone. Powered by [Muapi.ai](https://muapi.ai), it supports models like Flux Schnell, Flux Dev, SDXL, Ideogram, Midjourney, and more — all from a sleek, modern interface you can self-host and customize.

**Why Open Higgsfield AI instead of Higgsfield AI?**
- **Free & open-source** — no subscription, no vendor lock-in
- **Self-hosted** — your data stays on your machine
- **20+ models** — access more AI models than any single closed platform
- **Extensible** — add your own models, modify the UI, build on top of it

For a deep dive into the technical architecture and the philosophy behind the "Infinite Budget" cinema workflow, see our [comprehensive guide and roadmap](https://medium.com/@anilmatcha/building-open-higgsfield-ai-an-open-source-ai-cinema-studio-83c1e0a2a5f1).

![Studio Demo](docs/assets/studio_demo.webp)

## ✨ Features

- **Cinema Studio** — Higgsfield AI-style interface for photorealistic cinematic shots with pro camera controls (Lens, Focal Length, Aperture)
- **Multi-Model Support** — Switch between 20+ AI image generation models (Flux, Nano Banana, Ideogram, Midjourney, SDXL, and more)
- **Smart Controls** — Dynamic aspect ratio and resolution pickers that adapt to each model's capabilities
- **Generation History** — Browse, revisit, and download all your past generations (persisted in browser storage). Now with a persistent sidebar in Cinema Studio.
- **Image Download** — One-click download of generated images in full resolution (up to 4K)
- **API Key Management** — Secure API key storage in browser localStorage (never sent to any server except Muapi)
- **Responsive Design** — Works seamlessly on desktop and mobile with dark glassmorphism UI

### 🎥 Cinema Studio Controls

The **Cinema Studio** offers precise control over the virtual camera, translating your choices into optimized prompt modifiers:

| Category | Available Options |
| :--- | :--- |
| **Cameras** | Modular 8K Digital, Full-Frame Cine Digital, Grand Format 70mm Film, Studio Digital S35, Classic 16mm Film, Premium Large Format Digital |
| **Lenses** | Creative Tilt, Compact Anamorphic, Extreme Macro, 70s Cinema Prime, Classic Anamorphic, Premium Modern Prime, Warm Cinema Prime, Swirl Bokeh Portrait, Vintage Prime, Halation Diffusion, Clinical Sharp Prime |
| **Focal Lengths** | 8mm (Ultra-Wide), 14mm, 24mm, 35mm (Human Eye), 50mm (Portrait), 85mm (Tight Portrait) |
| **Apertures** | f/1.4 (Shallow DoF), f/4 (Balanced), f/11 (Deep Focus) |

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Muapi.ai](https://muapi.ai) API key

### Setup

```bash
# Clone the repository
git clone https://github.com/Anil-matcha/Open-Higgsfield-AI.git
cd Open-Higgsfield-AI

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser. You'll be prompted to enter your Muapi API key on first use.

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Architecture

```
src/
├── components/
│   ├── ImageStudio.js    # Standard studio with prompt, pickers, canvas, history
│   ├── CinemaStudio.js   # Pro studio with camera controls & infinite canvas flow
│   ├── CameraControls.js # Scrollable picker for camera/lens/focal/aperture
│   ├── Header.js         # App header with settings and controls
│   ├── AuthModal.js      # API key input modal
│   ├── SettingsModal.js   # Settings panel for API key management
│   └── Sidebar.js        # Navigation sidebar
├── lib/
│   ├── muapi.js          # API client (submit + poll pattern, x-api-key auth)
│   └── models.js         # Model definitions with endpoint mappings
├── styles/
│   ├── global.css        # Global styles and animations
│   ├── studio.css        # Studio-specific styles
│   └── variables.css     # CSS custom properties
├── main.js               # App entry point
└── style.css             # Tailwind imports
```

## 🔌 API Integration

The app communicates with [Muapi.ai](https://muapi.ai) using a two-step pattern:

1. **Submit** — `POST /api/v1/{model-endpoint}` with prompt and parameters
2. **Poll** — `GET /api/v1/predictions/{request_id}/result` until status is `completed`

Authentication uses the `x-api-key` header. During development, a Vite proxy handles CORS by routing `/api` requests to `https://api.muapi.ai`.

## 🎨 Supported Models

| Model | Endpoint | Resolution Options |
|-------|----------|-------------------|
| Nano Banana | `nano-banana` | — |
| Nano Banana Pro | `nano-banana-pro` | **up to 4K** (Cinema Studio) |
| Flux Schnell | `flux-schnell-image` | — |
| Flux Dev | `flux-dev-image` | — |
| Flux Dev LoRA | `flux-dev-lora` | — |
| Ideogram V2 | `ideogram-v2` | — |
| SDXL | `sdxl` | — |
| And 15+ more... | | |

## 🛠️ Tech Stack

- **Vite** — Build tool & dev server
- **Tailwind CSS v4** — Utility-first styling
- **Vanilla JS** — No framework, pure DOM manipulation
- **Muapi.ai** — AI model API gateway

## 🤔 How is this different from Higgsfield AI?

Higgsfield AI is a proprietary AI video and image generation platform. **Open Higgsfield AI** is a community-driven, open-source alternative that provides similar creative capabilities without the closed ecosystem:

| | Higgsfield AI | Open Higgsfield AI |
| :--- | :--- | :--- |
| **Cost** | Subscription-based | Free (open-source) |
| **Models** | Proprietary | 20+ open & commercial models |
| **Self-hosting** | No | Yes |
| **Customizable** | No | Fully hackable |
| **Data privacy** | Cloud-based | Your data stays local |
| **Source code** | Closed | MIT licensed |

## 📄 License

MIT

## 🙏 Credits

Built with [Muapi.ai](https://muapi.ai) — the unified API for AI image generation models.

---
**Deep Dive**: For more details on the "AI Influencer" engine, upcoming "Popcorn" storyboarding features, and the future of this project, read the [full technical overview](https://medium.com/@anilmatcha/building-open-higgsfield-ai-an-open-source-ai-cinema-studio-83c1e0a2a5f1).

---
*Looking for a free Higgsfield AI alternative? Open Higgsfield AI is an open-source AI image generation studio and Higgsfield AI replacement that you can self-host, customize, and extend.*
