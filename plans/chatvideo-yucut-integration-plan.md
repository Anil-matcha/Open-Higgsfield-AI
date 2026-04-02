# ChatVideo-Yucut Integration Plan

## Overview

This document outlines the integration of the chatvideo-yucut repository (deangilmoreremix/chatvideo-yucut) as the timeline editor for the Open Higgsfield AI application.

## ChatVideo-Yucut Capabilities

The chatvideo-yucut repo provides powerful agentic editing and timeline intelligence:

- **Multi-track Timeline Editing** - Multiple video/audio tracks
- **Keyframe Animation** - Precise control over animations
- **Transition Effects** - Professional transitions between clips
- **3D Camera Movement** - Simulated camera motions
- **Semantic Search** - AI-powered content search
- **Subtitle Generation** - Automatic subtitle creation
- **AI Chat-based Editing** - Natural language editing commands

## Integration Strategy

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Open Higgsfield App                     │
├─────────────────────────────────────────────────────────┤
│  Director Page    │    Timeline Editor    │  Other Apps │
│  (Storyboard)     │  (ChatVideo-Yucut)   │             │
└─────────┬─────────┴──────────┬───────────┴──────────────┘
          │                    │
          ▼                    ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend Services                        │
│  videoagent │ muapi-proxy │ frame-agent │ supabase     │
└─────────────────────────────────────────────────────────┘
```

### Implementation Phases

#### Phase 1: Basic Integration
- Clone chatvideo-yucut repository
- Set up as submodule or integrate frontend components
- Create TimelineEditorPage component
- Add route to application router

#### Phase 2: Timeline Features
- Implement multi-track timeline visualization
- Add video clip management (add, remove, reorder)
- Implement playback controls
- Add track layers (video, audio, text)

#### Phase 3: AI Chat Commands
- Integrate chat-based editing interface
- Connect to videoagent backend
- Implement command parsing
- Add feedback/result display

#### Phase 4: Advanced Features
- Keyframe animation support
- Transition effects library
- 3D camera movement presets
- Subtitle generation integration

### Component Structure

```
src/components/TimelineEditor/
├── TimelineEditor.js      # Main timeline editor component
├── TimelineTrack.js       # Individual track component
├── TimelineClip.js        # Clip on timeline
├── ChatPanel.js          # AI chat interface
├── PropertiesPanel.js    # Clip properties editor
├── Transitions.js        # Transition effects
└── Keyframes.js          # Keyframe animation editor
```

### Backend Integration

The timeline editor will connect to existing backend services:

| Feature | Backend Service |
|---------|----------------|
| Video processing | videoagent |
| Subtitle generation | muapi |
| Frame extraction | frame-agent |
| Export/Render | videoagent |
| Semantic search | videoagent |

## Next Steps

1. Clone chatvideo-yucut repository
2. Analyze its frontend components
3. Create adapter layer for integration
4. Build TimelineEditorPage component
5. Connect to existing backend

## Files to Create/Modify

- `src/components/TimelineEditor/TimelineEditor.js` - Main component
- `src/components/TimelineEditorPage.js` - Page wrapper
- `src/lib/router.js` - Add route
- `src/lib/timelineRuntime.js` - State management

## Timeline Integration with Director

The Timeline Editor will work alongside the Director's Storyboard:

1. **Director** - Creates storyboard frames and defines video structure
2. **Timeline Editor** - Arranges clips, adds transitions, edits timing
3. **Export** - Combines both for final video output
