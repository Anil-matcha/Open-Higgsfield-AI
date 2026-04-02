# Complete Timeline Editor Integration Plan

## Overview

This document lists ALL features for the complete Timeline Editor app including AI agents, matching the design structure of the Render/Director pages.

## Design Pattern (from DirectorPage.js)

The app uses:
- `createSurface()` - Rounded containers with gradient backgrounds and blur
- Three-column layout: Left sidebar | Main content | Right sidebar  
- Header with icons and status badges
- Tailwind CSS styling with custom gradients and borders

```javascript
function createSurface(children, className = '') {
  div.className = `rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.028))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl ${className}`;
}
```

---

# COMPLETE FEATURE LIST

## 1. TIMELINE EDITOR CORE

### 1.1 Multi-Track Timeline
- [ ] Video track (primary)
- [ ] Audio track(s) - background music, voiceover
- [ ] Text/Subtitle track
- [ ] Effect/Overlay track
- [ ] B-Roll track

### 1.2 Clip Operations
- [ ] Add clips from media library
- [ ] Drag to reposition
- [ ] Trim (start/end handles)
- [ ] Split at playhead
- [ ] Duplicate clips
- [ ] Delete clips
- [ ] Copy/paste clips

### 1.3 Playhead & Scrubbing
- [ ] Playhead indicator
- [ ] Click to seek
- [ ] Drag to scrub
- [ ] Time display (current/total)
- [ ] Zoom in/out timeline

---

## 2. TRANSITION EFFECTS

### 2.1 Transition Types
| ID | Name | Icon | Description |
|----|------|------|-------------|
| fade | Fade | ◐ | Fade in/out |
| dissolve | Dissolve | ◑ | Cross dissolve |
| wipe-left | Wipe Left | ◀ | Left to right |
| wipe-right | Wipe Right | ▶ | Right to left |
| wipe-up | Wipe Up | ▲ | Bottom to top |
| wipe-down | Wipe Down | ▼ | Top to bottom |
| zoom-in | Zoom In | 🔍+ | Zoom into frame |
| zoom-out | Zoom Out | 🔍- | Zoom out of frame |
| blur | Blur | 💧 | Blur transition |
| spin-cw | Spin Clockwise | 🔄 | Clockwise spin |
| spin-ccw | Spin Counter-CW | ↺ | Counter-clockwise spin |

### 2.2 Transition Controls
- [ ] Drag transition between clips
- [ ] Duration adjustment (0.25s - 2s)
- [ ] Transition preview
- [ ] Remove transition

---

## 3. KEYFRAME ANIMATION

### 3.1 Animatable Properties
| Property | Range | Description |
|----------|-------|-------------|
| position-x | -100% to 100% | Horizontal position |
| position-y | -100% to 100% | Vertical position |
| scale | 0.1 to 5.0 | Zoom level |
| rotation | -360° to 360° | Rotation angle |
| opacity | 0% to 100% | Transparency |
| blur | 0px to 20px | Blur amount |
| crop-top | 0% to 50% | Top crop |
| crop-bottom | 0% to 50% | Bottom crop |
| crop-left | 0% to 50% | Left crop |
| crop-right | 0% to 50% | Right crop |

### 3.2 Easing Functions
| ID | Name | Curve |
|----|------|-------|
| linear | Linear | straight |
| ease-in-quad | Ease In Quad | accelerating |
| ease-out-quad | Ease Out Quad | decelerating |
| ease-in-out-quad | Ease In-Out Quad | smooth |
| ease-in-cubic | Ease In Cubic | strong accel |
| ease-out-cubic | Ease Out Cubic | strong decel |
| bounce | Bounce | bouncing |
| elastic | Elastic | springy |

### 3.3 Keyframe UI
- [ ] Add keyframe at current time
- [ ] Edit keyframe properties
- [ ] Delete keyframe
- [ ] Copy keyframes
- [ ] Keyframe timeline visualization

---

## 4. AI AGENTS FOR EDITING

### 4.1 Timeline AI Commands

| Command | Description | Implementation |
|---------|-------------|----------------|
| "detect scenes" | Find scene boundaries | TransNet V2 |
| "split at current time" | Split clip at playhead | Client-side |
| "trim clip" | Adjust clip boundaries | Client-side |
| "add fade transition" | Add fade between clips | Client-side UI + API render |
| "add text" | Add text overlay | Client-side |
| "generate subtitles" | Create subtitles | Whisper API |
| "remove filler words" | Clean up speech | AI processing |
| "add b-roll" | Find and add B-roll | Media search |
| "speed up" | Increase playback speed | Client-side + render |
| "slow down" | Decrease playback speed | Client-side + render |
| "stabilize" | Stabilize shaky video | API processing |
| "add zoom effect" | Add zoom animation | Keyframe UI |
| "add shake" | Add camera shake | Keyframe + effect |
| "find related footage" | Semantic media search | CLIP API |

### 4.2 AI Chat Panel
- [ ] Command input field
- [ ] Response display area
- [ ] Action buttons for common commands
- [ ] Processing indicator
- [ ] Command history

### 4.3 Agent Status Display
- [ ] Active agents list
- [ ] Agent progress
- [ ] Agent logs

---

## 5. SCENE DETECTION

### 5.1 TransNet V2 Integration
- [ ] One-click scene detection
- [ ] Sensitivity threshold slider (0.1 - 0.9)
- [ ] Scene thumbnail previews
- [ ] Short scene merging option (min duration)

### 5.2 Scene Markers UI
- [ ] Visual markers on timeline
- [ ] Click marker to jump
- [ ] Delete scene marker
- [ ] Merge scenes button

---

## 6. SUBTITLE GENERATION

### 6.1 Whisper Integration
- [ ] Upload audio/video for transcription
- [ ] Language selection
- [ ] Word-level timestamps

### 6.2 Subtitle Editor
- [ ] Subtitle text editing
- [ ] Timing adjustment (start/end)
- [ ] Style customization:
  - Font family
  - Font size
  - Font color
  - Background color
  - Position (top/middle/bottom)
- [ ] Preview on video

### 6.3 Export Options
- [ ] SRT format
- [ ] VTT format
- [ ] Copy to clipboard

---

## 7. 3D CAMERA EFFECTS

### 7.1 Camera Effect Types
| Effect | Description | Parameters |
|--------|-------------|------------|
| shake | Random camera shake | intensity, duration |
| hitchcock | Zoom while panning | startScale, endScale, direction |
| orbit | Circular movement | radius, speed, direction |
| pan-left | Horizontal pan left | distance, duration |
| pan-right | Horizontal pan right | distance, duration |
| tilt-up | Vertical tilt up | distance, duration |
| tilt-down | Vertical tilt down | distance, duration |

### 7.2 Effect Controls
- [ ] Effect selector
- [ ] Parameter sliders
- [ ] Duration control
- [ ] Preview button

---

## 8. MEDIA LIBRARY

### 8.1 Local Media
- [ ] Upload images/videos
- [ ] Thumbnail grid view
- [ ] Search/filter
- [ ] Delete media

### 8.2 Semantic Search (CLIP)
- [ ] Natural language query
- [ ] Results ranked by relevance
- [ ] Add to timeline

---

## 9. PROJECT MANAGEMENT

### 9.1 Save/Load
- [ ] Save to localStorage
- [ ] Save to Supabase (with auth)
- [ ] Load project
- [ ] Project list
- [ ] Delete project

### 9.2 Export
- [ ] Export timeline JSON
- [ ] Import timeline JSON
- [ ] Export video (via API)

---

## 10. UI LAYOUT STRUCTURE

### 10.1 Three-Column Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: Logo + Title + Status Badge                           │
├────────────┬──────────────────────────────┬─────────────────────┤
│            │                              │                     │
│  LEFT      │     VIDEO PREVIEW           │    PROPERTIES      │
│  SIDEBAR   │     (16:9 aspect)          │    PANEL           │
│            │                              │                     │
│  - Media   │                              │  - Clip settings   │
│    Library │                              │  - Transform       │
│            │                              │  - Effects         │
│  - Quick   ├──────────────────────────────┤  - Keyframes       │
│    Actions │                              │                     │
│            │     MULTI-TRACK              │    AI CHAT         │
│  - Scene   │     TIMELINE                 │    PANEL           │
│    Detection                              │                     │
│            │  [Video][Audio][Text][Broll] │  - Commands        │
│            │  ════════════════════════     │  - History         │
│            │         ◀ ▶ ⏸               │                     │
└────────────┴──────────────────────────────┴─────────────────────┘
```

### 10.2 Surface Components

```javascript
// Main sections use createSurface()
createSurface(timelineContainer, 'p-4');
createSurface(previewPanel, 'p-3');
createSurface(propertiesPanel, 'p-4');
createSurface(aiChatPanel, 'p-4');
```

### 10.3 Header Design
- Logo/icon
- Page title ("TIMELINE EDITOR")
- Status badges (e.g., "Rendering", "Saved", "AI Active")
- Action buttons

---

## 11. FILE STRUCTURE

```
src/components/
├── TimelineEditorPage.js         # Main page component
├── timeline/
│   ├── Timeline.js               # Timeline container
│   ├── Track.js                  # Individual track
│   ├── Clip.js                   # Clip component
│   ├── Playhead.js               # Playhead indicator
│   ├── TransitionPanel.js        # Transition library
│   ├── KeyframeEditor.js         # Keyframe animation
│   ├── PropertiesPanel.js        # Clip properties
│   ├── AIChatPanel.js            # AI commands
│   ├── MediaLibrary.js           # Media browser
│   ├── SceneDetector.js          # Scene detection UI
│   ├── SubtitleEditor.js         # Subtitle editor
│   └── CameraEffects.js          # 3D camera effects
└── ...

src/lib/
├── timelineRuntime.js            # Timeline state management
├── timelineCommands.js           # AI command handlers
└── ...
```

---

## 12. STATE MANAGEMENT

### 12.1 Timeline State Structure
```javascript
const timelineState = {
  id: 'project-123',
  name: 'My Project',
  duration: 180000, // ms
  currentTime: 0,
  zoom: 1,
  selectedTrackId: null,
  selectedClipId: null,
  tracks: [
    {
      id: 'video-1',
      type: 'video',
      name: 'Video 1',
      clips: [
        {
          id: 'clip-1',
          mediaUrl: '...',
          startTime: 0,
          endTime: 5000,
          trimStart: 0,
          trimEnd: 5000,
          transitions: { in: 'fade', out: null },
          keyframes: [...],
          effects: [...],
        }
      ]
    }
  ],
  subtitles: [...],
  createdAt: '...',
  updatedAt: '...',
};
```

### 12.2 Runtime Methods
```javascript
// Track operations
addTrack(type)
removeTrack(trackId)
reorderTracks(fromIndex, toIndex)

// Clip operations
addClip(trackId, clip)
removeClip(clipId)
moveClip(clipId, newStartTime)
trimClip(clipId, start, end)
splitClip(clipId, time)

// Transition operations
addTransition(clipId, transitionType, position)
removeTransition(clipId, position)

// Keyframe operations
addKeyframe(clipId, property, time, value)
removeKeyframe(clipId, keyframeId)
updateKeyframe(clipId, keyframeId, value)

// Project operations
saveProject()
loadProject(projectId)
exportVideo()
```

---

## 13. API INTEGRATION

### 13.1 MUAPI Endpoints Used
| Feature | Endpoint | Method |
|---------|----------|--------|
| Image generation | /generate/image | POST |
| Video generation | /generate/video | POST |
| I2V | /generate/i2v | POST |
| V2V | /process/v2v | POST |
| Upload | /upload/file | POST |
| Transcription | /transcribe | POST |

### 13.2 Supabase Tables
| Table | Purpose |
|-------|---------|
| timelines | Project timeline state |
| media | User media library |
| projects | Project metadata |

---

## 14. ACCEPTANCE CRITERIA

### Must Have (P0)
- [ ] Timeline Editor in sidebar navigation
- [ ] Multi-track timeline displays (video, audio, text, B-roll)
- [ ] Clips can be added, moved, trimmed, split
- [ ] Transitions UI works (fade, dissolve, wipe, etc.)
- [ ] Keyframe UI works (position, scale, rotation, opacity)
- [ ] Properties panel shows clip settings
- [ ] Project saves to localStorage
- [ ] "Full Editor" button in Render page opens with video context

### Should Have (P1)
- [ ] AI chat panel with basic commands
- [ ] Scene detection UI
- [ ] Subtitle editor
- [ ] Media library with upload

### Nice to Have (P2)
- [ ] 3D camera effects
- [ ] Semantic search
- [ ] Cloud save (Supabase)
- [ ] Export video

---

## 15. IMPLEMENTATION PRIORITY

### Phase 1: Core Timeline (Week 1)
1. TimelineEditorPage skeleton
2. Track system
3. Clip operations
4. Playhead

### Phase 2: Transitions & Keyframes (Week 2)
1. Transition panel
2. Keyframe editor
3. Properties panel

### Phase 3: AI Agents (Week 3)
1. AI chat panel
2. Command handlers
3. Agent status display

### Phase 4: Advanced Features (Week 4)
1. Scene detection
2. Subtitle generation
3. Camera effects

### Phase 5: Polish (Week 5)
1. Media library
2. Project management
3. Export functionality
