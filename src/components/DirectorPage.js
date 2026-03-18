import { navigate } from '../lib/router.js';
import { showToast } from '../lib/loading.js';

export function DirectorPage() {
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
                    <h1 class="text-xl font-black text-white">DIRECTOR</h1>
                    <p class="text-sm text-secondary">Agentic AI Editor</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-sm text-secondary">${videoId ? `Video: ${escapeHtml(videoId)}` : ''}</span>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Video Preview -->
            <div class="flex-1 flex flex-col p-4 overflow-auto">
                <div class="bg-black/50 rounded-2xl overflow-hidden flex-1 flex flex-col min-h-[400px]">
                    <div class="flex-1 flex items-center justify-center">
                        <video 
                            id="director-video" 
                            class="max-w-full max-h-[400px] rounded-lg" 
                            controls
                            src="${escapeHtml(videoUrl)}"
                        >
                            Your browser does not support video playback.
                        </video>
                    </div>
                </div>
                
                <!-- Command Input -->
                <div class="mt-4">
                    <div class="flex gap-3">
                        <input 
                            type="text" 
                            id="command-input" 
                            placeholder="Enter AI command (e.g., 'Add subtitles', 'Make it cinematic', 'Add b-roll')"
                            class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-primary/50"
                        >
                        <button id="send-command-btn" class="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:scale-105 transition-transform">
                            Send
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Right Panel - Tools -->
            <div class="w-80 border-l border-white/5 p-4 overflow-auto">
                <h3 class="font-bold text-white mb-4">AI TOOLS</h3>
                
                <div class="space-y-3">
                    <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="subtitles">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    <path d="M7 12h10M7 8h6"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white text-sm">Add Subtitles</div>
                                <div class="text-xs text-secondary">Auto-generate captions</div>
                            </div>
                        </div>
                    </button>
                    
                    <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="highlights">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white text-sm">Extract Highlights</div>
                                <div class="text-xs text-secondary">Find key moments</div>
                            </div>
                        </div>
                    </button>
                    
                    <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="scenes">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="7" height="7"/>
                                    <rect x="14" y="3" width="7" height="7"/>
                                    <rect x="3" y="14" width="7" height="7"/>
                                    <rect x="14" y="14" width="7" height="7"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white text-sm">Scene Detection</div>
                                <div class="text-xs text-secondary">Identify scenes</div>
                            </div>
                        </div>
                    </button>
                    
                    <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="overlay">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <path d="M21 15l-5-5L5 21"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white text-sm">Add Overlay</div>
                                <div class="text-xs text-secondary">Graphics & text</div>
                            </div>
                        </div>
                    </button>
                    
                    <button class="tool-btn w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left" data-tool="clip">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-pink-600/20 rounded-lg flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="2" width="20" height="16" rx="2"/>
                                    <path d="M10 9l5 3-5 3V9z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white text-sm">Create Clip</div>
                                <div class="text-xs text-secondary">Generate short clip</div>
                            </div>
                        </div>
                    </button>
                </div>
                
                <!-- Recent Commands -->
                <div class="mt-6">
                    <h4 class="font-bold text-white text-sm mb-3">RECENT COMMANDS</h4>
                    <div id="command-history" class="space-y-2">
                        <div class="text-sm text-secondary italic">No commands yet</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Event handlers
    container.querySelector('#back-btn').onclick = () => {
        navigate('render', { videoId, videoUrl });
    };
    
    const commandInput = container.querySelector('#command-input');
    const sendCommandBtn = container.querySelector('#send-command-btn');
    
    const sendCommand = () => {
        const command = commandInput.value.trim();
        if (!command) return;
        
        // Add to history
        const historyEl = container.querySelector('#command-history');
        if (historyEl.querySelector('.italic')) {
            historyEl.innerHTML = '';
        }
        
        const cmdEl = document.createElement('div');
        cmdEl.className = 'p-2 bg-white/5 rounded-lg text-sm text-white';
        cmdEl.textContent = command;
        historyEl.insertBefore(cmdEl, historyEl.firstChild);
        
        commandInput.value = '';
        showToast('Command sent to AI', 'info');
    };
    
    sendCommandBtn.onclick = sendCommand;
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendCommand();
    });
    
    // Tool buttons
    container.querySelectorAll('.tool-btn').forEach(btn => {
        btn.onclick = () => {
            const tool = btn.dataset.tool;
            showToast(`Starting ${tool}...`, 'info');
        };
    });
    
    return container;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
