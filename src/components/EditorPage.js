import { navigate } from '../lib/router.js';
import { showToast } from '../lib/loading.js';

export function EditorPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col overflow-hidden';
    
    // Get video data from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId') || '';
    const videoUrl = urlParams.get('videoUrl') || '';
    
    container.innerHTML = `
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-white/5">
            <div class="flex items-center gap-4">
                <button id="back-btn" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div>
                    <h1 class="text-xl font-black text-white">EDITOR</h1>
                    <p class="text-sm text-secondary">Full Drag & Drop Timeline</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button id="undo-btn" class="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Undo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 7v6h6"/>
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                    </svg>
                </button>
                <button id="redo-btn" class="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Redo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 7v6h-6"/>
                        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
                    </svg>
                </button>
                <button id="export-btn" class="px-4 py-2 bg-primary text-black font-bold rounded-xl hover:scale-105 transition-transform">
                    Export
                </button>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Video Preview Area -->
            <div class="flex-1 flex flex-col">
                <!-- Preview -->
                <div class="flex-1 flex items-center justify-center bg-black p-4">
                    <video 
                        id="editor-video" 
                        class="max-w-full max-h-full rounded-lg" 
                        controls
                        src="${escapeHtml(videoUrl)}"
                    >
                        Your browser does not support video playback.
                    </video>
                </div>
                
                <!-- Timeline -->
                <div class="h-64 border-t border-white/5 bg-black/50 p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-secondary font-bold">TIMELINE</span>
                        <div class="flex gap-2">
                            <button class="timeline-zoom p-1 hover:bg-white/10 rounded">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="M21 21l-4.35-4.35M8 11h6"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Timeline Track -->
                    <div class="relative h-32 bg-white/5 rounded-xl overflow-hidden">
                        <!-- Time Ruler -->
                        <div class="h-6 border-b border-white/10 flex items-end text-xs text-secondary px-2">
                            <span class="w-16">0:00</span>
                            <span class="w-16">0:15</span>
                            <span class="w-16">0:30</span>
                            <span class="w-16">0:45</span>
                            <span class="w-16">1:00</span>
                        </div>
                        
                        <!-- Video Track -->
                        <div class="h-20 flex items-center px-2">
                            <div class="h-16 w-32 bg-blue-600/50 rounded-lg flex items-center justify-center cursor-move hover:bg-blue-600/70 transition-colors">
                                <span class="text-xs text-white font-bold">Video 1</span>
                            </div>
                        </div>
                        
                        <!-- Playhead -->
                        <div class="absolute top-0 bottom-0 w-0.5 bg-primary cursor-ew-resize" style="left: 80px;">
                            <div class="absolute -top-0 -left-1 w-3 h-3 bg-primary rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Panel - Tools -->
            <div class="w-72 border-l border-white/5 p-4 overflow-auto">
                <!-- Media Library -->
                <div class="mb-6">
                    <h3 class="font-bold text-white mb-3">MEDIA</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="aspect-video bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                        </div>
                        <div class="aspect-video bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-secondary">
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                                <circle cx="12" cy="13" r="3"/>
                            </svg>
                        </div>
                    </div>
                    <button class="mt-2 w-full py-2 border border-dashed border-white/20 rounded-lg text-sm text-secondary hover:bg-white/5 transition-colors">
                        + Add Media
                    </button>
                </div>
                
                <!-- Transitions -->
                <div class="mb-6">
                    <h3 class="font-bold text-white mb-3">TRANSITIONS</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <button class="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-xs text-center text-secondary">
                            Fade
                        </button>
                        <button class="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-xs text-center text-secondary">
                            Dissolve
                        </button>
                        <button class="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-xs text-center text-secondary">
                            Wipe
                        </button>
                        <button class="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-xs text-center text-secondary">
                            Slide
                        </button>
                        <button class="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-xs text-center text-secondary">
                            Zoom
                        </button>
                        <button class="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-xs text-center text-secondary">
                            Custom
                        </button>
                    </div>
                </div>
                
                <!-- Text & Graphics -->
                <div class="mb-6">
                    <h3 class="font-bold text-white mb-3">TEXT & GRAPHICS</h3>
                    <div class="space-y-2">
                        <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="text">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                                <span class="text-sm text-white">Add Text</span>
                            </div>
                        </button>
                        <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="subtitle">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                                        <path d="M7 12h10M7 8h6"/>
                                    </svg>
                                </div>
                                <span class="text-sm text-white">Subtitles</span>
                            </div>
                        </button>
                        <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="sticker">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                                    </svg>
                                </div>
                                <span class="text-sm text-white">Stickers</span>
                            </div>
                        </button>
                    </div>
                </div>
                
                <!-- Audio -->
                <div>
                    <h3 class="font-bold text-white mb-3">AUDIO</h3>
                    <div class="space-y-2">
                        <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="music">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 18V5l12-2v13"/>
                                        <circle cx="6" cy="18" r="3"/>
                                        <circle cx="18" cy="16" r="3"/>
                                    </svg>
                                </div>
                                <span class="text-sm text-white">Add Music</span>
                            </div>
                        </button>
                        <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="voiceover">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                        <line x1="12" y1="19" x2="12" y2="23"/>
                                        <line x1="8" y1="23" x2="16" y2="23"/>
                                    </svg>
                                </div>
                                <span class="text-sm text-white">Voiceover</span>
                            </div>
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
    
    container.querySelector('#undo-btn').onclick = () => {
        showToast('Undo', 'info');
    };
    
    container.querySelector('#redo-btn').onclick = () => {
        showToast('Redo', 'info');
    };
    
    container.querySelector('#export-btn').onclick = () => {
        showToast('Exporting video...', 'info');
    };
    
    // Tool buttons
    container.querySelectorAll('.tool-btn').forEach(btn => {
        btn.onclick = () => {
            const tool = btn.dataset.tool;
            showToast(`Opening ${tool}...`, 'info');
        };
    });
    
    return container;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
