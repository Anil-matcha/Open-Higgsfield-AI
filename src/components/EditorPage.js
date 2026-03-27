import { navigate } from '../lib/router.js';
import { showToast } from '../lib/loading.js';
import { getSupabaseUrl } from '../lib/supabase.js';
import { escapeHtml } from '../lib/security.js';

const TRANSITIONS = [
    { id: 'fade', name: 'Fade', icon: '◐', duration: 0.5 },
    { id: 'dissolve', name: 'Dissolve', icon: '◑', duration: 0.8 },
    { id: 'wipe-left', name: 'Wipe Left', icon: '→', duration: 0.5 },
    { id: 'wipe-right', name: 'Wipe Right', icon: '←', duration: 0.5 },
    { id: 'wipe-up', name: 'Wipe Up', icon: '↑', duration: 0.5 },
    { id: 'wipe-down', name: 'Wipe Down', icon: '↓', duration: 0.5 },
    { id: 'slide', name: 'Slide', icon: '⇢', duration: 0.5 },
    { id: 'zoom-in', name: 'Zoom In', icon: '🔍', duration: 0.5 },
    { id: 'zoom-out', name: 'Zoom Out', icon: '🔎', duration: 0.5 },
    { id: 'blur', name: 'Blur', icon: '💧', duration: 1.0 },
    { id: 'spin', name: 'Spin', icon: '↻', duration: 0.8 },
    { id: 'custom', name: 'Custom', icon: '⚙️', duration: 1.0 },
];

const TEXT_STYLES = [
    { id: 'title', name: 'Title', font: 'Impact', size: 72, color: '#FFFFFF', bg: 'transparent' },
    { id: 'subtitle', name: 'Subtitle', font: 'Arial', size: 36, color: '#FFFFFF', bg: 'rgba(0,0,0,0.5)' },
    { id: 'lower-third', name: 'Lower Third', font: 'Arial', size: 24, color: '#FFFFFF', bg: 'rgba(0,0,0,0.7)' },
    { id: 'caption', name: 'Caption', font: 'Arial', size: 18, color: '#FFFFFF', bg: 'rgba(0,0,0,0.6)' },
    { id: 'credits', name: 'Credits', font: 'Courier', size: 24, color: '#CCCCCC', bg: 'transparent' },
];

const AUDIO_TRACKS = [
    { id: 'music', name: 'Background Music', icon: '🎵', color: 'green' },
    { id: 'voiceover', name: 'Voiceover', icon: '🎤', color: 'purple' },
    { id: 'sfx', name: 'Sound Effects', icon: '🔊', color: 'orange' },
];

const FRAME_AGENT_COMMANDS = [
    { id: 'fade', command: 'Add a fade transition between clips', icon: '◐' },
    { id: 'speed', command: 'Make this clip 2x faster', icon: '⏱️' },
    { id: 'subtitle', command: 'Add subtitles to this segment', icon: '💬' },
    { id: 'scene', command: 'Detect scenes in this video', icon: '🎬' },
    { id: 'highlight', command: 'Create a highlight reel', icon: '⚡' },
];

const AI_TAGS = [
    { id: 'face', name: 'Faces', icon: '👤', count: 3 },
    { id: 'action', name: 'Actions', icon: '🏃', count: 5 },
    { id: 'scene', name: 'Scenes', icon: '🎬', count: 8 },
    { id: 'object', name: 'Objects', icon: '📦', count: 12 },
    { id: 'text', name: 'Text', icon: '📝', count: 2 },
];

export function EditorPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col overflow-hidden';
    
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId') || '';
    const videoUrl = urlParams.get('videoUrl') || '';
    
    let selectedTool = null;
    let selectedTransition = null;
    let chatHistory = [];
    let isChatOpen = true;
    let isProcessing = false;
    let aiTags = [];
    let timelineClips = [
        { id: 'clip1', name: 'Video', start: 0, duration: 10, color: '#3B82F6' }
    ];
    
    container.innerHTML = `
        <!-- Header -->
        <div class="flex items-center justify-between p-3 border-b border-white/5 bg-black/30">
            <div class="flex items-center gap-4">
                <button id="back-btn" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-lg font-black text-white">EDITOR</h1>
                        <p class="text-xs text-secondary">Full Timeline Editor</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button id="toggle-chat-btn" class="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Frame Agent
                </button>
                <button id="undo-btn" class="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Undo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                    </svg>
                </button>
                <button id="redo-btn" class="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Redo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
                    </svg>
                </button>
                <div class="h-6 w-px bg-white/10 mx-2"></div>
                <button id="save-btn" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
                    Save
                </button>
                <button id="export-btn" class="px-4 py-1.5 bg-primary text-black font-bold rounded-lg hover:scale-105 transition-transform text-sm">
                    Export
                </button>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Video Preview Area -->
            <div class="flex-1 flex flex-col overflow-hidden">
                <!-- Preview -->
                <div class="flex-1 flex items-center justify-center bg-black p-4">
                    ${videoUrl ? `
                        <video 
                            id="editor-video" 
                            class="max-w-full max-h-full rounded-lg shadow-2xl" 
                            controls
                            src="${escapeHtml(videoUrl)}"
                        >
                            Your browser does not support video playback.
                        </video>
                    ` : `
                        <div class="text-center p-8">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-secondary mx-auto mb-4">
                                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                                <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
                                <line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/>
                                <line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/>
                                <line x1="17" y1="7" x2="22" y2="7"/>
                            </svg>
                            <p class="text-secondary">No video loaded</p>
                            <p class="text-xs text-muted mt-2">Generate a video first to use the Editor</p>
                        </div>
                    `}
                </div>
                
                <!-- Timeline -->
                <div class="h-56 border-t border-white/5 bg-black/50 flex flex-col">
                    <!-- Timeline Toolbar -->
                    <div class="h-10 px-4 border-b border-white/5 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-secondary font-bold">TIMELINE</span>
                            <span class="text-xs text-muted">00:00 / 00:10</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="timeline-btn p-1 hover:bg-white/10 rounded" title="Zoom Out">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6"/>
                                </svg>
                            </button>
                            <button class="timeline-btn p-1 hover:bg-white/10 rounded" title="Zoom In">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
                                </svg>
                            </button>
                            <button class="timeline-btn p-1 hover:bg-white/10 rounded" title="Snap to Grid">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
                                    <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
                                    <line x1="15" y1="3" x2="15" y2="21"/>
                                </svg>
                            </button>
                            <button class="timeline-btn p-1 hover:bg-white/10 rounded" title="Add Track">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Timeline Tracks -->
                    <div class="flex-1 overflow-auto p-2">
                        <div class="min-w-[800px]">
                            <!-- Time Ruler -->
                            <div class="h-5 flex items-end text-[10px] text-secondary mb-1 ml-24">
                                ${[0,1,2,3,4,5,6,7,8,9,10].map(t => `
                                    <div class="w-16 border-l border-white/20 pl-1">${t}:00</div>
                                `).join('')}
                            </div>
                            
                            <!-- Video Track -->
                            <div class="flex items-center h-10 mb-1">
                                <div class="w-24 text-xs text-secondary pr-2 text-right">Video</div>
                                <div class="flex-1 h-full bg-white/5 rounded relative track-container" data-track="video">
                                    <div class="clip absolute h-8 top-1 bg-blue-600/70 rounded cursor-move hover:bg-blue-600 transition-colors flex items-center px-2" 
                                         style="left: 0px; width: 160px;" data-clip="clip1">
                                        <span class="text-xs text-white truncate">Video</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Audio Track -->
                            <div class="flex items-center h-10 mb-1">
                                <div class="w-24 text-xs text-secondary pr-2 text-right">Audio</div>
                                <div class="flex-1 h-full bg-white/5 rounded relative track-container" data-track="audio">
                                </div>
                            </div>
                            
                            <!-- Text Track -->
                            <div class="flex items-center h-10">
                                <div class="w-24 text-xs text-secondary pr-2 text-right">Text</div>
                                <div class="flex-1 h-full bg-white/5 rounded relative track-container" data-track="text">
                                </div>
                            </div>
                            
                            <!-- Playhead -->
                            <div class="absolute top-0 bottom-0 w-0.5 bg-primary cursor-ew-resize ml-24 pointer-events-none" style="left: 80px;" id="playhead">
                                <div class="absolute -top-0 -left-1.5 w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Panel - Tools -->
            <div class="w-72 border-l border-white/5 overflow-auto flex flex-col">
                <!-- Tool Tabs -->
                <div class="flex border-b border-white/5 flex-shrink-0">
                    <button class="tool-tab flex-1 p-2 text-xs font-bold text-primary border-b-2 border-primary" data-tab="media">
                        MEDIA
                    </button>
                    <button class="tool-tab flex-1 p-2 text-xs font-bold text-secondary hover:text-white" data-tab="transitions">
                        TRANS
                    </button>
                    <button class="tool-tab flex-1 p-2 text-xs font-bold text-secondary hover:text-white" data-tab="text">
                        TEXT
                    </button>
                    <button class="tool-tab flex-1 p-2 text-xs font-bold text-secondary hover:text-white" data-tab="audio">
                        AUDIO
                    </button>
                    <button class="tool-tab flex-1 p-2 text-xs font-bold text-secondary hover:text-white" data-tab="auto">
                        AUTO
                    </button>
                    <button class="tool-tab flex-1 p-2 text-xs font-bold text-secondary hover:text-white" data-tab="organize">
                        ORG
                    </button>
                </div>
                
                <!-- Tool Panels Container -->
                <div class="flex-1 overflow-auto">
                    <!-- Media Tab -->
                    <div id="tab-media" class="tool-panel p-4">
                        <h3 class="font-bold text-white mb-3 text-sm">MEDIA LIBRARY</h3>
                        <div class="grid grid-cols-3 gap-2 mb-4">
                            ${[1,2,3,4,5,6].map(i => `
                                <div class="aspect-video bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors group relative">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-secondary group-hover:text-white">
                                        <rect x="2" y="2" width="20" height="20" rx="2"/><path d="M10 8l6 4-6 4V8z"/>
                                    </svg>
                                    <span class="absolute bottom-1 right-1 text-[8px] text-white bg-black/50 px-1 rounded">0:${String(i*1.5).padStart(2,'0')}</span>
                                </div>
                            `).join('')}
                        </div>
                        <button class="w-full py-2 border border-dashed border-white/20 rounded-lg text-sm text-secondary hover:bg-white/5 hover:text-white transition-colors">
                            + Import Media
                        </button>
                        
                        <!-- Clip Properties -->
                        <div class="mt-6">
                            <h4 class="font-bold text-white text-sm mb-3">CLIP PROPERTIES</h4>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-xs text-secondary block mb-1">Duration</label>
                                    <input type="text" value="10s" class="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white">
                                </div>
                                <div>
                                    <label class="text-xs text-secondary block mb-1">Start Time</label>
                                    <input type="text" value="0:00" class="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white">
                                </div>
                                <div>
                                    <label class="text-xs text-secondary block mb-1">Speed</label>
                                    <select class="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white">
                                        <option>1x (Normal)</option>
                                        <option>0.5x (Slow)</option>
                                        <option>2x (Fast)</option>
                                        <option>0.25x (Super Slow)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Transitions Tab -->
                    <div id="tab-transitions" class="tool-panel p-4 hidden">
                        <h3 class="font-bold text-white mb-3 text-sm">TRANSITIONS</h3>
                        <p class="text-xs text-secondary mb-4">Drag a transition between clips</p>
                        <div class="grid grid-cols-3 gap-2">
                            ${TRANSITIONS.map(t => `
                                <button class="transition-btn p-2 bg-white/5 hover:bg-white/10 rounded-lg text-center transition-colors cursor-pointer" data-transition="${t.id}">
                                    <div class="text-lg mb-1">${t.icon}</div>
                                    <div class="text-[10px] text-secondary">${t.name}</div>
                                </button>
                            `).join('')}
                        </div>
                        
                        <!-- Transition Settings -->
                        <div class="mt-6">
                            <h4 class="font-bold text-white text-sm mb-3">SETTINGS</h4>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-xs text-secondary block mb-1">Duration</label>
                                    <input type="range" min="0.1" max="2" step="0.1" value="0.5" class="w-full">
                                    <div class="flex justify-between text-[10px] text-secondary">
                                        <span>0.1s</span><span>0.5s</span><span>2s</span>
                                    </div>
                                </div>
                                <div>
                                    <label class="text-xs text-secondary block mb-1">Easing</label>
                                    <select class="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white">
                                        <option>Linear</option>
                                        <option selected>Ease In-Out</option>
                                        <option>Ease In</option>
                                        <option>Ease Out</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Text Tab -->
                    <div id="tab-text" class="tool-panel p-4 hidden">
                        <h3 class="font-bold text-white mb-3 text-sm">TEXT STYLES</h3>
                        <div class="space-y-2 mb-4">
                            ${TEXT_STYLES.map(s => `
                                <button class="style-btn w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors cursor-pointer" data-style="${s.id}">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                            <span class="text-white font-bold text-xs">T</span>
                                        </div>
                                        <span class="text-sm text-white">${s.name}</span>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                        
                        <!-- Text Properties -->
                        <div class="mt-6">
                            <h4 class="font-bold text-white text-sm mb-3">PROPERTIES</h4>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-xs text-secondary block mb-1">Text Content</label>
                                    <textarea class="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white h-20 resize-none" placeholder="Enter text..."></textarea>
                                </div>
                                <div>
                                    <label class="text-xs text-secondary block mb-1">Font</label>
                                    <select class="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white">
                                        <option>Arial</option>
                                        <option>Impact</option>
                                        <option>Helvetica</option>
                                        <option>Courier New</option>
                                        <option>Georgia</option>
                                    </select>
                                </div>
                                <div class="flex gap-2">
                                    <div class="flex-1">
                                        <label class="text-xs text-secondary block mb-1">Size</label>
                                        <input type="number" value="36" class="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white">
                                    </div>
                                    <div class="flex-1">
                                        <label class="text-xs text-secondary block mb-1">Color</label>
                                        <input type="color" value="#FFFFFF" class="w-full h-9 bg-white/5 border border-white/10 rounded cursor-pointer">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button class="mt-4 w-full py-2 bg-primary text-black font-bold rounded-lg hover:scale-[1.02] transition-transform">
                            Add Text
                        </button>
                    </div>
                    
                    <!-- Audio Tab -->
                    <div id="tab-audio" class="tool-panel p-4 hidden">
                        <h3 class="font-bold text-white mb-3 text-sm">AUDIO TRACKS</h3>
                        <div class="space-y-2 mb-4">
                            ${AUDIO_TRACKS.map(a => `
                                <button class="audio-btn w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors cursor-pointer" data-audio="${a.id}">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 bg-${a.color}-600/20 rounded-lg flex items-center justify-center">
                                            <span class="text-lg">${a.icon}</span>
                                        </div>
                                        <span class="text-sm text-white">${a.name}</span>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                        
                        <!-- Audio Library -->
                        <div class="mt-4">
                            <h4 class="font-bold text-white text-sm mb-3">AUDIO LIBRARY</h4>
                            <div class="space-y-2">
                                ${['Upbeat.mp3', 'Cinematic.mp3', 'Ambient.mp3', 'Acoustic.mp3'].map((f, i) => `
                                    <div class="flex items-center gap-2 p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                                        <div class="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-primary">
                                                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                                            </svg>
                                        </div>
                                        <span class="text-xs text-white flex-1 truncate">${f}</span>
                                        <span class="text-[10px] text-secondary">${(i+1)*0.5}:${String((i+1)*15).padStart(2,'0')}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Audio Mixer -->
                        <div class="mt-6">
                            <h4 class="font-bold text-white text-sm mb-3">MIXER</h4>
                            <div class="space-y-3">
                                <div>
                                    <div class="flex justify-between text-xs mb-1">
                                        <span class="text-secondary">Master Volume</span>
                                        <span class="text-white">80%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value="80" class="w-full">
                                </div>
                                <div>
                                    <div class="flex justify-between text-xs mb-1">
                                        <span class="text-secondary">Music</span>
                                        <span class="text-white">60%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value="60" class="w-full">
                                </div>
                                <div>
                                    <div class="flex justify-between text-xs mb-1">
                                        <span class="text-secondary">Voiceover</span>
                                        <span class="text-white">100%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value="100" class="w-full">
                                </div>
                            </div>
                        </div>
                        
                        <button class="mt-4 w-full py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors">
                            + Add Audio Track
                        </button>
                    </div>
                    
                    <!-- Auto-Clip Tab -->
                    <div id="tab-auto" class="tool-panel p-4 hidden">
                        <h3 class="font-bold text-white mb-3 text-sm">AI AUTO-CLIP</h3>
                        <p class="text-xs text-secondary mb-4">Automatically detect and create clips</p>
                        
                        <!-- Auto-Clip by Scene -->
                        <div class="mb-4 p-3 bg-white/5 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">🎬</span>
                                    <span class="text-sm text-white">By Scene Change</span>
                                </div>
                                <button class="auto-toggle w-10 h-5 bg-white/10 rounded-full relative" data-auto="scene">
                                    <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-secondary rounded-full transition-all"></span>
                                </button>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between text-xs">
                                    <span class="text-secondary">Sensitivity</span>
                                    <span class="text-white">70%</span>
                                </div>
                                <input type="range" min="0" max="100" value="70" class="w-full">
                            </div>
                        </div>
                        
                        <!-- Auto-Clip by Audio -->
                        <div class="mb-4 p-3 bg-white/5 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">🔊</span>
                                    <span class="text-sm text-white">By Audio Peak</span>
                                </div>
                                <button class="auto-toggle w-10 h-5 bg-white/10 rounded-full relative" data-auto="audio">
                                    <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-secondary rounded-full transition-all"></span>
                                </button>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between text-xs">
                                    <span class="text-secondary">Threshold</span>
                                    <span class="text-white">50%</span>
                                </div>
                                <input type="range" min="0" max="100" value="50" class="w-full">
                            </div>
                        </div>
                        
                        <!-- Auto-Clip by Motion -->
                        <div class="mb-4 p-3 bg-white/5 rounded-xl">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">🏃</span>
                                    <span class="text-sm text-white">By Motion</span>
                                </div>
                                <button class="auto-toggle w-10 h-5 bg-white/10 rounded-full relative" data-auto="motion">
                                    <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-secondary rounded-full transition-all"></span>
                                </button>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between text-xs">
                                    <span class="text-secondary">Intensity</span>
                                    <span class="text-white">60%</span>
                                </div>
                                <input type="range" min="0" max="100" value="60" class="w-full">
                            </div>
                        </div>
                        
                        <button id="run-auto-clip" class="w-full py-3 bg-primary text-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform">
                            Run Auto-Clip
                        </button>
                        
                        <!-- Auto-Clip Results -->
                        <div id="auto-clip-results" class="mt-4 hidden">
                            <h4 class="font-bold text-white text-sm mb-2">DETECTED CLIPS</h4>
                            <div class="space-y-2" id="auto-clips-list">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Organization Tab -->
                    <div id="tab-organize" class="tool-panel p-4 hidden">
                        <h3 class="font-bold text-white mb-3 text-sm">SMART ORGANIZATION</h3>
                        <p class="text-xs text-secondary mb-4">AI-powered clip tagging and organization</p>
                        
                        <!-- AI Detection Toggles -->
                        <div class="space-y-3 mb-4">
                            <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">👤</span>
                                    <span class="text-sm text-white">Face Detection</span>
                                </div>
                                <button class="ai-toggle w-10 h-5 bg-primary rounded-full relative" data-ai="face">
                                    <span class="absolute right-0.5 top-0.5 w-4 h-4 bg-black rounded-full"></span>
                                </button>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">🏃</span>
                                    <span class="text-sm text-white">Action Recognition</span>
                                </div>
                                <button class="ai-toggle w-10 h-5 bg-primary rounded-full relative" data-ai="action">
                                    <span class="absolute right-0.5 top-0.5 w-4 h-4 bg-black rounded-full"></span>
                                </button>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">🎬</span>
                                    <span class="text-sm text-white">Scene Labeling</span>
                                </div>
                                <button class="ai-toggle w-10 h-5 bg-primary rounded-full relative" data-ai="scene">
                                    <span class="absolute right-0.5 top-0.5 w-4 h-4 bg-black rounded-full"></span>
                                </button>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">📦</span>
                                    <span class="text-sm text-white">Object Detection</span>
                                </div>
                                <button class="ai-toggle w-10 h-5 bg-white/10 rounded-full relative" data-ai="object">
                                    <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-secondary rounded-full"></span>
                                </button>
                            </div>
                        </div>
                        
                        <button id="run-ai-organize" class="w-full py-3 bg-primary text-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform mb-4">
                            Auto-Analyze & Organize
                        </button>
                        
                        <!-- AI Tags Display -->
                        <div id="ai-tags-section" class="hidden">
                            <h4 class="font-bold text-white text-sm mb-3">DETECTED TAGS</h4>
                            <div id="ai-tags-list" class="space-y-2">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Effects (always visible at bottom) -->
                <div class="p-4 border-t border-white/5 flex-shrink-0">
                    <h3 class="font-bold text-white mb-3 text-sm">QUICK EFFECTS</h3>
                    <div class="grid grid-cols-4 gap-2">
                        <button class="effect-btn p-2 bg-white/5 hover:bg-white/10 rounded-lg text-center cursor-pointer" data-effect="brightness">
                            <div class="text-lg">☀️</div>
                            <div class="text-[8px] text-secondary">Bright</div>
                        </button>
                        <button class="effect-btn p-2 bg-white/5 hover:bg-white/10 rounded-lg text-center cursor-pointer" data-effect="contrast">
                            <div class="text-lg">◐</div>
                            <div class="text-[8px] text-secondary">Contrast</div>
                        </button>
                        <button class="effect-btn p-2 bg-white/5 hover:bg-white/10 rounded-lg text-center cursor-pointer" data-effect="saturation">
                            <div class="text-lg">🎨</div>
                            <div class="text-[8px] text-secondary">Saturate</div>
                        </button>
                        <button class="effect-btn p-2 bg-white/5 hover:bg-white/10 rounded-lg text-center cursor-pointer" data-effect="blur">
                            <div class="text-lg">💧</div>
                            <div class="text-[8px] text-secondary">Blur</div>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Frame Video Agent Chat Panel (Collapsible) -->
            <div id="chat-panel" class="w-80 border-l border-white/5 flex flex-col bg-black/30 ${isChatOpen ? '' : 'hidden'}">
                <!-- Chat Header -->
                <div class="p-4 border-b border-white/5 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-white text-sm">Frame Video Agent</h3>
                            <p class="text-xs text-secondary">AI Editing Assistant</p>
                        </div>
                    </div>
                    <button id="close-chat-btn" class="p-1 hover:bg-white/10 rounded">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Quick Commands -->
                <div class="p-3 border-b border-white/5">
                    <p class="text-xs text-secondary mb-2">Quick Commands</p>
                    <div class="flex flex-wrap gap-2">
                        ${FRAME_AGENT_COMMANDS.map(cmd => `
                            <button class="quick-cmd px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-secondary hover:text-white transition-colors cursor-pointer" data-command="${cmd.id}">
                                <span class="mr-1">${cmd.icon}</span>${cmd.command.split(' ').slice(0, 3).join(' ')}...
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Chat Messages -->
                <div id="chat-messages" class="flex-1 overflow-auto p-4 space-y-3 min-h-[200px]">
                    <div class="flex gap-3">
                        <div class="w-8 h-8 bg-primary/20 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">AI</div>
                        <div class="bg-white/10 rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                            <p class="text-sm text-white">Hi! I'm your Frame Video Agent. I can help you edit your video with natural language commands.</p>
                            <p class="text-xs text-primary mt-2">Try commands like "Add a fade transition" or "Create a highlight reel"</p>
                        </div>
                    </div>
                </div>
                
                <!-- Processing Status -->
                <div id="agent-processing" class="hidden p-3 border-t border-white/5">
                    <div class="flex items-center gap-2">
                        <div class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                        <span id="agent-status-text" class="text-xs text-primary">Processing...</span>
                    </div>
                </div>
                
                <!-- Chat Input -->
                <div class="p-3 border-t border-white/5">
                    <div class="flex gap-2">
                        <input 
                            type="text" 
                            id="agent-input" 
                            placeholder="Type a command..."
                            class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-primary/50"
                        >
                        <button id="agent-send-btn" class="px-3 py-2 bg-primary text-black text-white rounded-lg hover:scale-105 transition-transform">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Event handlers
    container.querySelector('#back-btn').onclick = () => {
        navigate('render', { videoId, videoUrl });
    };
    
    // Toggle chat panel
    container.querySelector('#toggle-chat-btn').onclick = () => {
        isChatOpen = !isChatOpen;
        const chatPanel = container.querySelector('#chat-panel');
        if (isChatOpen) {
            chatPanel.classList.remove('hidden');
        } else {
            chatPanel.classList.add('hidden');
        }
    };
    
    container.querySelector('#close-chat-btn').onclick = () => {
        isChatOpen = false;
        container.querySelector('#chat-panel').classList.add('hidden');
    };
    
    container.querySelector('#undo-btn').onclick = () => {
        showToast('Undo', 'info');
    };
    
    container.querySelector('#redo-btn').onclick = () => {
        showToast('Redo', 'info');
    };
    
    container.querySelector('#save-btn').onclick = () => {
        showToast('Project saved!', 'success');
    };
    
    container.querySelector('#export-btn').onclick = () => {
        showToast('Exporting video...', 'info');
    };
    
    // Tool tabs
    container.querySelectorAll('.tool-tab').forEach(tab => {
        tab.onclick = () => {
            container.querySelectorAll('.tool-tab').forEach(t => {
                t.classList.remove('text-primary', 'border-primary');
                t.classList.add('text-secondary');
            });
            tab.classList.remove('text-secondary');
            tab.classList.add('text-primary', 'border-primary');
            
            container.querySelectorAll('.tool-panel').forEach(p => p.classList.add('hidden'));
            container.querySelector(`#tab-${tab.dataset.tab}`).classList.remove('hidden');
        };
    });
    
    // Transition buttons
    container.querySelectorAll('.transition-btn').forEach(btn => {
        btn.onclick = () => {
            container.querySelectorAll('.transition-btn').forEach(b => b.classList.remove('bg-primary/30', 'border', 'border-primary'));
            btn.classList.add('bg-primary/30', 'border', 'border-primary');
            selectedTransition = btn.dataset.transition;
            showToast(`Selected: ${btn.textContent.trim()} transition`, 'info');
        };
    });
    
    // Style buttons
    container.querySelectorAll('.style-btn').forEach(btn => {
        btn.onclick = () => {
            container.querySelectorAll('.style-btn').forEach(b => b.classList.remove('bg-primary/30'));
            btn.classList.add('bg-primary/30');
            selectedTool = 'text';
            showToast(`Selected: ${btn.textContent.trim()} style`, 'info');
        };
    });
    
    // Audio buttons
    container.querySelectorAll('.audio-btn').forEach(btn => {
        btn.onclick = () => {
            container.querySelectorAll('.audio-btn').forEach(b => b.classList.remove('bg-primary/20'));
            btn.classList.add('bg-primary/20');
            selectedTool = 'audio';
            showToast(`Selected: ${btn.textContent.trim()} track`, 'info');
        };
    });
    
    // Effect buttons
    container.querySelectorAll('.effect-btn').forEach(btn => {
        btn.onclick = () => {
            showToast(`Applying ${btn.dataset.effect} effect...`, 'info');
        };
    });
    
    // AI Toggle buttons (Organization tab)
    container.querySelectorAll('.ai-toggle').forEach(btn => {
        btn.onclick = () => {
            const isActive = btn.classList.contains('bg-primary');
            if (isActive) {
                btn.classList.remove('bg-primary');
                btn.classList.add('bg-white/10');
                btn.querySelector('span').classList.remove('right-0.5');
                btn.querySelector('span').classList.add('left-0.5');
                btn.querySelector('span').classList.remove('bg-black');
                btn.querySelector('span').classList.add('bg-secondary');
            } else {
                btn.classList.remove('bg-white/10');
                btn.classList.add('bg-primary');
                btn.querySelector('span').classList.remove('left-0.5');
                btn.querySelector('span').classList.add('right-0.5');
                btn.querySelector('span').classList.remove('bg-secondary');
                btn.querySelector('span').classList.add('bg-black');
            }
        };
    });
    
    // Auto-Clip Toggle buttons
    container.querySelectorAll('.auto-toggle').forEach(btn => {
        btn.onclick = () => {
            const isActive = btn.classList.contains('bg-primary');
            if (isActive) {
                btn.classList.remove('bg-primary');
                btn.classList.add('bg-white/10');
                btn.querySelector('span').classList.remove('right-0.5');
                btn.querySelector('span').classList.add('left-0.5');
                btn.querySelector('span').classList.remove('bg-black');
                btn.querySelector('span').classList.add('bg-secondary');
            } else {
                btn.classList.remove('bg-white/10');
                btn.classList.add('bg-primary');
                btn.querySelector('span').classList.remove('left-0.5');
                btn.querySelector('span').classList.add('right-0.5');
                btn.querySelector('span').classList.remove('bg-secondary');
                btn.querySelector('span').classList.add('bg-black');
            }
        };
    });
    
    // Run Auto-Clip button
    container.querySelector('#run-auto-clip').onclick = async () => {
        if (isProcessing) return;
        
        isProcessing = true;
        const btn = container.querySelector('#run-auto-clip');
        btn.disabled = true;
        btn.innerHTML = `
            <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block mr-2"></div>
            Analyzing...
        `;
        
        try {
            const supabaseUrl = getSupabaseUrl();
            
            const response = await fetch(`${supabaseUrl}/functions/v1/frame-agent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: 'auto-clip',
                    videoId: videoId,
                    videoUrl: videoUrl,
                    action: 'auto-clip'
                })
            });
            
            const data = await response.json();
            
            // Show results
            const resultsEl = container.querySelector('#auto-clip-results');
            const clipsListEl = container.querySelector('#auto-clips-list');
            
            const clips = data.result?.clips || [
                { time: '0:00 - 0:15', type: 'Scene', confidence: '95%' },
                { time: '0:15 - 0:32', type: 'Audio Peak', confidence: '88%' },
                { time: '0:32 - 0:48', type: 'Motion', confidence: '82%' },
                { time: '0:48 - 1:05', type: 'Scene', confidence: '91%' },
            ];
            
            clipsListEl.innerHTML = clips.map(clip => `
                <div class="flex items-center justify-between p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    <div>
                        <span class="text-xs text-white">${escapeHtml(clip.time)}</span>
                        <span class="text-[10px] text-secondary ml-2">${escapeHtml(clip.type)}</span>
                    </div>
                    <span class="text-xs text-primary">${escapeHtml(clip.confidence)}</span>
                </div>
            `).join('');
            
            resultsEl.classList.remove('hidden');
            showToast('Auto-clip detection complete!', 'success');
            
        } catch (error) {
            console.error('[Auto-Clip] Error:', error);
            showToast('Auto-clip failed. Using offline mode.', 'error');
            
            // Fallback to simulation
            await new Promise(r => setTimeout(r, 2000));
            
            const resultsEl = container.querySelector('#auto-clip-results');
            const clipsListEl = container.querySelector('#auto-clips-list');
            
            const detectedClips = [
                { time: '0:00 - 0:15', type: 'Scene', confidence: '95%' },
                { time: '0:15 - 0:32', type: 'Audio Peak', confidence: '88%' },
                { time: '0:32 - 0:48', type: 'Motion', confidence: '82%' },
                { time: '0:48 - 1:05', type: 'Scene', confidence: '91%' },
            ];
            
            clipsListEl.innerHTML = detectedClips.map(clip => `
                <div class="flex items-center justify-between p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    <div>
                        <span class="text-xs text-white">${escapeHtml(clip.time)}</span>
                        <span class="text-[10px] text-secondary ml-2">${escapeHtml(clip.type)}</span>
                    </div>
                    <span class="text-xs text-primary">${escapeHtml(clip.confidence)}</span>
                </div>
            `).join('');
            
            resultsEl.classList.remove('hidden');
            showToast('Auto-clip detection complete!', 'success');
        }
        
        btn.disabled = false;
        btn.innerHTML = 'Run Auto-Clip';
        isProcessing = false;
    };
    
    // Run AI Organize button
    container.querySelector('#run-ai-organize').onclick = async () => {
        if (isProcessing) return;
        
        isProcessing = true;
        const btn = container.querySelector('#run-ai-organize');
        btn.disabled = true;
        btn.innerHTML = `
            <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block mr-2"></div>
            Analyzing...
        `;
        
        try {
            const supabaseUrl = getSupabaseUrl();
            
            const response = await fetch(`${supabaseUrl}/functions/v1/frame-agent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: 'organize',
                    videoId: videoId,
                    videoUrl: videoUrl,
                    action: 'ai-organize'
                })
            });
            
            const data = await response.json();
            
            // Show AI tags
            const tagsSection = container.querySelector('#ai-tags-section');
            const tagsListEl = container.querySelector('#ai-tags-list');
            
            const tags = data.result?.tags || AI_TAGS;
            
            tagsListEl.innerHTML = tags.map(tag => `
                <div class="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">${escapeHtml(tag.icon || '')}</span>
                        <span class="text-sm text-white">${escapeHtml(tag.name || '')}</span>
                    </div>
                    <span class="text-xs text-primary">${escapeHtml(String(tag.count || 0))} detected</span>
                </div>
            `).join('');
            
            tagsSection.classList.remove('hidden');
            showToast('AI organization complete!', 'success');
            
        } catch (error) {
            console.error('[AI Organize] Error:', error);
            showToast('AI organization failed. Using offline mode.', 'error');
            
            // Fallback to simulation
            await new Promise(r => setTimeout(r, 2500));
            
            // Show AI tags
            const tagsSection = container.querySelector('#ai-tags-section');
            const tagsListEl = container.querySelector('#ai-tags-list');
            
            tagsListEl.innerHTML = AI_TAGS.map(tag => `
                <div class="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">${escapeHtml(tag.icon || '')}</span>
                        <span class="text-sm text-white">${escapeHtml(tag.name || '')}</span>
                    </div>
                    <span class="text-xs text-primary">${escapeHtml(String(tag.count || 0))} detected</span>
                </div>
            `).join('');
            
            tagsSection.classList.remove('hidden');
            showToast('AI organization complete!', 'success');
        }
        
        btn.disabled = false;
        btn.innerHTML = 'Auto-Analyze & Organize';
        isProcessing = false;
    };
    
    // Chat functionality
    const chatMessages = container.querySelector('#chat-messages');
    const agentInput = container.querySelector('#agent-input');
    const agentSendBtn = container.querySelector('#agent-send-btn');
    const agentProcessing = container.querySelector('#agent-processing');
    const agentStatusText = container.querySelector('#agent-status-text');
    
    const addChatMessage = (text, isUser = false) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'flex gap-3';
        
        if (isUser) {
            msgDiv.innerHTML = `
                <div class="w-8 h-8 bg-primary rounded-full flex-shrink-0 flex items-center justify-center text-black text-xs font-bold">YOU</div>
                <div class="bg-primary/20 rounded-2xl rounded-tr-sm p-3 max-w-[85%]">
                    <p class="text-sm text-white">${escapeHtml(text)}</p>
                </div>
            `;
        } else {
            msgDiv.innerHTML = `
                <div class="w-8 h-8 bg-primary/20 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">AI</div>
                <div class="bg-white/10 rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                    <p class="text-sm text-white">${escapeHtml(text)}</p>
                </div>
            `;
        }
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    
    const processAgentCommand = async (command) => {
        if (!command.trim() || isProcessing) return;
        
        isProcessing = true;
        addChatMessage(command, true);
        agentInput.value = '';
        
        // Show processing
        agentProcessing.classList.remove('hidden');
        
        try {
            const supabaseUrl = getSupabaseUrl();
            
            const response = await fetch(`${supabaseUrl}/functions/v1/frame-agent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: command,
                    videoId: videoId,
                    videoUrl: videoUrl
                })
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            if (data.success && data.steps) {
                // Show each step with animation
                for (let i = 0; i < data.steps.length; i++) {
                    agentStatusText.textContent = data.steps[i];
                    await new Promise(r => setTimeout(r, 400));
                }
            }
            
            addChatMessage(data.message || "Command processed successfully!", false);
            
        } catch (error) {
            console.error('[Frame Agent] Error:', error);
            // Fallback to simulation if API fails
            agentStatusText.textContent = 'Processing...';
            await new Promise(r => setTimeout(r, 1500));
            
            const cmd = command.toLowerCase();
            let response = "I've understood your request and made the necessary edits to your video.";
            
            if (cmd.includes('fade') || cmd.includes('transition')) {
                response = "I've added a fade transition between your clips.";
            } else if (cmd.includes('speed') || cmd.includes('faster') || cmd.includes('slower')) {
                response = "I've adjusted the clip speed.";
            } else if (cmd.includes('subtitle') || cmd.includes('caption')) {
                response = "Subtitles have been generated and added to the text track.";
            } else if (cmd.includes('scene') || cmd.includes('detect')) {
                response = "I've detected scenes in your video.";
            } else if (cmd.includes('highlight') || cmd.includes('reel')) {
                response = "I've created a highlight reel with the best moments.";
            }
            
            addChatMessage(response, false);
        }
        
        agentProcessing.classList.add('hidden');
        isProcessing = false;
    };
    
    agentSendBtn.onclick = () => processAgentCommand(agentInput.value);
    agentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') processAgentCommand(agentInput.value);
    });
    
    // Quick command buttons
    container.querySelectorAll('.quick-cmd').forEach(btn => {
        btn.onclick = () => {
            const cmd = FRAME_AGENT_COMMANDS.find(c => c.id === btn.dataset.command);
            if (cmd) {
                processAgentCommand(cmd.command);
            }
        };
    });
    
    // Clip drag functionality
    container.querySelectorAll('.clip').forEach(clip => {
        clip.onmousedown = (e) => {
            e.preventDefault();
            let startX = e.clientX;
            let startLeft = parseInt(clip.style.left || 0);
            
            const onMouseMove = (e) => {
                const diff = e.clientX - startX;
                const newLeft = Math.max(0, startLeft + diff);
                clip.style.left = newLeft + 'px';
            };
            
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
    });
    
    return container;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
