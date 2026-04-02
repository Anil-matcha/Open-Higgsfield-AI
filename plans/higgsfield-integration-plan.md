# Open Higgsfield AI - Integration Plan

## Executive Summary

Transform the current Higgsfield codebase into a unified cinematic AI creation system by extracting and integrating capabilities from Open Higgsfield, Rendiv, LTX-Desktop, chatvideo-yucut, Director, and ViMax repos.

**Critical Principle**: Build by capability, not by repo. Reuse existing code, extend where possible, create only when necessary.

---

## Part 1: Current Codebase Audit

### 1.1 Main Higgsfield Frontend Structure (`/src`)

#### Studios (Components)
| Studio | Purpose | Lines | Status |
|--------|---------|-------|--------|
| `CinemaStudio.js` | Cinematic video generation with camera controls | 28,974 | ✅ Active |
| `VideoStudio.js` | Text-to-video, image-to-video | 54,269 | ✅ Active |
| `ImageStudio.js` | Text-to-image, image-to-image | 56,384 | ✅ Active |
| `AudioStudio.js` | Audio generation/editing | 8,389 | ✅ Active |
| `LipSyncStudio.js` | Lip sync for avatars | 41,584 | ✅ Active |
| `EditorPage.js` | Video editing | 61,982 | ✅ Active |
| `RenderPage.js` | Rendering/export | 20,200 | ✅ Active |
| `DirectorPage.js` | Agent orchestration | 38,046 | ✅ Active |
| `VideoAgentPage.js` | Video AI agent | 42,677 | ✅ Active |
| `EffectsStudio.js` | Visual effects | 18,921 | ✅ Active |
| `ChatStudio.js` | Chat interface | 10,839 | ✅ Active |

#### Utility Libraries (`/src/lib`)
| File | Purpose |
|------|---------|
| `muapi.js` | AI API gateway (primary integration point) |
| `models.js` | Model configurations (271KB) |
| `apiKeyManager.js` | API key management |
| `request.js` | HTTP request handling |
| `templates.js` | Template system |
| `router.js` | Client-side routing |
| `supabase.js` | Database client |
| `analytics.js` | Usage tracking |
| `instructions.js` | AI instructions/prompts |

### 1.2 Backend Structure (`/supabase/functions`)

| Function | Purpose |
|----------|---------|
| `create-share/` | Content sharing |
| `frame-agent/` | Frame-level AI operations |
| `muapi-proxy/` | Proxy to muapi.ai |
| `muapi-webhook/` | Webhook handler |
| `process-upload/` | Media upload processing |
| `videoagent/` | Video agent operations |

### 1.3 Database Schema (`/supabase/migrations`)

Multi-tenant schema with:
- `tenants`, `user_profiles`, `roles`, `user_roles`
- `projects`, `generation_history`, `generation_versions`, `assets`
- `usage_logs`, `credit_balances`, `credit_transactions`, `subscriptions`
- `shared_content`, `comments`, `notifications`, `team_invitations`
- `tenant_settings`, `model_configurations`, `audit_logs`, `api_keys`

---

## Part 2: Source Repos Capabilities

### 2.1 LTX-Desktop (`modules/LTX-Desktop`)

**Purpose**: Local video generation & editing

#### Backend (`/backend`)
- `ltx2_server.py` - Main FastAPI server
- Routes: `generation.py`, `image_gen.py`, `models.py`, `health.py`, `settings.py`, `retake.py`
- Services:
  - `ltx_pipeline_common` - Common pipeline utilities
  - `fast_video_pipeline` - Fast video generation
  - `ic_lora_pipeline` - LoRA fine-tuning pipeline
  - `ltx_api_client` - LTX API integration

#### Frontend (`/frontend`)
- `VideoEditor.tsx` - Full video editor (207KB)
- `GenSpace.tsx` - Generation workspace (70KB)
- `Project.tsx` - Project management
- **Audio handling**: `AudioUploader.tsx`, `AudioWaveform.tsx`
- **Subtitles**: `SubtitlePropertiesPanel.tsx`, `SubtitleTrackStyleEditor.tsx`
- **Timeline**: `useTimelineDrag.ts`, `usePlaybackEngine.ts`, `useClipOperations.ts`
- **Generation**: `useGapGeneration.ts`, `useRegeneration.ts`, `I2vGenerationModal.tsx`
- Hooks: `use-backend.ts`, `use-generation.ts`, `use-retake.ts`, `use-ic-lora.ts`

**Extract**: Audio upload/waveform display, subtitle track editing, timeline drag operations, gap generation, I2V generation modal

### 2.2 Director (`apps/director/backend`)

**Purpose**: Agent orchestration for video workflows

#### Agents (26 total)
| Agent | Purpose |
|-------|---------|
| `video_generation.py` | Generate videos |
| `image_generation.py` | Generate images |
| `audio_generation.py` | Generate audio/music |
| `text_to_movie.py` | Script to movie |
| `subtitle.py` | Subtitle generation |
| `transcription.py` | Speech to text |
| `dubbing.py` | Dubbing workflow |
| `voice_replacement.py` | Voice replacement |
| `clone_voice.py` | Voice cloning |
| `editing.py` | AI editing |
| `search.py` | Semantic search |
| `index.py` | Video indexing |
| `summarize_video.py` | Video summarization |
| `prompt_clip.py` | Prompt clipping |
| `censor.py` | Content censoring |
| `frame.py` | Frame operations |
| `download.py` | Media download |
| `upload.py` | Media upload |
| `pricing.py` | Cost estimation |

#### Architecture
- `BaseAgent` - Agent base class
- `Session` - Conversation session management
- `ReasoningEngine` - LLM-based agent routing
- `ChatHandler` - Main handler with agent registry
- `VideoDBHandler` - VideoDB integration
- Multi-LLM support: OpenAI, Anthropic, Google AI

**Extract**: Agent orchestration patterns, session management, reasoning engine, multi-agent coordination

### 2.3 ViMax (`apps/vimax`)

**Purpose**: Multi-agent planning and script-to-video

#### Pipelines
| Pipeline | Purpose |
|----------|---------|
| `script2video_pipeline.py` | Script → video with storyboard |
| `idea2video_pipeline.py` | Idea → video |
| `novel2movie_pipeline.py` | Novel → movie |

#### Agents
| Agent | Purpose |
|-------|---------|
| `script_planner.py` | Script planning with intent routing |
| `screenwriter.py` | Screenwriting |
| `storyboard_artist.py` | Storyboard creation |
| `character_extractor.py` | Character extraction |
| `character_portraits_generator.py` | Character portraits |
| `camera_image_generator.py` | Camera shots generation |
| `reference_image_selector.py` | Reference image selection |
| `global_information_planner.py` | Global story planning |

#### Key Patterns
- Async pipeline orchestration with `asyncio.gather()`
- Rate limiting per service
- Event-based synchronization
- Character portrait registry
- Camera tree construction

**Extract**: Pipeline orchestration patterns, intent routing, rate limiting, storyboard-camera relationship

### 2.4 Rendiv (`modules/rendiv`)

**Purpose**: Code-driven render/composition system

#### Packages
| Package | Purpose |
|---------|---------|
| `renderer/` | Frame rendering, media rendering, video stitching |
| `rendiv/` | Core composition (Sequence, Series, Loop, Audio, Video) |
| `studio/` | Studio UI (Timeline, Preview, AssetBrowser, RenderQueue) |
| `bundler/` | Composition bundling |
| `cli/` | Command line interface |
| `text/` | Text animation presets |
| `shapes/` | Shape primitives |
| `paths/` | SVG path manipulation |
| `fonts/` | Font handling |
| `effects/` | Visual filters |
| `lottie/` | Lottie animation support |
| `motion-blur/` | Motion blur effects |
| `transitions/` | Transition effects |

#### Key Files
- `render-frames.ts` - Frame-based rendering
- `stitch-frames-to-video.ts` - Video stitching
- `serve.ts` - Development server
- `Timeline.tsx`, `TimelineEditor.tsx` - Timeline UI
- `Preview.tsx` - Preview player
- `RenderQueue.tsx` - Render queue

**Extract**: Timeline UI patterns, render queue, frame stitching, composition sequencing

### 2.5 chatvideo-yucut (`modules/chatvideo-yucut`)

**Purpose**: AI-powered video editing with natural language

#### Core Features
- **Timeline Editor**: Multi-track editing with clips, transitions
- **AI Agent Tools**:
  - `edit_clip` - Move, crop, split, delete, copy
  - `add_element` - Add media, text, HTML, camera, transitions
  - `set_clip_property` - Properties and keyframe animation
  - `detect_video_scenes` - TransNet V2 scene detection
  - `transcribe_audio` - Whisper transcription
  - `search_assets_semantic` - CLIP semantic search
  - `auto_cut_speech_errors` - Auto-edit speech errors

#### Architecture
- Electron wrapper with built-in HTTP server (port 3100)
- MCP protocol via WebSocket
- WebCodecs for video processing
- Local AI: CLIP, Whisper, TransNet V2

**Extract**: AI editing tool definitions, scene detection, semantic search, MCP protocol patterns

---

## Part 3: Duplication-Risk Analysis

### 3.1 Overlap Between Current Higgsfield and Source Repos

| Capability | Higgsfield | LTX | Director | ViMax | Rendiv | chatvideo | Risk |
|------------|------------|-----|----------|-------|--------|-----------|------|
| Video Generation | ✅ muapi | ✅ LTX | ✅ | ✅ | ❌ | ❌ | Low |
| Image Generation | ✅ muapi | ✅ | ✅ | ✅ | ❌ | ❌ | Low |
| Audio Generation | ✅ muapi | ❌ | ✅ | ❌ | ❌ | ❌ | Low |
| Subtitle Handling | Partial | ✅ | ✅ | ❌ | ❌ | ❌ | Medium |
| Timeline Editor | Basic | ✅ | ❌ | ❌ | ✅ | ✅ | Medium |
| Agent Orchestration | Basic | ❌ | ✅ | ✅ | ❌ | ✅ | Medium |
| Script Planning | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | High |
| Storyboarding | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | High |
| Multi-track Edit | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | Medium |
| Render Pipeline | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | High |
| Scene Detection | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | High |
| Semantic Search | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | Medium |

### 3.2 HIGH-DUPLICATION-RISK Items

1. **Agent Systems**: Director has 26 agents, VideoAgentPage exists in Higgsfield
   - **Decision**: Extend VideoAgentPage with Director patterns, don't replace

2. **Timeline Editors**: LTX-Desktop, Rendiv, and chatvideo-yucut all have timeline UI
   - **Decision**: Create unified timeline component using best patterns from all

3. **Script-to-Video**: ViMax has full pipeline, Director has text_to_movie agent
   - **Decision**: Extract ViMax pipeline patterns for CinemaStudio enhancement

4. **Render Systems**: Rendiv has code-driven rendering, no equivalent in Higgsfield
   - **Decision**: Integrate Rendiv as optional render service for advanced exports

### 3.3 NO-DUPLICATION Items (Safe to Extract)

| Capability | Source | Target Location |
|------------|--------|-----------------|
| Audio waveform display | LTX-Desktop | AudioStudio |
| Subtitle track editing | LTX-Desktop | EditorPage |
| Timeline drag operations | LTX-Desktop | Unified Timeline |
| Rate limiting patterns | ViMax | Services |
| Agent session management | Director | video-agent-service |
| Intent routing | ViMax | ScriptPlanner |
| Scene detection tools | chatvideo | video-analysis-service |
| Semantic asset search | chatvideo | video-analysis-service |
| MCP protocol bridge | chatvideo | Agent integration |

---

## Part 4: Merge-First Integration Plan

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Open Higgsfield Frontend                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Cinema   │ │ Video    │ │ Audio    │ │ Editor   │           │
│  │ Studio   │ │ Studio   │ │ Studio   │ │ Page     │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       │            │            │            │                  │
│  ┌────┴────────────┴────────────┴────────────┴────┐            │
│  │              Unified Service Layer               │            │
│  │   video-generation | video-render | video-edit  │            │
│  │   video-audio | video-analysis | video-agent     │            │
│  └─────────────────────────┬───────────────────────┘            │
└────────────────────────────┼────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ ltx-backend   │   │ rendiv-backend│   │ highlights-   │
│ (generation)  │   │ (render)      │   │ backend       │
│               │   │               │   │ (analysis)     │
└───────────────┘   └───────────────┘   └───────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    ┌───────────────┐
                    │ Supabase DB   │
                    │ + Storage     │
                    └───────────────┘
```

### 4.2 Phase 1: Backend Wiring (Immediate)

#### 1.1 ltx-backend Service
**Location**: `/src/services/ltx-backend/`
**Source**: Extract from `modules/LTX-Desktop/backend/`

**Action**: Create FastAPI service that wraps LTX generation logic
- Keep local-first architecture
- Support demo fallback mode (mock responses when LTX not available)
- Wire to VideoStudio and CinemaStudio

#### 1.2 highlights-backend Service  
**Location**: `/src/services/highlights-backend/`
**Source**: Extract from `apps/director/backend/` (search, index, summarize agents)

**Action**: Create service for video analysis
- Scene detection (from chatvideo-yucut TransNet V2)
- Transcription (from Director's Whisper integration)
- Semantic search (from chatvideo-yucut CLIP)

#### 1.3 rendiv-backend Service
**Location**: `/src/services/rendiv-backend/`
**Source**: Extract from `modules/rendiv/`

**Action**: Create render service for code-driven compositions
- Frame rendering
- Video stitching
- Export pipeline

### 4.3 Phase 2: Frontend Integration

#### 2.1 AudioStudio Enhancement
**Source**: LTX-Desktop `AudioUploader.tsx`, `AudioWaveform.tsx`

**Action**: Integrate audio waveform display and upload into AudioStudio
- Reuse existing AudioStudio component
- Add waveform visualization from LTX-Desktop

#### 2.2 EditorPage Enhancement
**Source**: LTX-Desktop timeline operations, chatvideo-yucut AI tools

**Action**: Enhance EditorPage with:
- Multi-track timeline from LTX-Desktop
- AI editing tools from chatvideo-yucut
- Subtitle track editor from LTX-Desktop

#### 2.3 CinemaStudio Enhancement
**Source**: ViMax `script_planner.py`, `storyboard_artist.py`

**Action**: Add script planning to CinemaStudio
- Intent routing (narrative/motion/montage)
- Storyboard generation
- Character management

#### 2.4 VideoAgentPage Enhancement
**Source**: Director `ChatHandler`, `Session`, `ReasoningEngine`

**Action**: Extend VideoAgentPage with Director patterns
- Agent session management
- Multi-agent coordination
- Tool registry

### 4.4 Phase 3: Service Refactoring

#### Target Backend Architecture

| Service | Responsibility | Source Repos |
|---------|---------------|--------------|
| `video-generation-service` | Text/image to video | Open Higgsfield, ViMax, LTX-Desktop |
| `video-render-service` | Composition rendering | Rendiv |
| `video-editing-service` | Timeline editing, cuts | chatvideo-yucut, LTX-Desktop |
| `video-audio-service` | Audio, subtitles, dubbing | Director, LTX-Desktop |
| `video-analysis-service` | Scene detection, search | chatvideo-yucut, Director |
| `video-agent-service` | Orchestration, planning | Director, ViMax |
| `video-project-service` | Project management | Existing Higgsfield DB |

---

## Part 5: Implementation Order

### Step 1: Create Service Infrastructure
```
[ ] Create /src/services/ directory structure
[ ] Create ltx-backend client with demo fallback
[ ] Create highlights-backend client with demo fallback
[ ] Create rendiv-backend client with demo fallback
[ ] Add environment variable handling for backend URLs
```

### Step 2: Extend Existing Studios
```
[ ] Integrate audio waveform into AudioStudio
[ ] Add subtitle track editor to EditorPage
[ ] Add timeline drag operations to EditorPage
[ ] Add script planning to CinemaStudio
```

### Step 3: Wire Up Agent System
```
[ ] Create agent session management (from Director patterns)
[ ] Add tool registry system
[ ] Integrate reasoning engine
[ ] Connect to existing VideoAgentPage
```

### Step 4: Create Unified Timeline
```
[ ] Extract timeline components from LTX-Desktop
[ ] Add AI editing tools from chatvideo-yucut
[ ] Integrate Rendiv timeline UI patterns
[ ] Create unified timeline for EditorPage
```

### Step 5: Implement Render Pipeline
```
[ ] Integrate Rendiv render-frames.ts patterns
[ ] Add video stitching from Rendiv
[ ] Create export pipeline
[ ] Add render queue UI
```

---

## Part 6: File Creation Plan

### New Files to Create

| File | Purpose | Source Reference |
|------|---------|------------------|
| `/src/services/index.js` | Service exports | New |
| `/src/services/ltx-client.js` | LTX backend client | LTX-Desktop `/backend/_routes/` |
| `/src/services/rendiv-client.js` | Rendiv backend client | Rendiv `/packages/renderer/` |
| `/src/services/highlights-client.js` | Highlights backend client | Director `/director/agents/` |
| `/src/lib/agent-core.js` | Agent orchestration | Director `/director/core/` |
| `/src/lib/rate-limiter.js` | Rate limiting | ViMax `/utils/rate_limiter.py` |
| `/src/components/UnifiedTimeline.js` | Timeline component | LTX-Desktop + Rendiv |
| `/src/components/AudioWaveform.js` | Waveform display | LTX-Desktop |
| `/src/components/SubtitleEditor.js` | Subtitle editing | LTX-Desktop |
| `/src/components/ScriptPlanner.js` | Script planning UI | ViMax frontend patterns |
| `/src/components/StoryboardPanel.js` | Storyboard UI | ViMax `/frontend/src/components/` |

### Files to Extend

| File | Extension | Source |
|------|-----------|--------|
| `/src/components/AudioStudio.js` | Add waveform | LTX-Desktop `AudioWaveform.tsx` |
| `/src/components/EditorPage.js` | Add timeline, AI tools | LTX-Desktop + chatvideo |
| `/src/components/CinemaStudio.js` | Add script planning | ViMax patterns |
| `/src/components/VideoAgentPage.js` | Agent orchestration | Director patterns |
| `/src/lib/muapi.js` | Add service routing | New backend clients |
| `/src/lib/router.js` | Add new routes | - |
| `/src/lib/templates.js` | Add new templates | - |

### Files to Reuse As-Is

| File | Reason |
|------|--------|
| Most `/src/lib/` utilities | Already well-structured |
| Database migrations | Already complete |
| Supabase functions | Already functional |
| Most component layouts | Already production-ready |

---

## Part 7: Environment Variables

### New Variables to Add

```env
# Backend Services (Phase 1)
VITE_LTX_BACKEND_URL=http://localhost:3001
VITE_HIGHLIGHTS_BACKEND_URL=http://localhost:3002
VITE_RENDIV_BACKEND_URL=http://localhost:3003

# Service Fallback Modes
VITE_LTX_DEMO_MODE=true
VITE_HIGHLIGHTS_DEMO_MODE=true
VITE_RENDIV_DEMO_MODE=true

# Feature Flags
VITE_ENABLE_TIMELINE_EDITOR=true
VITE_ENABLE_SCRIPT_PLANNING=true
VITE_ENABLE_AGENT_ORCHESTRATION=true
VITE_ENABLE_RENDIV_RENDER=true
```

---

## Part 8: Non-Duplication Enforcement

### Before Creating Any New File, Confirm:

1. **Service**: Does `/src/services/` already have equivalent?
2. **Component**: Does `/src/components/` have similar component?
3. **Utility**: Does `/src/lib/` have same functionality?
4. **Type**: Does database schema already support this data?
5. **Pattern**: Can existing patterns be extended instead of new creation?

### Decision Tree

```
Is there existing equivalent?
├── YES → Can it be extended?
│   ├── YES → Extend it
│   └── NO → Can it be refactored?
│       ├── YES → Refactor + extend
│       └── NO → Create separate (last resort)
└── NO → Create in most logical existing location
```

---

## Summary

This plan transforms Open Higgsfield into a unified cinematic AI creation system by:

1. **Preserving** existing production-ready code
2. **Extracting** best patterns from 6 source repos
3. **Integrating** without creating parallel systems
4. **Building** by capability, not by repo
5. **Maintaining** demo fallback for missing services

The phased approach ensures:
- No duplication of effort
- Incremental improvement
- Production stability
- Clear migration path to full architecture

**Next Action**: User approval of this plan before code implementation begins.
