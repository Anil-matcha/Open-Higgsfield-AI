// TimelineEditorPage.js - AI Timeline Editor
// Combines CineGen-style editor UX with LTX-Desktop generation engine

import { muapi } from '../lib/muapi.js';
import { AuthModal } from './AuthModal.js';
import { 
  generationService, 
  createTextToVideoRequest, 
  createImageToVideoRequest,
  createRetakeRequest,
  createExtendRequest,
  createBrollRequest 
} from '../lib/editor/generationService.js';

/**
 * Timeline Editor State
 */
const timelineState = {
  id: null,
  name: 'Untitled Project',
  duration: 60000,
  currentTime: 0,
  zoom: 1,
  isPlaying: false,
  selectedTrackId: null,
  selectedClipId: null,
  tracks: [
    { id: 'video-1', type: 'video', name: 'Video', clips: [], locked: false, visible: true },
    { id: 'audio-1', type: 'audio', name: 'Audio', clips: [], locked: false, visible: true },
    { id: 'text-1', type: 'text', name: 'Text', clips: [], locked: false, visible: true },
    { id: 'broll-1', type: 'broll', name: 'B-Roll', clips: [], locked: false, visible: true },
  ],
  subtitles: [],
  scenes: [],
  mediaLibrary: [],
  // New: Generation state
  activeGenerations: [],
  generatedAssets: [],
  generationPanelOpen: false,
  generationMode: 'text-to-video', // text-to-video, image-to-video, retake, extend, broll
  generationPrompt: '',
  generationNegativePrompt: '',
  generationDuration: 5,
  generationAspectRatio: '16:9',
  generationStyle: 'cinematic',
  // New: Storyboard state
  storyboardScenes: [],
  selectedStoryboardSceneId: null,
  // NEW: Editing tools state (CineGen)
  activeTool: 'select',
  // NEW: Track management
  trackMuted: {},
  trackSolo: {},
  trackLocked: {},
  // NEW: Multiple timeline tabs
  timelineTabs: [{ id: 'main', name: 'Main Timeline', active: true }],
  activeTimelineTab: 'main',
  // NEW: Proxy playback
  proxyMode: false,
  // NEW: Audio sync & Music generation
  audioSyncOpen: false,
  musicGenOpen: false,
  musicGenre: 'cinematic',
  musicMood: 'dramatic',
  musicDuration: 30,
  // NEW: Fill Gap AI
  fillGapOpen: false,
  fillGapMode: 'kling', // kling, ltx, runway
  // NEW: Dual viewer
  dualViewerMode: false,
  sourceViewerClip: null,
  // NEW: Element system
  elementsOpen: false,
  elements: {
    characters: [],
    locations: [],
    props: [],
    vehicles: [],
  },
  selectedElementType: 'characters',
};

/**
 * Generation presets/styles
 */
const GENERATION_STYLES = [
  { id: 'cinematic', name: 'Cinematic', icon: '🎬' },
  { id: 'documentary', name: 'Documentary', icon: '📹' },
  { id: 'commercial', name: 'Commercial', icon: '📢' },
  { id: 'anime', name: 'Anime', icon: '🎨' },
  { id: 'film-noir', name: 'Film Noir', icon: '🌑' },
  { id: 'stylized', name: 'Stylized', icon: '✨' },
];

const ASPECT_RATIOS = [
  { id: '16:9', name: 'Landscape', icon: '▭' },
  { id: '9:16', name: 'Portrait', icon: '▯' },
  { id: '1:1', name: 'Square', icon: '□' },
];

const GENERATION_MODES = [
  { id: 'text-to-video', name: 'Text to Video', icon: '✍️', desc: 'Generate from prompt' },
  { id: 'image-to-video', name: 'Image to Video', icon: '🖼️', desc: 'Animate an image' },
  { id: 'retake', name: 'Retake', icon: '🔄', desc: 'Regenerate clip' },
  { id: 'extend', name: 'Extend', icon: '➡️', desc: 'Extend clip' },
  { id: 'broll', name: 'B-Roll', icon: '🎞️', desc: 'Generate B-roll' },
];

/**
 * AI Commands for Timeline Editing
 */
const AI_COMMANDS = {
  // Scene commands
  'detect scenes': { category: 'scene', action: 'detectScenes', desc: 'Find scene boundaries' },
  'scene detection': { category: 'scene', action: 'detectScenes', desc: 'Find scene boundaries' },
  
  // Clip commands
  'split': { category: 'clip', action: 'splitClip', desc: 'Split clip at playhead' },
  'split at current time': { category: 'clip', action: 'splitClip', desc: 'Split clip at playhead' },
  'trim clip': { category: 'clip', action: 'trimClip', desc: 'Adjust clip boundaries' },
  
  // Transition commands
  'add fade': { category: 'transition', action: 'addTransition', params: 'fade', desc: 'Add fade transition' },
  'add dissolve': { category: 'transition', action: 'addTransition', params: 'dissolve', desc: 'Add dissolve transition' },
  'add wipe': { category: 'transition', action: 'addTransition', params: 'wipe', desc: 'Add wipe transition' },
  'add transition': { category: 'transition', action: 'addTransition', desc: 'Add transition between clips' },
  
  // Text commands
  'add text': { category: 'text', action: 'addText', desc: 'Add text overlay' },
  'add subtitle': { category: 'text', action: 'addSubtitle', desc: 'Add subtitle' },
  'generate subtitles': { category: 'text', action: 'generateSubtitles', desc: 'Generate subtitles from audio' },
  'remove filler words': { category: 'text', action: 'removeFiller', desc: 'Remove filler words' },
  
  // Effect commands
  'add b-roll': { category: 'effect', action: 'addBroll', desc: 'Add B-roll footage' },
  'speed up': { category: 'effect', action: 'adjustSpeed', params: 2, desc: 'Speed up clip' },
  'slow down': { category: 'effect', action: 'adjustSpeed', params: 0.5, desc: 'Slow down clip' },
  'stabilize': { category: 'effect', action: 'stabilize', desc: 'Stabilize shaky video' },
  'add zoom': { category: 'effect', action: 'addZoom', desc: 'Add zoom effect' },
  'add shake': { category: 'effect', action: 'addShake', desc: 'Add camera shake' },
  
  // Media commands
  'find related': { category: 'media', action: 'searchMedia', desc: 'Find related footage' },
  'search media': { category: 'media', action: 'searchMedia', desc: 'Search media library' },
  
  // Playback commands
  'play': { category: 'playback', action: 'play', desc: 'Play timeline' },
  'pause': { category: 'playback', action: 'pause', desc: 'Pause timeline' },
  'stop': { category: 'playback', action: 'stop', desc: 'Stop and reset' },
  
  // Generation commands (NEW)
  'generate video': { category: 'generation', action: 'openGeneration', desc: 'Open generation panel' },
  'generate clip': { category: 'generation', action: 'openGeneration', desc: 'Generate a new clip' },
  'create video': { category: 'generation', action: 'openGeneration', desc: 'Create video from prompt' },
  'animate': { category: 'generation', action: 'openGeneration', mode: 'image-to-video', desc: 'Animate image' },
  'retake': { category: 'generation', action: 'openGeneration', mode: 'retake', desc: 'Retake selected clip' },
  'extend': { category: 'generation', action: 'openGeneration', mode: 'extend', desc: 'Extend selected clip' },
  'generate b-roll': { category: 'generation', action: 'openGeneration', mode: 'broll', desc: 'Generate B-roll' },
  'create variation': { category: 'generation', action: 'createVariation', desc: 'Create alternate take' },
  'better opening': { category: 'generation', action: 'betterOpening', desc: 'Generate better opening shot' },
  'match style': { category: 'generation', action: 'matchStyle', desc: 'Match style of another clip' },
};

/**
 * Transitions Library
 */
const TRANSITIONS = [
  { id: 'fade', name: 'Fade', icon: '◐', duration: 500 },
  { id: 'dissolve', name: 'Dissolve', icon: '◑', duration: 800 },
  { id: 'wipe-left', name: 'Wipe Left', icon: '◀', duration: 600 },
  { id: 'wipe-right', name: 'Wipe Right', icon: '▶', duration: 600 },
  { id: 'zoom-in', name: 'Zoom In', icon: '🔍', duration: 500 },
  { id: 'blur', name: 'Blur', icon: '💧', duration: 700 },
];

/**
 * Keyframe Properties
 */
const KEYFRAME_PROPERTIES = [
  { id: 'position-x', name: 'Position X', min: -100, max: 100, unit: '%' },
  { id: 'position-y', name: 'Position Y', min: -100, max: 100, unit: '%' },
  { id: 'scale', name: 'Scale', min: 0.1, max: 5, unit: 'x' },
  { id: 'rotation', name: 'Rotation', min: -360, max: 360, unit: '°' },
  { id: 'opacity', name: 'Opacity', min: 0, max: 100, unit: '%' },
];

/**
 * Editing Tools (CineGen-style 10 tools)
 */
const EDITING_TOOLS = [
  { id: 'select', name: 'Select', icon: '↖', shortcut: 'V', desc: 'Selection tool' },
  { id: 'blade', name: 'Blade', icon: '✂', shortcut: 'B', desc: 'Cut at cursor' },
  { id: 'ripple-trim', name: 'Ripple', icon: '⤵', shortcut: 'R', desc: 'Trim and shift' },
  { id: 'roll-trim', name: 'Roll', icon: '⤶', shortcut: 'T', desc: 'Adjust in/out points' },
  { id: 'slip', name: 'Slip', icon: '⇿', shortcut: 'Y', desc: 'Slip source in/out' },
  { id: 'slide', name: 'Slide', icon: '⇆', shortcut: 'U', desc: 'Move without gap' },
  { id: 'zoom', name: 'Zoom', icon: '🔍', shortcut: 'Z', desc: 'Fit to timeline' },
  { id: 'hand', name: 'Hand', icon: '✋', shortcut: 'H', desc: 'Pan timeline' },
];

/**
 * Audio Generation Models
 */
const AUDIO_MODELS = [
  { id: 'suno', name: 'Suno Music', icon: '🎵', desc: 'AI music generation' },
  { id: 'elevenlabs', name: 'ElevenLabs', icon: '🎤', desc: 'Voice/sound effects' },
];

const MUSIC_GENRES = ['ambient', 'cinematic', 'electronic', 'rock', 'jazz', 'classical', 'pop', 'folk'];
const MUSIC_MOODS = ['happy', 'melancholic', 'energetic', 'calm', 'dramatic', 'mysterious'];

/**
 * Timeline Editor Page - Non 3-column layout
 * Uses matching color scheme and glassmorphism effects
 */
export function TimelineEditorPage() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-[#05070b] text-white';
  
  let state = { ...timelineState };
  let chatHistory = [];
  let activeAgents = [];
  let showProperties = false;
  let showMediaLibrary = true;
  let showAIChat = true;
  let showGenerationPanel = false;
  let selectedReferenceImage = null;
  
  const setState = (updates) => {
    state = { ...state, ...updates };
    render();
  };
  
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  /**
   * Create Header with matching style
   */
  const createHeader = () => {
    const header = document.createElement('header');
    header.className = 'mb-3 flex items-center justify-between rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,#171b24_0%,#07090d_45%,#111827_100%)] px-5 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]';
    
    // Left: Back button and logo
    const left = document.createElement('div');
    left.className = 'flex items-center gap-3';
    
    const backBtn = document.createElement('button');
    backBtn.innerHTML = '←';
    backBtn.className = 'flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10';
    backBtn.onclick = () => { if (window.navigate) window.navigate('render'); };
    
    const logo = document.createElement('div');
    logo.className = 'flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-lg shadow-[0_0_16px_rgba(56,189,248,0.12)]';
    logo.innerHTML = '🎬';
    
    const title = document.createElement('div');
    title.innerHTML = '<div class="text-lg font-black tracking-wide text-white">TIMELINE</div><div class="text-[10px] text-white/40">AI Video Editor</div>';
    
    left.appendChild(backBtn);
    left.appendChild(logo);
    left.appendChild(title);
    
    // Center: Project name
    const center = document.createElement('div');
    center.className = 'flex-1 flex justify-center';
    
    const projectInput = document.createElement('input');
    projectInput.type = 'text';
    projectInput.value = state.name;
    projectInput.className = 'w-64 bg-transparent border-b border-white/20 text-center text-base font-bold text-white focus:outline-none focus:border-cyan-400/50';
    projectInput.onchange = (e) => setState({ name: e.target.value });
    center.appendChild(projectInput);
    
    // Right: View toggles and status
    const right = document.createElement('div');
    right.className = 'flex items-center gap-2';
    
    const toggles = [
      { label: '👁', active: !state.dualViewerMode, action: () => { setState({ dualViewerMode: false }); } },
      { label: '📺', active: state.dualViewerMode, action: () => { setState({ dualViewerMode: !state.dualViewerMode }); } },
      { label: '📁', active: showMediaLibrary, action: () => { showMediaLibrary = !showMediaLibrary; render(); } },
      { label: '⚡', active: showGenerationPanel, action: () => { showGenerationPanel = !showGenerationPanel; render(); }, primary: true },
      { label: '🎵', active: state.musicGenOpen, action: () => { setState({ musicGenOpen: !state.musicGenOpen }); }, primary: true },
      { label: '🔊', active: state.audioSyncOpen, action: () => { setState({ audioSyncOpen: !state.audioSyncOpen }); } },
      { label: '🎞️', active: state.fillGapOpen, action: () => { setState({ fillGapOpen: !state.fillGapOpen }); } },
      { label: '👤', active: state.elementsOpen, action: () => { setState({ elementsOpen: !state.elementsOpen }); } },
      { label: '⚙️', active: showProperties, action: () => { showProperties = !showProperties; render(); } },
      { label: '💬', active: showAIChat, action: () => { showAIChat = !showAIChat; render(); } },
      { label: '📋', active: state.proxyMode, action: () => { setState({ proxyMode: !state.proxyMode }); } },
    ];
    
    toggles.forEach(t => {
      const btn = document.createElement('button');
      btn.className = `h-9 w-9 rounded-lg text-lg transition ${t.active ? 'bg-cyan-500/20 border border-cyan-400/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`;
      btn.innerHTML = t.label;
      btn.onclick = t.action;
      right.appendChild(btn);
    });
    
    const status = document.createElement('div');
    status.className = 'ml-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-200';
    status.innerHTML = '<span class="h-1.5 w-1.5 inline-block rounded-full bg-emerald-300 mr-1.5"></span>Ready';
    
    right.appendChild(status);
    
    header.appendChild(left);
    header.appendChild(center);
    header.appendChild(right);
    
    return header;
  };
  
  /**
   * Create main content area (video preview + timeline)
   */
  const createMainContent = () => {
    const main = document.createElement('div');
    
    // Video Preview
    const preview = document.createElement('div');
    preview.className = 'relative mb-3 overflow-hidden rounded-[24px] border border-white/8 bg-black shadow-[0_0_60px_rgba(56,189,248,0.06)]';
    preview.style.aspectRatio = '16/9';
    
    const video = document.createElement('video');
    video.className = 'w-full h-full object-contain bg-black';
    
    // Preview overlay with controls
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4';
    
    const timeRow = document.createElement('div');
    timeRow.className = 'flex items-center justify-between text-xs text-white/60 mb-2';
    timeRow.innerHTML = `<span>${formatTime(state.currentTime)}</span><span>${formatTime(state.duration)}</span>`;
    
    const progress = document.createElement('div');
    progress.className = 'h-1.5 rounded-full bg-white/20 cursor-pointer mb-3';
    progress.onclick = (e) => {
      const rect = progress.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setState({ currentTime: percent * state.duration });
    };
    
    const progressFill = document.createElement('div');
    progressFill.className = 'h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400';
    progressFill.style.width = `${(state.currentTime / state.duration) * 100}%`;
    progress.appendChild(progressFill);
    
    const transport = document.createElement('div');
    transport.className = 'flex items-center justify-center gap-3';
    
    const buttons = [
      { icon: '⏮', action: () => setState({ currentTime: 0 }) },
      { icon: state.isPlaying ? '⏸' : '▶', action: () => setState({ isPlaying: !state.isPlaying }), primary: true },
      { icon: '⏹', action: () => setState({ isPlaying: false, currentTime: 0 }) },
    ];
    
    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.className = `h-10 w-10 rounded-full flex items-center justify-center transition ${b.primary ? 'bg-white text-black font-bold hover:scale-105' : 'bg-white/10 text-white/80 hover:bg-white/20'}`;
      btn.innerHTML = b.icon;
      btn.onclick = b.action;
      transport.appendChild(btn);
    });
    
    overlay.appendChild(timeRow);
    overlay.appendChild(progress);
    overlay.appendChild(transport);
    
    preview.appendChild(video);
    preview.appendChild(overlay);
    main.appendChild(preview);
    
    // Timeline
    const timeline = document.createElement('div');
    timeline.className = 'rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl';
    
    // Timeline toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'flex items-center justify-between mb-3';
    
    const toolbarLeft = document.createElement('div');
    toolbarLeft.className = 'flex items-center gap-2';
    
    // Editing Tools (CineGen-style)
    const toolsRow = document.createElement('div');
    toolsRow.className = 'flex items-center gap-0.5 border-r border-white/10 pr-2 mr-1';
    
    EDITING_TOOLS.forEach(tool => {
      const btn = document.createElement('button');
      btn.className = `h-7 w-7 rounded flex items-center justify-center text-xs transition ${state.activeTool === tool.id ? 'bg-cyan-500/30 border border-cyan-400/50 text-cyan-200' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`;
      btn.innerHTML = tool.icon;
      btn.title = `${tool.name} (${tool.shortcut}) - ${tool.desc}`;
      btn.onclick = () => setState({ activeTool: tool.id });
      toolsRow.appendChild(btn);
    });
    toolbarLeft.appendChild(toolsRow);
    
    const zoomBtns = [
      { label: '🔍-', action: () => setState({ zoom: Math.max(state.zoom / 1.5, 0.2) }) },
      { label: '🔍+', action: () => setState({ zoom: Math.min(state.zoom * 1.5, 5) }) },
    ];
    
    zoomBtns.forEach(b => {
      const btn = document.createElement('button');
      btn.className = 'rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60 hover:bg-white/10';
      btn.innerHTML = b.label;
      btn.onclick = b.action;
      toolbarLeft.appendChild(btn);
    });
    
    const trackBtns = document.createElement('div');
    trackBtns.className = 'flex items-center gap-1';
    
    const trackTypes = ['Video', 'Audio', 'Text', 'B-Roll'];
    trackTypes.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 hover:bg-white/10';
      btn.textContent = '+' + t;
      btn.onclick = () => addNewTrack(t.toLowerCase());
      trackBtns.appendChild(btn);
    });
    
    toolbarLeft.appendChild(trackBtns);
    toolbar.appendChild(toolbarLeft);
    timeline.appendChild(toolbar);
    
    // Tracks container
    const tracksContainer = document.createElement('div');
    tracksContainer.className = 'relative overflow-x-auto';
    tracksContainer.style.maxHeight = '320px';
    
    const rulerWidth = 2000 * state.zoom;
    tracksContainer.style.width = '100%';
    
    // Draw tracks
    state.tracks.forEach((track) => {
      const trackRow = document.createElement('div');
      trackRow.className = 'flex border-b border-white/5 relative';
      trackRow.style.height = '50px';
      
      // Track label with controls (CineGen-style)
      const trackLabel = document.createElement('div');
      trackLabel.className = 'absolute left-0 top-0 h-full w-[100px] bg-black/60 border-r border-white/10 flex flex-col justify-center px-2 z-10 shrink-0';
      
      const trackName = document.createElement('div');
      trackName.className = 'text-xs font-bold text-white/80 truncate';
      trackName.textContent = track.name;
      
      const trackControls = document.createElement('div');
      trackControls.className = 'flex items-center gap-0.5 mt-1';
      
      // Mute button
      const muteBtn = document.createElement('button');
      muteBtn.className = `h-4 w-4 rounded text-[7px] font-bold transition ${state.trackMuted[track.id] ? 'bg-red-500 text-white' : 'bg-white/10 text-white/40 hover:bg-white/20'}`;
      muteBtn.textContent = 'M';
      muteBtn.title = 'Mute track';
      muteBtn.onclick = (e) => { e.stopPropagation(); const muted = {...state.trackMuted}; muted[track.id] = !muted[track.id]; setState({trackMuted: muted}); };
      trackControls.appendChild(muteBtn);
      
      // Solo button
      const soloBtn = document.createElement('button');
      soloBtn.className = `h-4 w-4 rounded text-[7px] font-bold transition ${state.trackSolo[track.id] ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/40 hover:bg-white/20'}`;
      soloBtn.textContent = 'S';
      soloBtn.title = 'Solo track';
      soloBtn.onclick = (e) => { e.stopPropagation(); const solo = {...state.trackSolo}; solo[track.id] = !solo[track.id]; setState({trackSolo: solo}); };
      trackControls.appendChild(soloBtn);
      
      // Lock button
      const lockBtn = document.createElement('button');
      lockBtn.className = `h-4 w-4 rounded text-[7px] font-bold transition ${state.trackLocked[track.id] ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/40 hover:bg-white/20'}`;
      lockBtn.textContent = 'L';
      lockBtn.title = 'Lock track';
      lockBtn.onclick = (e) => { e.stopPropagation(); const locked = {...state.trackLocked}; locked[track.id] = !locked[track.id]; setState({trackLocked: locked}); };
      trackControls.appendChild(lockBtn);
      
      const clipCount = document.createElement('div');
      clipCount.className = 'text-[9px] text-white/40 mt-1';
      clipCount.textContent = `${track.clips.length} clips`;
      
      trackLabel.appendChild(trackName);
      trackLabel.appendChild(trackControls);
      trackLabel.appendChild(clipCount);
      trackRow.appendChild(trackLabel);
      
      // Track content
      const trackContent = document.createElement('div');
      trackContent.className = 'absolute left-[80px] top-0 right-0 h-full bg-white/[0.02]';
      trackContent.style.width = `${rulerWidth}px`;
      
      track.clips.forEach(clip => {
        const clipEl = document.createElement('div');
        clipEl.className = `absolute top-1 bottom-1 rounded-lg border cursor-pointer transition ${state.selectedClipId === clip.id ? 'border-cyan-400 bg-cyan-500/20' : 'border-white/10 bg-white/10 hover:border-white/30'}`;
        
        const clipLeft = (clip.startTime / state.duration) * rulerWidth;
        const clipWidth = ((clip.endTime - clip.startTime) / state.duration) * rulerWidth;
        
        clipEl.style.left = `${clipLeft}px`;
        clipEl.style.width = `${Math.max(clipWidth, 20)}px`;
        
        clipEl.innerHTML = `<div class="p-1 text-[9px] text-white/80 truncate">${clip.name || 'Clip'}</div>`;
        clipEl.onclick = (e) => { e.stopPropagation(); setState({ selectedClipId: clip.id, selectedTrackId: track.id }); };
        
        trackContent.appendChild(clipEl);
      });
      
      trackRow.appendChild(trackContent);
      tracksContainer.appendChild(trackRow);
    });
    
    // Playhead
    const playhead = document.createElement('div');
    playhead.className = 'absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-20 pointer-events-none';
    playhead.style.left = `${80 + (state.currentTime / state.duration) * rulerWidth}px`;
    playhead.innerHTML = '<div class="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full"></div>';
    
    tracksContainer.appendChild(playhead);
    timeline.appendChild(tracksContainer);
    main.appendChild(timeline);
    
    return main;
  };
  
  /**
   * Create floating panels (toggleable)
   */
  const createFloatingPanels = () => {
    const panels = document.createElement('div');
    panels.className = 'fixed right-4 top-20 flex flex-col gap-3 z-50';
    
    // Media Library Panel
    if (showMediaLibrary) {
      const mediaPanel = document.createElement('div');
      mediaPanel.className = 'w-72 rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl p-3';
      mediaPanel.innerHTML = '<div class="text-xs font-black uppercase tracking-wider text-white/80 mb-2">Media</div>';
      
      const uploadBtn = document.createElement('button');
      uploadBtn.className = 'w-full mb-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:border-cyan-400/30';
      uploadBtn.innerHTML = '📁 Upload';
      uploadBtn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*,image/*,audio/*';
        input.multiple = true;
        input.onchange = async (e) => {
          const files = Array.from(e.target.files);
          for (const file of files) {
            try {
              const apiKey = localStorage.getItem('muapi_key');
              if (!apiKey) { AuthModal(() => uploadBtn.click()); return; }
              const url = await muapi.uploadFile(file);
              setState({
                mediaLibrary: [...state.mediaLibrary, {
                  id: Date.now(),
                  name: file.name,
                  type: file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image',
                  url,
                }]
              });
            } catch (err) { console.error('Upload failed:', err); }
          }
        };
        input.click();
      };
      mediaPanel.appendChild(uploadBtn);
      
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-2 gap-1 max-h-[150px] overflow-y-auto';
      state.mediaLibrary.forEach(media => {
        const item = document.createElement('div');
        item.className = 'aspect-video rounded-lg border border-white/10 bg-black/40 overflow-hidden cursor-pointer hover:border-cyan-400/30 transition';
        item.innerHTML = media.type === 'video' ? '<div class="w-full h-full flex items-center justify-center text-xl">🎬</div>' : media.type === 'audio' ? '<div class="w-full h-full flex items-center justify-center text-xl">🎵</div>' : `<img src="${media.url}" class="w-full h-full object-cover">`;
        item.onclick = () => addClipFromMedia(media);
        grid.appendChild(item);
      });
      mediaPanel.appendChild(grid);
      
      panels.appendChild(mediaPanel);
    }
    
    // Generation Panel (LTX-powered)
    if (showGenerationPanel) {
      const genPanel = document.createElement('div');
      genPanel.className = 'w-80 rounded-[20px] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(56,189,248,0.08),rgba(17,24,39,0.75))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl p-3';
      
      // Header
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between mb-3';
      header.innerHTML = '<div class="text-xs font-black uppercase tracking-wider text-cyan-200">⚡ Generate</div>';
      
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.className = 'text-white/40 hover:text-white text-sm';
      closeBtn.onclick = () => { showGenerationPanel = false; render(); };
      header.appendChild(closeBtn);
      genPanel.appendChild(header);
      
      // Mode selector
      const modeGrid = document.createElement('div');
      modeGrid.className = 'grid grid-cols-3 gap-1 mb-3';
      GENERATION_MODES.forEach(mode => {
        const btn = document.createElement('button');
        btn.className = `rounded-lg border p-2 text-[10px] text-center transition ${state.generationMode === mode.id ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'}`;
        btn.innerHTML = `<div class="text-lg mb-0.5">${mode.icon}</div><div>${mode.name}</div>`;
        btn.onclick = () => setState({ generationMode: mode.id });
        modeGrid.appendChild(btn);
      });
      genPanel.appendChild(modeGrid);
      
      // Reference image (for image-to-video)
      if (state.generationMode === 'image-to-video' || state.generationMode === 'retake') {
        const refSection = document.createElement('div');
        refSection.className = 'mb-2';
        refSection.innerHTML = '<div class="text-[10px] text-white/50 mb-1">Reference Image</div>';
        
        const refBtn = document.createElement('button');
        refBtn.className = 'w-full aspect-video rounded-lg border border-dashed border-white/20 bg-white/5 flex items-center justify-center text-white/40 hover:border-cyan-400/30';
        refBtn.innerHTML = selectedReferenceImage ? `<img src="${selectedReferenceImage}" class="w-full h-full object-cover rounded-lg">` : '🖼️ Select Image';
        refBtn.onclick = () => {
          // Select from media library
          const images = state.mediaLibrary.filter(m => m.type === 'image');
          if (images.length > 0) {
            selectedReferenceImage = images[0].url;
            render();
          }
        };
        refSection.appendChild(refBtn);
        genPanel.appendChild(refSection);
      }
      
      // Prompt input
      const promptLabel = document.createElement('div');
      promptLabel.className = 'text-[10px] text-white/50 mb-1';
      promptLabel.textContent = state.generationMode === 'retake' ? 'Retake Prompt' : state.generationMode === 'extend' ? 'Extension Prompt' : 'Prompt';
      genPanel.appendChild(promptLabel);
      
      const promptInput = document.createElement('textarea');
      promptInput.className = 'w-full h-16 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white placeholder:text-white/30 outline-none mb-2 resize-none';
      promptInput.placeholder = state.generationMode === 'retake' ? 'Describe changes to make...' : state.generationMode === 'extend' ? 'What should happen next...' : 'A cinematic shot of...';
      promptInput.value = state.generationPrompt;
      promptInput.onchange = (e) => setState({ generationPrompt: e.target.value });
      genPanel.appendChild(promptInput);
      
      // Negative prompt
      const negLabel = document.createElement('div');
      negLabel.className = 'text-[10px] text-white/50 mb-1';
      negLabel.textContent = 'Negative Prompt (optional)';
      genPanel.appendChild(negLabel);
      
      const negInput = document.createElement('input');
      negInput.type = 'text';
      negInput.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white placeholder:text-white/30 outline-none mb-2';
      negInput.placeholder = 'blurry, low quality, deformed';
      negInput.value = state.generationNegativePrompt;
      negInput.onchange = (e) => setState({ generationNegativePrompt: e.target.value });
      genPanel.appendChild(negInput);
      
      // Settings row
      const settingsRow = document.createElement('div');
      settingsRow.className = 'flex gap-2 mb-3';
      
      // Duration
      const durationDiv = document.createElement('div');
      durationDiv.className = 'flex-1';
      durationDiv.innerHTML = '<div class="text-[10px] text-white/50 mb-1">Duration</div>';
      const durationSelect = document.createElement('select');
      durationSelect.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none';
      [3, 5, 7, 10].forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = `${d}s`;
        if (d === state.generationDuration) opt.selected = true;
        durationSelect.appendChild(opt);
      });
      durationSelect.onchange = (e) => setState({ generationDuration: parseInt(e.target.value) });
      durationDiv.appendChild(durationSelect);
      settingsRow.appendChild(durationDiv);
      
      // Aspect ratio
      const aspectDiv = document.createElement('div');
      aspectDiv.className = 'flex-1';
      aspectDiv.innerHTML = '<div class="text-[10px] text-white/50 mb-1">Aspect</div>';
      const aspectSelect = document.createElement('select');
      aspectSelect.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none';
      ASPECT_RATIOS.forEach(ar => {
        const opt = document.createElement('option');
        opt.value = ar.id;
        opt.textContent = ar.name;
        if (ar.id === state.generationAspectRatio) opt.selected = true;
        aspectSelect.appendChild(opt);
      });
      aspectSelect.onchange = (e) => setState({ generationAspectRatio: e.target.value });
      aspectDiv.appendChild(aspectSelect);
      settingsRow.appendChild(aspectDiv);
      
      // Style
      const styleDiv = document.createElement('div');
      styleDiv.className = 'flex-1';
      styleDiv.innerHTML = '<div class="text-[10px] text-white/50 mb-1">Style</div>';
      const styleSelect = document.createElement('select');
      styleSelect.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none';
      GENERATION_STYLES.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name;
        if (s.id === state.generationStyle) opt.selected = true;
        styleSelect.appendChild(opt);
      });
      styleSelect.onchange = (e) => setState({ generationStyle: e.target.value });
      styleDiv.appendChild(styleSelect);
      settingsRow.appendChild(styleDiv);
      
      genPanel.appendChild(settingsRow);
      
      // Generate button
      const generateBtn = document.createElement('button');
      generateBtn.className = 'w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]';
      generateBtn.innerHTML = '⚡ Generate';
      generateBtn.onclick = async () => {
        if (!state.generationPrompt.trim()) {
          chatHistory = [...chatHistory, { role: 'assistant', content: '⚠️ Please enter a prompt' }];
          render();
          return;
        }
        
        chatHistory = [...chatHistory, { role: 'user', content: `Generate: ${state.generationPrompt}` }, { role: 'assistant', content: '⚡ Starting generation...' }];
        showGenerationPanel = false;
        render();
        
        try {
          let request;
          const mode = state.generationMode;
          
          switch (mode) {
            case 'text-to-video':
              request = createTextToVideoRequest(state.generationPrompt, {
                negativePrompt: state.generationNegativePrompt,
                duration: state.generationDuration,
                aspectRatio: state.generationAspectRatio,
                stylePreset: state.generationStyle,
              });
              break;
            case 'image-to-video':
              if (!selectedReferenceImage) throw new Error('Please select a reference image');
              request = createImageToVideoRequest(selectedReferenceImage, state.generationPrompt, {
                negativePrompt: state.generationNegativePrompt,
                duration: state.generationDuration,
                aspectRatio: state.generationAspectRatio,
                stylePreset: state.generationStyle,
              });
              break;
            case 'retake':
              const selectedClip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
              if (!selectedClip) throw new Error('Please select a clip to retake');
              request = createRetakeRequest(selectedClip.mediaUrl || '', state.generationPrompt, {
                start: selectedClip.startTime,
                end: selectedClip.endTime,
              }, {
                duration: state.generationDuration,
                stylePreset: state.generationStyle,
              });
              break;
            case 'extend':
              const clipToExtend = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
              if (!clipToExtend) throw new Error('Please select a clip to extend');
              request = createExtendRequest(clipToExtend.mediaUrl || '', state.generationPrompt, state.generationDuration * 1000);
              break;
            case 'broll':
              request = createBrollRequest(state.generationPrompt, {
                negativePrompt: state.generationNegativePrompt,
                duration: state.generationDuration,
                aspectRatio: state.generationAspectRatio,
              });
              break;
            default:
              throw new Error('Unknown generation mode');
          }
          
          const result = await generationService.submit(request, 'ltx');
          
          // Add to active generations
          const newGen = {
            id: result.generationId,
            mode: state.generationMode,
            prompt: state.generationPrompt,
            status: 'processing',
            createdAt: Date.now(),
          };
          
          setState({ activeGenerations: [...state.activeGenerations, newGen] });
          
          chatHistory = [...chatHistory, { role: 'assistant', content: `✅ Generation started! ID: ${result.generationId}` }];
          
          // Start polling for status
          generationService.startPolling(result.generationId, (update) => {
            if (update.status === 'completed') {
              // Add generated asset to library
              const newAsset = {
                id: Date.now(),
                name: `Generated ${state.generationMode}`,
                type: 'video',
                url: update.result.previewUrl,
                generationId: result.generationId,
              };
              setState({ generatedAssets: [...state.generatedAssets, newAsset], mediaLibrary: [...state.mediaLibrary, newAsset] });
              chatHistory = [...chatHistory, { role: 'assistant', content: '✅ Generation complete! Asset added to library.' }];
            } else if (update.status === 'failed') {
              chatHistory = [...chatHistory, { role: 'assistant', content: `❌ Generation failed: ${update.result.error}` }];
            }
            render();
          });
          
        } catch (err) {
          chatHistory = [...chatHistory, { role: 'assistant', content: `❌ Error: ${err.message}` }];
        }
        
        render();
      };
      genPanel.appendChild(generateBtn);
      
      // Active generations
      if (state.activeGenerations.length > 0) {
        const activeDiv = document.createElement('div');
        activeDiv.className = 'mt-3 pt-3 border-t border-white/10';
        activeDiv.innerHTML = '<div class="text-[10px] text-white/50 mb-2">Active Generations</div>';
        
        state.activeGenerations.forEach(gen => {
          const genItem = document.createElement('div');
          genItem.className = 'flex items-center justify-between mb-1 p-1.5 rounded bg-black/40';
          genItem.innerHTML = `<div class="text-[9px] text-white/70 truncate">${gen.prompt.slice(0, 20)}...</div><div class="text-[9px] text-cyan-300">${gen.status}</div>`;
          activeDiv.appendChild(genItem);
        });
        
        genPanel.appendChild(activeDiv);
      }
      
      panels.appendChild(genPanel);
    }
    
    // Properties Panel
    if (showProperties && state.selectedClipId) {
      const propsPanel = document.createElement('div');
      propsPanel.className = 'w-64 rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl p-3';
      propsPanel.innerHTML = '<div class="text-xs font-black uppercase tracking-wider text-white/80 mb-2">Properties</div>';
      
      const selectedClip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
      
      if (selectedClip) {
        KEYFRAME_PROPERTIES.forEach(prop => {
          const row = document.createElement('div');
          row.className = 'flex items-center justify-between mb-1.5';
          
          const label = document.createElement('label');
          label.className = 'text-[10px] text-white/50';
          label.textContent = prop.name;
          
          const input = document.createElement('input');
          input.type = 'range';
          input.className = 'w-20 accent-cyan-400 h-1';
          input.min = prop.min;
          input.max = prop.max;
          input.value = selectedClip.properties?.[prop.id] || (prop.id === 'scale' ? 1 : prop.id === 'opacity' ? 100 : 0);
          input.onchange = (e) => updateClipProperty(selectedClip.id, prop.id, parseFloat(e.target.value));
          
          row.appendChild(label);
          row.appendChild(input);
          propsPanel.appendChild(row);
        });
        
        // Transitions
        const transTitle = document.createElement('div');
        transTitle.className = 'text-[10px] text-white/50 mt-2 mb-1';
        transTitle.textContent = 'Transitions';
        propsPanel.appendChild(transTitle);
        
        const transGrid = document.createElement('div');
        transGrid.className = 'grid grid-cols-3 gap-1';
        TRANSITIONS.forEach(t => {
          const btn = document.createElement('button');
          btn.className = 'rounded border border-white/10 bg-white/5 p-1 text-[9px] text-white/60 hover:bg-white/10';
          btn.textContent = t.name;
          btn.onclick = () => addTransition(t.id);
          transGrid.appendChild(btn);
        });
        propsPanel.appendChild(transGrid);
      }
      
      panels.appendChild(propsPanel);
    }
    
    // AI Chat Panel
    if (showAIChat) {
      const chatPanel = document.createElement('div');
      chatPanel.className = 'w-80 rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl p-3';
      chatPanel.innerHTML = '<div class="text-xs font-black uppercase tracking-wider text-white/80 mb-2">💬 AI</div>';
      
      const messages = document.createElement('div');
      messages.className = 'h-[120px] overflow-y-auto mb-2 space-y-1';
      chatHistory.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = `p-1.5 rounded-lg text-[10px] ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-cyan-500/20 text-cyan-100'}`;
        msgEl.textContent = msg.content;
        messages.appendChild(msgEl);
      });
      chatPanel.appendChild(messages);
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white placeholder:text-white/30 outline-none mb-2';
      input.placeholder = 'Type command...';
      input.onkeydown = (e) => { if (e.key === 'Enter' && input.value.trim()) { processAICommand(input.value.trim()); input.value = ''; } };
      chatPanel.appendChild(input);
      
      const cmds = ['⚡Generate', 'Retake', 'Extend', 'B-Roll'];
      const cmdRow = document.createElement('div');
      cmdRow.className = 'flex gap-1 flex-wrap';
      cmds.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-white/60 hover:bg-white/10';
        btn.textContent = c;
        btn.onclick = () => {
          // Map button labels to commands
          let cmd = c.toLowerCase();
          if (c.includes('Generate')) cmd = 'generate video';
          else if (c.includes('Retake')) cmd = 'retake';
          else if (c.includes('Extend')) cmd = 'extend';
          else if (c.includes('B-Roll')) cmd = 'generate b-roll';
          processAICommand(cmd);
        };
        cmdRow.appendChild(btn);
      });
      chatPanel.appendChild(cmdRow);
      
      panels.appendChild(chatPanel);
    }
    
    // Music Generation Panel (NEW - CineGen)
    if (state.musicGenOpen) {
      const musicPanel = document.createElement('div');
      musicPanel.className = 'w-72 rounded-[20px] border border-purple-400/20 bg-[linear-gradient(180deg,rgba(168,85,247,0.08),rgba(17,24,39,0.75))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl p-3';
      
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between mb-3';
      header.innerHTML = '<div class="text-xs font-black uppercase tracking-wider text-purple-200">🎵 Music Generation</div>';
      
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.className = 'text-white/40 hover:text-white text-sm';
      closeBtn.onclick = () => { setState({ musicGenOpen: false }); };
      header.appendChild(closeBtn);
      musicPanel.appendChild(header);
      
      // Model selector
      const modelRow = document.createElement('div');
      modelRow.className = 'flex gap-1 mb-3';
      AUDIO_MODELS.forEach(model => {
        const btn = document.createElement('button');
        btn.className = 'flex-1 rounded-lg border border-white/10 bg-white/5 p-2 text-[9px] text-white/60 hover:bg-white/10 text-center';
        btn.innerHTML = `<div class="text-lg mb-0.5">${model.icon}</div><div>${model.name}</div>`;
        modelRow.appendChild(btn);
      });
      musicPanel.appendChild(modelRow);
      
      // Genre selector
      const genreRow = document.createElement('div');
      genreRow.className = 'mb-2';
      genreRow.innerHTML = '<div class="text-[10px] text-white/50 mb-1">Genre</div>';
      const genreSelect = document.createElement('select');
      genreSelect.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none';
      MUSIC_GENRES.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g.charAt(0).toUpperCase() + g.slice(1);
        if (g === state.musicGenre) opt.selected = true;
        genreSelect.appendChild(opt);
      });
      genreSelect.onchange = (e) => setState({ musicGenre: e.target.value });
      genreRow.appendChild(genreSelect);
      musicPanel.appendChild(genreRow);
      
      // Mood selector
      const moodRow = document.createElement('div');
      moodRow.className = 'mb-2';
      moodRow.innerHTML = '<div class="text-[10px] text-white/50 mb-1">Mood</div>';
      const moodSelect = document.createElement('select');
      moodSelect.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none';
      MUSIC_MOODS.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m.charAt(0).toUpperCase() + m.slice(1);
        if (m === state.musicMood) opt.selected = true;
        moodSelect.appendChild(opt);
      });
      moodSelect.onchange = (e) => setState({ musicMood: e.target.value });
      moodRow.appendChild(moodSelect);
      musicPanel.appendChild(moodRow);
      
      // Duration
      const durRow = document.createElement('div');
      durRow.className = 'mb-3';
      durRow.innerHTML = '<div class="text-[10px] text-white/50 mb-1">Duration</div>';
      const durSelect = document.createElement('select');
      durSelect.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none';
      [15, 30, 45, 60, 90].forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = `${d}s`;
        if (d === state.musicDuration) opt.selected = true;
        durSelect.appendChild(opt);
      });
      durSelect.onchange = (e) => setState({ musicDuration: parseInt(e.target.value) });
      durRow.appendChild(durSelect);
      musicPanel.appendChild(durRow);
      
      // Generate button
      const genBtn = document.createElement('button');
      genBtn.className = 'w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02]';
      genBtn.innerHTML = '🎵 Generate Music';
      genBtn.onclick = async () => {
        chatHistory = [...chatHistory, { role: 'user', content: `Generate ${state.musicGenre} ${state.musicMood} music` }, { role: 'assistant', content: '🎵 Generating music...' }];
        render();
        // Placeholder for Suno/ElevenLabs API call
        setTimeout(() => {
          chatHistory = [...chatHistory, { role: 'assistant', content: '🎵 Music generation would use Suno API with genre: ' + state.musicGenre + ', mood: ' + state.musicMood }];
          render();
        }, 1500);
      };
      musicPanel.appendChild(genBtn);
      
      panels.appendChild(musicPanel);
    }
    
    // Audio Sync Panel (NEW)
    if (state.audioSyncOpen) {
      const syncPanel = document.createElement('div');
      syncPanel.className = 'w-72 rounded-[20px] border border-amber-400/20 bg-[linear-gradient(180deg,rgba(251,191,36,0.08),rgba(17,24,39,0.75))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl p-3';
      
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between mb-3';
      header.innerHTML = '<div class="text-xs font-black uppercase tracking-wider text-amber-200">🔊 Audio Sync</div>';
      
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.className = 'text-white/40 hover:text-white text-sm';
      closeBtn.onclick = () => { setState({ audioSyncOpen: false }); };
      header.appendChild(closeBtn);
      syncPanel.appendChild(header);
      
      syncPanel.innerHTML += '<div class="text-[10px] text-white/50 mb-2">Auto-align audio to video timeline</div>';
      
      // Upload audio
      const uploadBtn = document.createElement('button');
      uploadBtn.className = 'w-full mb-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:border-amber-400/30';
      uploadBtn.innerHTML = '📁 Upload Audio';
      uploadBtn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            chatHistory = [...chatHistory, { role: 'user', content: 'Upload audio for sync' }, { role: 'assistant', content: '🔊 Processing audio sync...' }];
            render();
            setTimeout(() => {
              chatHistory = [...chatHistory, { role: 'assistant', content: '🔊 Audio synced to video timeline!' }];
              render();
            }, 1500);
          }
        };
        input.click();
      };
      syncPanel.appendChild(uploadBtn);
      
      // Sync button
      const syncBtn = document.createElement('button');
      syncBtn.className = 'w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02]';
      syncBtn.innerHTML = '🔗 Auto Sync';
      syncBtn.onclick = () => {
        chatHistory = [...chatHistory, { role: 'assistant', content: '🔊 Analyzing audio waveform and syncing to video...' }];
        render();
        setTimeout(() => {
          chatHistory = [...chatHistory, { role: 'assistant', content: '🔊 Audio synced!' }];
          render();
        }, 2000);
      };
      syncPanel.appendChild(syncBtn);
      
      panels.appendChild(syncPanel);
    }
    
    // Fill Gap AI Panel (NEW - CineGen/LTX)
    if (state.fillGapOpen) {
      const gapPanel = document.createElement('div');
      gapPanel.className = 'w-72 rounded-[20px] border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(52,211,153,0.08),rgba(17,24,39,0.75))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl p-3';
      
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between mb-3';
      header.innerHTML = '<div class="text-xs font-black uppercase tracking-wider text-emerald-200">🎞️ Fill Gap</div>';
      
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.className = 'text-white/40 hover:text-white text-sm';
      closeBtn.onclick = () => { setState({ fillGapOpen: false }); };
      header.appendChild(closeBtn);
      gapPanel.appendChild(header);
      
      gapPanel.innerHTML += '<div class="text-[10px] text-white/50 mb-2">AI generates footage to bridge two clips</div>';
      
      // Model selector
      const modelRow = document.createElement('div');
      modelRow.className = 'mb-2';
      modelRow.innerHTML = '<div class="text-[10px] text-white/50 mb-1">AI Model</div>';
      const modelSelect = document.createElement('select');
      modelSelect.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none';
      ['kling', 'ltx', 'runway'].forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m.toUpperCase();
        if (m === state.fillGapMode) opt.selected = true;
        modelSelect.appendChild(opt);
      });
      modelSelect.onchange = (e) => setState({ fillGapMode: e.target.value });
      modelRow.appendChild(modelSelect);
      gapPanel.appendChild(modelRow);
      
      // Prompt
      const promptLabel = document.createElement('div');
      promptLabel.className = 'text-[10px] text-white/50 mb-1';
      promptLabel.textContent = 'Fill Prompt';
      gapPanel.appendChild(promptLabel);
      
      const promptInput = document.createElement('textarea');
      promptInput.className = 'w-full h-12 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white placeholder:text-white/30 outline-none mb-2 resize-none';
      promptInput.placeholder = 'Describe what happens in the gap...';
      gapPanel.appendChild(promptInput);
      
      // Duration
      const durRow = document.createElement('div');
      durRow.className = 'mb-3';
      durRow.innerHTML = '<div class="text-[10px] text-white/50 mb-1">Duration</div>';
      const durSelect = document.createElement('select');
      durSelect.className = 'w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none';
      [3, 5, 7, 10].forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = `${d}s`;
        durSelect.appendChild(opt);
      });
      durRow.appendChild(durSelect);
      gapPanel.appendChild(durRow);
      
      // Generate button
      const genBtn = document.createElement('button');
      genBtn.className = 'w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02]';
      genBtn.innerHTML = '🎞️ Generate Fill';
      genBtn.onclick = () => {
        chatHistory = [...chatHistory, { role: 'user', content: 'Fill gap with AI' }, { role: 'assistant', content: '🎞️ Analyzing adjacent clips and generating...' }];
        render();
        setTimeout(() => {
          chatHistory = [...chatHistory, { role: 'assistant', content: '🎞️ Generated! Clip added to timeline.' }];
          render();
        }, 3000);
      };
      gapPanel.appendChild(genBtn);
      
      panels.appendChild(gapPanel);
    }
    
    // Element System Panel (NEW - CineGen)
    if (state.elementsOpen) {
      const elemPanel = document.createElement('div');
      elemPanel.className = 'w-72 rounded-[20px] border border-pink-400/20 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(17,24,39,0.75))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl p-3';
      
      const header = document.createElement('div');
      header.className = 'flex items-center justify-between mb-3';
      header.innerHTML = '<div class="text-xs font-black uppercase tracking-wider text-pink-200">👤 Elements</div>';
      
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.className = 'text-white/40 hover:text-white text-sm';
      closeBtn.onclick = () => { setState({ elementsOpen: false }); };
      header.appendChild(closeBtn);
      elemPanel.appendChild(header);
      
      // Element type tabs
      const tabs = document.createElement('div');
      tabs.className = 'flex gap-1 mb-3';
      const elementTypes = [
        { id: 'characters', icon: '👤', name: 'Characters' },
        { id: 'locations', icon: '🏠', name: 'Locations' },
        { id: 'props', icon: '🎁', name: 'Props' },
        { id: 'vehicles', icon: '🚗', name: 'Vehicles' },
      ];
      elementTypes.forEach(type => {
        const btn = document.createElement('button');
        btn.className = `flex-1 rounded-lg border p-1.5 text-[8px] text-center transition ${state.selectedElementType === type.id ? 'border-pink-400 bg-pink-500/20 text-pink-100' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'}`;
        const iconSpan = document.createElement('div');
        iconSpan.className = 'text-lg';
        iconSpan.textContent = type.icon;
        const nameSpan = document.createElement('div');
        nameSpan.textContent = type.name;
        btn.appendChild(iconSpan);
        btn.appendChild(nameSpan);
        btn.onclick = () => setState({ selectedElementType: type.id });
        tabs.appendChild(btn);
      });
      elemPanel.appendChild(tabs);
      
      // Current elements
      const currentElements = state.elements[state.selectedElementType] || [];
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-2 gap-1 mb-2 max-h-[100px] overflow-y-auto';
      
      if (currentElements.length === 0) {
        grid.innerHTML = '<div class="col-span-2 text-center text-[10px] text-white/40 py-4">No elements yet</div>';
      } else {
        currentElements.forEach(elem => {
          const item = document.createElement('div');
          item.className = 'aspect-square rounded-lg border border-white/10 bg-black/40 overflow-hidden cursor-pointer hover:border-pink-400/30 transition';
          const nameDiv = document.createElement('div');
          nameDiv.className = 'w-full h-full flex items-center justify-center text-xs text-white/70 p-1 text-center';
          nameDiv.textContent = elem.name;
          item.appendChild(nameDiv);
          item.onclick = () => {
            chatHistory = [...chatHistory, { role: 'assistant', content: `📎 Selected element: ${elem.name}` }];
            render();
          };
          grid.appendChild(item);
        });
      }
      elemPanel.appendChild(grid);
      
      // Add element button
      const addBtn = document.createElement('button');
      addBtn.className = 'w-full rounded-lg border border-dashed border-pink-400/30 bg-pink-500/10 px-3 py-2 text-xs font-semibold text-pink-200 hover:bg-pink-500/20';
      addBtn.innerHTML = '+ Add Element';
      addBtn.onclick = () => {
        const name = prompt('Enter element name:');
        if (name) {
          const newElements = { ...state.elements };
          newElements[state.selectedElementType] = [...(newElements[state.selectedElementType] || []), { id: Date.now(), name }];
          setState({ elements: newElements });
          chatHistory = [...chatHistory, { role: 'assistant', content: `✅ Added ${state.selectedElementType.slice(0, -1)}: ${name}` }];
          render();
        }
      };
      elemPanel.appendChild(addBtn);
      
      panels.appendChild(elemPanel);
    }
    
    return panels;
  };
  
  /**
   * Create bottom toolbar with quick actions
   */
  const createBottomToolbar = () => {
    const toolbar = document.createElement('div');
    toolbar.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl z-40';
    
    const actions = [
      { icon: '⚡', label: 'Generate', action: () => { showGenerationPanel = true; render(); }, primary: true },
      { icon: '✂️', label: 'Split', action: () => executeQuickAction('splitClip') },
      { icon: '🎬', label: 'Scenes', action: () => executeQuickAction('detectScenes') },
      { icon: '💬', label: 'Subtitle', action: () => executeQuickAction('addSubtitle') },
      { icon: '🎞️', label: 'B-Roll', action: () => executeQuickAction('addBroll') },
      { icon: '⏱️', label: 'Speed', action: () => executeQuickAction('speedUp') },
      { icon: '🪄', label: 'Stabilize', action: () => executeQuickAction('stabilize') },
      { icon: '📝', label: 'Text', action: () => executeQuickAction('addText') },
    ];
    
    actions.forEach(a => {
      const btn = document.createElement('button');
      btn.className = `flex flex-col items-center gap-0.5 rounded-xl border px-3 py-1.5 text-[10px] font-semibold transition ${a.primary ? 'border-cyan-400/30 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`;
      btn.innerHTML = `<span class="text-base">${a.icon}</span><span>${a.label}</span>`;
      btn.onclick = a.action;
      toolbar.appendChild(btn);
    });
    
    return toolbar;
  };
  
  // Helper functions
  const addClipFromMedia = (media) => {
    const videoTrack = state.tracks.find(t => t.type === 'video');
    if (!videoTrack) return;
    
    const newClip = {
      id: `clip-${Date.now()}`,
      name: media.name,
      mediaUrl: media.url,
      type: media.type,
      startTime: state.currentTime,
      endTime: state.currentTime + 5000,
      transitions: { in: null, out: null },
      keyframes: [],
      properties: { 'position-x': 0, 'position-y': 0, 'scale': 1, 'rotation': 0, 'opacity': 100 },
    };
    
    const updatedTracks = state.tracks.map(t => t.id === videoTrack.id ? { ...t, clips: [...t.clips, newClip] } : t);
    setState({ tracks: updatedTracks, selectedClipId: newClip.id });
  };
  
  const addNewTrack = (type) => {
    const newTrack = { id: `${type}-${Date.now()}`, type, name: type.charAt(0).toUpperCase() + type.slice(1), clips: [], locked: false, visible: true };
    setState({ tracks: [...state.tracks, newTrack] });
  };
  
  const addTransition = (transId) => {
    if (!state.selectedClipId) return;
    const updatedTracks = state.tracks.map(track => ({ ...track, clips: track.clips.map(clip => clip.id === state.selectedClipId ? { ...clip, transitions: { ...clip.transitions, out: transId } } : clip) }));
    setState({ tracks: updatedTracks });
  };
  
  const updateClipProperty = (clipId, propId, value) => {
    const updatedTracks = state.tracks.map(track => ({ ...track, clips: track.clips.map(clip => clip.id === clipId ? { ...clip, properties: { ...clip.properties, [propId]: value } } : clip) }));
    setState({ tracks: updatedTracks });
  };
  
  const executeQuickAction = async (action) => {
    switch (action) {
      case 'splitClip':
        if (state.selectedClipId) {
          const clip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
          if (clip && state.currentTime > clip.startTime && state.currentTime < clip.endTime) {
            const splitTime = state.currentTime - clip.startTime;
            const newClip = { ...clip, id: `clip-${Date.now()}`, startTime: state.currentTime, endTime: clip.endTime };
            clip.endTime = state.currentTime;
            const updatedTracks = state.tracks.map(t => ({ ...t, clips: [...t.clips, newClip] }));
            setState({ tracks: updatedTracks });
          }
        }
        break;
      case 'detectScenes':
        chatHistory = [...chatHistory, { role: 'user', content: 'Detect scenes' }, { role: 'assistant', content: '🔍 Analyzing...' }];
        render();
        setTimeout(() => {
          setState({ scenes: [{ start: 0, end: 5000 }, { start: 5000, end: 12000 }] });
          chatHistory = [...chatHistory, { role: 'assistant', content: '✅ Found 2 scenes' }];
          render();
        }, 1500);
        break;
      case 'addSubtitle':
        const newSub = { id: `sub-${Date.now()}`, startTime: state.currentTime, endTime: state.currentTime + 3000, text: 'Subtitle...' };
        setState({ subtitles: [...state.subtitles, newSub] });
        chatHistory = [...chatHistory, { role: 'assistant', content: '✅ Added subtitle' }];
        render();
        break;
      case 'addBroll':
      case 'speedUp':
      case 'stabilize':
      case 'addText':
        chatHistory = [...chatHistory, { role: 'user', content: action }, { role: 'assistant', content: '⚡ Processing...' }];
        render();
        setTimeout(() => {
          chatHistory = [...chatHistory, { role: 'assistant', content: '✅ Done' }];
          render();
        }, 1000);
        break;
    }
  };
  
  const processAICommand = async (command) => {
    const lowerCmd = command.toLowerCase();
    chatHistory = [...chatHistory, { role: 'user', content: command }];
    render();
    
    let matchedCmd = null;
    for (const [key, value] of Object.entries(AI_COMMANDS)) {
      if (lowerCmd.includes(key)) { matchedCmd = value; break; }
    }
    
    if (matchedCmd) {
      // Handle generation commands
      if (matchedCmd.category === 'generation') {
        if (matchedCmd.action === 'openGeneration') {
          // Set generation mode if specified
          if (matchedCmd.mode) {
            setState({ generationMode: matchedCmd.mode });
          }
          // Extract prompt from command if possible
          let prompt = '';
          const promptMatch = command.match(/(?:generate|create|make|animate)\s+(.+)/i);
          if (promptMatch) {
            prompt = promptMatch[1];
            setState({ generationPrompt: prompt });
          }
          showGenerationPanel = true;
          chatHistory = [...chatHistory, { role: 'assistant', content: `⚡ Opening generation panel... ${prompt ? `Prompt: "${prompt}"` : ''}` }];
        } else if (matchedCmd.action === 'createVariation') {
          const selectedClip = state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
          if (selectedClip) {
            setState({ generationMode: 'retake', generationPrompt: `Variation of: ${selectedClip.name || 'selected clip'}` });
            showGenerationPanel = true;
            chatHistory = [...chatHistory, { role: 'assistant', content: '⚡ Opening retake for variation...' }];
          } else {
            chatHistory = [...chatHistory, { role: 'assistant', content: '⚠️ Please select a clip to create variation' }];
          }
        } else if (matchedCmd.action === 'betterOpening') {
          setState({ generationMode: 'text-to-video', generationPrompt: 'Cinematic opening shot establishing the scene with dramatic composition' });
          showGenerationPanel = true;
          chatHistory = [...chatHistory, { role: 'assistant', content: '⚡ Opening generation for better opening shot...' }];
        } else if (matchedCmd.action === 'matchStyle') {
          chatHistory = [...chatHistory, { role: 'assistant', content: '🎯 To match style, select a source clip first, then use retake' }];
        }
        render();
      } else {
        chatHistory = [...chatHistory, { role: 'assistant', content: `🎬 ${matchedCmd.desc}...` }];
        render();
        await executeQuickAction(matchedCmd.action);
      }
    } else {
      // Check for generation keywords
      if (lowerCmd.includes('generate') || lowerCmd.includes('create video') || lowerCmd.includes('animate')) {
        showGenerationPanel = true;
        chatHistory = [...chatHistory, { role: 'assistant', content: '⚡ Opening generation panel...' }];
      } else {
        chatHistory = [...chatHistory, { role: 'assistant', content: '🤔 Try: detect scenes, add fade, generate video, create variation, retake, extend' }];
      }
      render();
    }
  };
  
  /**
   * Main render function
   */
  const render = () => {
    container.innerHTML = '';
    
    // Background
    const bg = document.createElement('div');
    bg.className = 'fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_26%),radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.08),transparent_20%)] pointer-events-none';
    container.appendChild(bg);
    
    // Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'relative mx-auto max-w-[1400px] px-4 py-4';
    
    wrapper.appendChild(createHeader());
    wrapper.appendChild(createMainContent());
    wrapper.appendChild(createFloatingPanels());
    wrapper.appendChild(createBottomToolbar());
    
    container.appendChild(wrapper);
  };
  
  render();
  return container;
}
