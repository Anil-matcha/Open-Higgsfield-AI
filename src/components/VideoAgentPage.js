import { navigate } from '../lib/router.js';
import { showToast } from '../lib/loading.js';

export function VideoAgentPage() {
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
                    <h1 class="text-xl font-black text-white">VIDEOAGENT</h1>
                    <p class="text-sm text-secondary">AI Processing Engine</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-bold rounded-full">AI POWERED</span>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Left: Video Preview -->
            <div class="flex-1 flex flex-col p-4 overflow-auto">
                <div class="bg-black/50 rounded-2xl overflow-hidden flex-1 flex flex-col min-h-[400px]">
                    <div class="flex-1 flex items-center justify-center">
                        <video 
                            id="videoagent-video" 
                            class="max-w-full max-h-[400px] rounded-lg" 
                            controls
                            src="${escapeHtml(videoUrl)}"
                        >
                            Your browser does not support video playback.
                        </video>
                    </div>
                </div>
            </div>
            
            <!-- Right Panel - Processing Options -->
            <div class="w-96 border-l border-white/5 p-4 overflow-auto">
                <h3 class="font-bold text-white mb-2">AI PROCESSING</h3>
                <p class="text-sm text-secondary mb-6">Automated video processing pipeline</p>
                
                <!-- Processing Cards -->
                <div class="space-y-4">
                    <!-- Scene Detection -->
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-400">
                                    <rect x="3" y="3" width="7" height="7"/>
                                    <rect x="14" y="3" width="7" height="7"/>
                                    <rect x="3" y="14" width="7" height="7"/>
                                    <rect x="14" y="14" width="7" height="7"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white">Scene Detection</div>
                                <div class="text-xs text-secondary">Identify scene boundaries</div>
                            </div>
                        </div>
                        <button class="run-btn w-full py-2 bg-blue-600/20 text-blue-400 font-bold rounded-lg hover:bg-blue-600/30 transition-colors text-sm">
                            Run Detection
                        </button>
                    </div>
                    
                    <!-- Clip Segmentation -->
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-400">
                                    <rect x="2" y="2" width="20" height="16" rx="2"/>
                                    <path d="M10 9l5 3-5 3V9z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white">Clip Segmentation</div>
                                <div class="text-xs text-secondary">Split into clip segments</div>
                            </div>
                        </div>
                        <button class="run-btn w-full py-2 bg-purple-600/20 text-purple-400 font-bold rounded-lg hover:bg-purple-600/30 transition-colors text-sm">
                            Segment Clips
                        </button>
                    </div>
                    
                    <!-- Highlight Detection -->
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-orange-400">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white">Highlight Detection</div>
                                <div class="text-xs text-secondary">Find key moments</div>
                            </div>
                        </div>
                        <button class="run-btn w-full py-2 bg-orange-600/20 text-orange-400 font-bold rounded-lg hover:bg-orange-600/30 transition-colors text-sm">
                            Find Highlights
                        </button>
                    </div>
                    
                    <!-- Processing Queue -->
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-400">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-white">Processing Queue</div>
                                <div class="text-xs text-secondary">Async job management</div>
                            </div>
                        </div>
                        <div id="queue-list" class="space-y-2 max-h-32 overflow-auto">
                            <div class="text-sm text-secondary italic">No jobs in queue</div>
                        </div>
                    </div>
                </div>
                
                <!-- Full Pipeline -->
                <div class="mt-6">
                    <button id="run-full-pipeline" class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        Run Full Pipeline
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Event handlers
    container.querySelector('#back-btn').onclick = () => {
        navigate('render', { videoId, videoUrl });
    };
    
    // Run buttons
    container.querySelectorAll('.run-btn').forEach(btn => {
        btn.onclick = () => {
            btn.disabled = true;
            btn.textContent = 'Processing...';
            
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = 'Run Again';
                showToast('Processing complete!', 'success');
            }, 2000);
        };
    });
    
    // Full pipeline button
    container.querySelector('#run-full-pipeline').onclick = async () => {
        const btn = container.querySelector('#run-full-pipeline');
        btn.disabled = true;
        btn.innerHTML = `
            <div class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            Processing...
        `;
        
        // Show progress
        const queueEl = container.querySelector('#queue-list');
        queueEl.innerHTML = '';
        
        const jobs = ['Scene Detection', 'Clip Segmentation', 'Highlight Detection', 'Subtitle Generation', 'Final Export'];
        
        for (let i = 0; i < jobs.length; i++) {
            const jobEl = document.createElement('div');
            jobEl.className = 'flex items-center gap-2 text-sm';
            jobEl.innerHTML = `
                <div class="animate-spin w-3 h-3 border border-purple-400 border-t-transparent rounded-full"></div>
                <span class="text-white">${jobs[i]}</span>
            `;
            queueEl.appendChild(jobEl);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mark as complete
            jobEl.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-400">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span class="text-secondary">${jobs[i]}</span>
            `;
        }
        
        btn.disabled = false;
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Pipeline Complete
        `;
        
        showToast('Full pipeline completed!', 'success');
    };
    
    return container;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
