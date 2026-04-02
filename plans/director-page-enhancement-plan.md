# Director Page Enhancement Plan

## Overview
Enhance the current Director page by converting the provided React code to vanilla JavaScript while preserving the existing AI-generated header image and integrating a robust storyboard engine architecture.

## Current State Analysis

### Existing DirectorPage.js
- **Location**: `src/components/DirectorPage.js`
- **Structure**: Vanilla JS component with DOM manipulation
- **Features**:
  - 24 AI agents with category filtering
  - Chat interface with command processing
  - Quick actions panel
  - Video preview area
  - Processing status with progress tracking
  - Export options

### React Code to Convert
The provided React code includes:
- **24 AI Agents** with icons and descriptions
- **10 Quick Actions** for common tasks
- **Storyboard System** with:
  - Frame management (add, edit, generate)
  - Shot type selection (7 types)
  - 4 storyboard presets (cinematic-story, commercial-ad, documentary-flow, social-shorts)
  - Frame visual rendering with gradient palettes
  - Preview monitor with timeline
  - AI chat integration

## Architecture Design

### 1. DirectorAgentRuntime
A single controller that manages all storyboard operations:

```javascript
class DirectorAgentRuntime {
  constructor() {
    this.projectKnowledge = null;
    this.currentPreset = null;
    this.frames = [];
    this.chatContext = '';
  }
  
  async initialize() {
    this.projectKnowledge = await buildDirectorProjectKnowledge();
  }
  
  async generateStoryboardPlan({ frames, preset, chatInstruction }) {
    // Routes to specialized agents based on context
  }
  
  async generateFrame(frame, preset, knowledge) {
    // Single frame generation
  }
  
  async generateAllFrames(frames, preset, knowledge) {
    // Sequence-level generation
  }
}
```

### 2. Project Knowledge Builder
Creates normalized context for all storyboard operations:

```javascript
async function buildDirectorProjectKnowledge() {
  return {
    projectType: 'cinematic storyboard',
    repoContext: {
      appName: 'Director',
      availableModules: [
        'storyboard', 'scene-detection', 'highlight-extraction',
        'subtitle-generation', 'voiceover', 'b-roll',
        'clip-creation', 'trailer-generation'
      ],
      templates: ['cinematic-story', 'commercial-ad', 'documentary-flow', 'social-shorts'],
      agents: ['Video Summarizer', 'Scene Detector', 'Story Builder', 'Trailer Creator'],
      effects: ['camera progression', 'motion notes', 'continuity lock'],
      generationCapabilities: ['frame planning', 'shot sequencing', 'narrative beats', 'preview generation']
    }
  };
}
```

### 3. Specialized Agent Roles
Each agent has a specific responsibility:

| Agent | Role |
|-------|------|
| Story Builder | Narrative flow, beginning/middle/end |
| Scene Detector | Break scenes into logical beats |
| Preview Generator | Create visual frame previews |
| Trailer Creator | Compress storyboard into promo/trailer sequence |
| Voiceover | Narration lines for each frame |
| B-Roll Adder | Supporting cutaway suggestions |
| Video Editor | Sequencing and transition recommendations |

### 4. Frame Prompt Builder
Converts frame data + preset + knowledge into generation instructions:

```javascript
function buildStoryboardFramePrompt(frame, preset, knowledge) {
  return `
Create a ${preset.visualStyle.toLowerCase()} ${frame.shot.toLowerCase()} storyboard frame
for a ${knowledge.projectType}.

Brand/Product: ${knowledge.brandName || 'N/A'}
Goal: ${(knowledge.goals || []).join(', ')}
Audience: ${knowledge.targetAudience || 'General'}

Frame Prompt:
${frame.prompt}

Narration / Intent:
${frame.narration || 'None'}

Apply:
- ${preset.mood} mood
- ${preset.aspectRatio} composition
- visual continuity with previous frames
- cinematic framing
- subject consistency
- location consistency where relevant
`;
}
```

## Implementation Plan

### Phase 1: Create Director Agent Runtime Module
**File**: `src/lib/directorAgentRuntime.js`

1. Create `DirectorAgentRuntime` class
2. Implement `buildDirectorProjectKnowledge()` utility
3. Implement `buildStoryboardFramePrompt()` utility
4. Implement `directorStoryboardEngine()` function
5. Add specialized agent routing logic

### Phase 2: Enhance DirectorPage.js Structure
**File**: `src/components/DirectorPage.js`

1. **Preserve existing header** with AI-generated image
2. **Add storyboard section** to left panel:
   - Storyboard preset selector
   - Frame management controls
   - Frame cards with shot type, prompt, narration
   - Generate Frame / Generate All Frames buttons
3. **Add preview monitor** to center panel:
   - Frame visual rendering
   - Timeline controls
   - Aspect ratio display
4. **Integrate AI chat** with storyboard context:
   - Chat can modify storyboard state
   - Chat instructions update generation context

### Phase 3: Convert React Components to Vanilla JS

#### 3.1 Frame Visual Rendering
Convert `FrameVisual` component:
```javascript
function createFrameVisual(frame, large = false) {
  const palette = frame.palette || ['#0f172a', '#020617', '#38bdf8'];
  const [c1, c2, c3] = palette;
  
  const div = document.createElement('div');
  div.className = `relative overflow-hidden rounded-2xl border border-white/10 ${large ? 'aspect-video' : 'aspect-[16/10]'}`;
  div.style.background = `radial-gradient(circle at 28% 24%, ${c3}33, transparent 28%), radial-gradient(circle at 70% 72%, rgba(16,185,129,0.18), transparent 24%), linear-gradient(135deg, ${c1} 0%, ${c2} 62%, #000 100%)`;
  
  // Add grid lines, shot label, prompt overlay, standby indicator
  // ...
  
  return div;
}
```

#### 3.2 Surface Component
Convert `Surface` component:
```javascript
function createSurface(children, className = '') {
  const div = document.createElement('div');
  div.className = `rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.028))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl ${className}`;
  div.appendChild(children);
  return div;
}
```

#### 3.3 State Management
Replace React useState with vanilla JS:
```javascript
// State object
const state = {
  frames: [
    makeFrame(1, 'Wide Shot', 'Opening cinematic establishing frame', 'Open on a cinematic wide frame.'),
    makeFrame(2, 'Medium Shot', 'Main subject enters frame', 'Move closer to the main subject.'),
    makeFrame(3, 'Close-Up', 'Close-up detail shot', 'Finish with a close-up.'),
  ],
  selectedFrameId: 1,
  chatInput: '',
  storyboardPreset: 'cinematic-story'
};

// State update function
function updateState(patch) {
  Object.assign(state, patch);
  render();
}

// Frame update function
function updateFrame(id, patch) {
  state.frames = state.frames.map(f => f.id === id ? { ...f, ...patch } : f);
  render();
}
```

### Phase 4: Integrate Storyboard Engine

1. **Wire Generate Frame button** to `directorStoryboardEngine`
2. **Wire Generate All Frames button** to sequence generation
3. **Connect chat input** to storyboard context updates
4. **Update preview monitor** on frame selection/generation

### Phase 5: Add Utility Functions

1. **`makeFrame(id, shot, prompt, narration)`** - Create frame object
2. **`hashCode(str)`** - Generate hash for palette selection
3. **`paletteFromText(text)`** - Generate color palette from text
4. **`generateFrame(id)`** - Generate single frame
5. **`generateAllFrames()`** - Generate all frames in sequence

## File Structure

```
src/
├── components/
│   └── DirectorPage.js (enhanced)
├── lib/
│   ├── directorAgentRuntime.js (new)
│   ├── router.js (existing)
│   ├── thumbnails.js (existing)
│   └── security.js (existing)
└── styles/
    └── global.css (existing)
```

## Key Features to Implement

### 1. Three-Column Layout
- **Left Panel**: Quick Actions + Storyboard Controls
- **Center Panel**: Preview Monitor + AI Chat
- **Right Panel**: AI Agents + Active Agents + Recent Actions

### 2. Storyboard System
- Preset selection (4 presets)
- Frame management (add, edit, remove)
- Shot type selection (7 types)
- Frame generation (single + batch)
- Visual preview with gradient palettes

### 3. AI Chat Integration
- Chat can modify storyboard context
- Commands update generation parameters
- Real-time frame updates based on chat

### 4. Preview Monitor
- Large frame visual display
- Timeline controls
- Aspect ratio indicator
- Frame status indicator

## Data Flow

```
DirectorUI
  ↓
Collect storyboard state
  ↓
Collect chat instruction
  ↓
Build project knowledge
  ↓
Call storyboard engine
  ↓
Engine routes to agent logic
  ↓
Returns updated frames / prompts / previews
  ↓
Update UI state
  ↓
Render
```

## Presets Configuration

```javascript
const STORYBOARD_PRESETS = [
  { 
    id: 'cinematic-story', 
    label: 'Cinematic Story', 
    aspectRatio: '16:9', 
    visualStyle: 'Cinematic', 
    mood: 'Dramatic', 
    generationMode: 'Storyboard Frames' 
  },
  { 
    id: 'commercial-ad', 
    label: 'Commercial Ad', 
    aspectRatio: '16:9', 
    visualStyle: 'Commercial', 
    mood: 'Aspirational', 
    generationMode: 'Storyboard Frames' 
  },
  { 
    id: 'documentary-flow', 
    label: 'Documentary Flow', 
    aspectRatio: '16:9', 
    visualStyle: 'Documentary', 
    mood: 'Emotional', 
    generationMode: 'Scene Beats' 
  },
  { 
    id: 'social-shorts', 
    label: 'Social Shorts', 
    aspectRatio: '9:16', 
    visualStyle: 'Stylized', 
    mood: 'Energetic', 
    generationMode: 'Shot Plan' 
  },
];
```

## Shot Types

```javascript
const SHOT_TYPES = [
  'Wide Shot', 
  'Medium Shot', 
  'Close-Up', 
  'Extreme Close-Up', 
  'POV', 
  'Overhead', 
  'Low Angle'
];
```

## Color Palettes

```javascript
const PALETTES = [
  ['#0f172a', '#020617', '#38bdf8'],
  ['#111827', '#030712', '#10b981'],
  ['#1e1b4b', '#020617', '#818cf8'],
  ['#0b1020', '#030712', '#22d3ee'],
  ['#172033', '#050816', '#60a5fa'],
  ['#0c1326', '#04070d', '#34d399'],
];
```

## Implementation Steps

### Step 1: Create `src/lib/directorAgentRuntime.js`
- DirectorAgentRuntime class
- buildDirectorProjectKnowledge function
- buildStoryboardFramePrompt function
- directorStoryboardEngine function
- Specialized agent routing

### Step 2: Enhance `src/components/DirectorPage.js`
- Preserve existing header and video preview
- Add storyboard section to left panel
- Add preview monitor to center panel
- Integrate AI chat with storyboard
- Add frame management logic
- Add generation pipeline

### Step 3: Add State Management
- State object with frames, selectedFrameId, chatInput, preset
- updateState function
- updateFrame function
- render function for UI updates

### Step 4: Add Utility Functions
- makeFrame
- hashCode
- paletteFromText
- generateFrame
- generateAllFrames

### Step 5: Wire Event Handlers
- Preset selector change
- Frame card click
- Shot type selector change
- Prompt/narration input
- Generate Frame button
- Generate All Frames button
- Chat input and send

## Testing Checklist

- [ ] Header displays correctly with AI-generated image
- [ ] Quick actions panel renders all 10 actions
- [ ] Storyboard preset selector works
- [ ] Frame cards display correctly
- [ ] Add Frame button adds new frame
- [ ] Remove Frame button removes frame
- [ ] Shot type selector updates frame
- [ ] Prompt input updates frame
- [ ] Narration input updates frame
- [ ] Generate Frame button generates single frame
- [ ] Generate All Frames button generates all frames
- [ ] Preview monitor displays selected frame
- [ ] AI chat integrates with storyboard
- [ ] Agent grid displays all 24 agents
- [ ] Active agents panel updates
- [ ] Recent actions panel updates
- [ ] All styling matches design system

## Success Criteria

1. All React functionality converted to vanilla JS
2. Existing AI-generated header image preserved
3. Storyboard engine architecture implemented
4. Project knowledge builder functional
5. Frame generation pipeline working
6. AI chat integration complete
7. All 24 agents accessible
8. All 10 quick actions working
9. Three-column layout responsive
10. All styling consistent with design system
