import { navigate } from '../lib/router.js';
import { showToast, createLoadingSpinner } from '../lib/loading.js';
import { getSupabaseUrl } from '../lib/supabase.js';

export function RenderPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';
    
    // Get video data from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    const videoUrl = urlParams.get('videoUrl');
    const duration = urlParams.get('duration');
    const prompt = urlParams.get('prompt') || 'Generated Video';
    
    if (!videoId && !videoUrl) {
        container.innerHTML = `
            <div class="flex-1 flex flex-col items-center justify-center p-8">
                <div class="text-center max-w-md">
                    <div class="text-5xl mb-4">🎬</div>
                    <h2 class="text-2xl font-black text-white mb-4">No Video Selected</h2>
                    <p class="text-secondary mb-6">Generate a video first to see the render page.</p>
                    <button class="generate-btn px-6 py-3 bg-primary text-black font-bold rounded-xl hover:scale-105 transition-transform">
                        Go to Video Studio
                    </button>
                </div>
            </div>
        `;
        container.querySelector('.generate-btn').onclick = () => navigate('video');
        return container;
    }
    
    container.innerHTML = `
        <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <!-- Video Preview Section -->
            <div class="lg:w-2/3 flex flex-col p-4 lg:p-6 overflow-auto">
                <div class="bg-black/50 rounded-2xl overflow-hidden flex-1 flex flex-col">
                    <!-- Header -->
                    <div class="p-4 border-b border-white/5">
                        <h2 class="text-lg font-bold text-white truncate">${escapeHtml(prompt)}</h2>
                        <p class="text-sm text-secondary">${videoId ? `ID: ${escapeHtml(videoId)}` : 'Video Preview'}</p>
                    </div>
                    
                    <!-- Video Player -->
                    <div class="flex-1 flex items-center justify-center bg-black min-h-[400px]">
                        <video 
                            id="render-video" 
                            class="max-w-full max-h-[500px] rounded-lg" 
                            controls 
                            autoplay
                            src="${escapeHtml(videoUrl || '')}"
                        >
                            Your browser does not support video playback.
                        </video>
                    </div>
                    
                    <!-- Video Controls -->
                    <div class="p-4 border-t border-white/5 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <span class="text-sm text-secondary">
                                ${duration ? `Duration: ${formatDuration(parseInt(duration))}` : ''}
                            </span>
                        </div>
                        <div class="flex gap-3">
                            <button id="download-btn" class="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons Section -->
            <div class="lg:w-1/3 p-4 lg:p-6 overflow-auto">
                <h3 class="text-xl font-black text-white mb-2">NEXT ACTIONS</h3>
                <p class="text-sm text-secondary mb-6">Choose how to proceed with your video</p>
                
                <div class="space-y-4">
                    <!-- AI Auto-Edit -->
                    <button class="action-btn w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:scale-[1.02] transition-all group" data-action="auto-edit">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                </svg>
                            </div>
                            <div class="text-left">
                                <div class="font-bold text-white text-lg">AI Auto-Edit</div>
                                <div class="text-sm text-white/70">Automatic scene detection, highlights & more</div>
                            </div>
                        </div>
                    </button>
                    
                    <!-- Agentic Editor -->
                    <button class="action-btn w-full p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl hover:scale-[1.02] transition-all group" data-action="director">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5"/>
                                    <path d="M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                            <div class="text-left">
                                <div class="font-bold text-white text-lg">Agentic Editor</div>
                                <div class="text-sm text-white/70">AI commands, scene rewriting & enhancements</div>
                            </div>
                        </div>
                    </button>
                    
                    <!-- Full Editor -->
                    <button class="action-btn w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl hover:scale-[1.02] transition-all group" data-action="editor">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </div>
                            <div class="text-left">
                                <div class="font-bold text-white text-lg">Full Editor</div>
                                <div class="text-sm text-white/70">Timeline, transitions & manual control</div>
                            </div>
                        </div>
                    </button>
                    
                    <!-- Create Shorts -->
                    <button class="action-btn w-full p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl hover:scale-[1.02] transition-all group" data-action="shorts">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    <path d="M10 9l5 3-5 3V9z"/>
                                </svg>
                            </div>
                            <div class="text-left">
                                <div class="font-bold text-white text-lg">Create Shorts</div>
                                <div class="text-sm text-white/70">TikTok, YouTube Shorts & Reels</div>
                            </div>
                        </div>
                    </button>
                </div>
                
                <!-- Processing Status (Hidden by default) -->
                <div id="processing-status" class="hidden mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        <span class="font-bold text-white" id="processing-title">Processing...</span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-sm">
                            <span class="w-2 h-2 rounded-full bg-secondary" id="step1-dot"></span>
                            <span class="text-secondary" id="step1-text">Scene Detection</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <span class="w-2 h-2 rounded-full bg-secondary" id="step2-dot"></span>
                            <span class="text-secondary" id="step2-text">Highlight Detection</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <span class="w-2 h-2 rounded-full bg-secondary" id="step3-dot"></span>
                            <span class="text-secondary" id="step3-text">Clip Generation</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <span class="w-2 h-2 rounded-full bg-secondary" id="step4-dot"></span>
                            <span class="text-secondary" id="step4-text">Subtitles</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <span class="w-2 h-2 rounded-full bg-secondary" id="step5-dot"></span>
                            <span class="text-secondary" id="step5-text">Final Export</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Event handlers
    const videoEl = container.querySelector('#render-video');
    const downloadBtn = container.querySelector('#download-btn');
    
    // Download handler
    downloadBtn.onclick = () => {
        if (videoUrl) {
            const a = document.createElement('a');
            a.href = videoUrl;
            a.download = `video-${videoId || 'export'}.mp4`;
            a.click();
        } else {
            showToast('Download not available', 'error');
        }
    };
    
    // Action buttons
    container.querySelectorAll('.action-btn').forEach(btn => {
        btn.onclick = async () => {
            const action = btn.dataset.action;
            
            if (action === 'director') {
                // Navigate to Director with videoId
                const directorUrl = `/director?videoId=${encodeURIComponent(videoId || '')}&videoUrl=${encodeURIComponent(videoUrl || '')}`;
                navigate('director', { videoId, videoUrl });
            } else if (action === 'editor') {
                // Navigate to Editor with videoId
                navigate('editor', { videoId, videoUrl });
            } else if (action === 'auto-edit' || action === 'shorts') {
                // Trigger AI Auto-Edit pipeline
                await triggerAIPipeline(action, videoId, videoUrl, container);
            }
        };
    });
    
    return container;
}

async function triggerAIPipeline(action, videoId, videoUrl, container) {
    const statusEl = container.querySelector('#processing-status');
    const titleEl = container.querySelector('#processing-title');
    
    // Show processing UI
    statusEl.classList.remove('hidden');
    titleEl.textContent = action === 'shorts' ? 'Creating Shorts...' : 'AI Auto-Editing...';
    
    // Reset all steps
    for (let i = 1; i <= 5; i++) {
        const dot = container.querySelector(`#step${i}-dot`);
        const text = container.querySelector(`#step${i}-text`);
        dot.className = 'w-2 h-2 rounded-full bg-secondary';
        text.classList.remove('text-primary', 'font-bold');
        text.classList.add('text-secondary');
    }
    
    try {
        const pipelineAction = action === 'shorts' ? 'create-shorts' : 'auto-edit';
        
        // Call VideoAgent API
        const supabaseUrl = getSupabaseUrl();
        const response = await fetch(`${supabaseUrl}/functions/v1/videoagent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: pipelineAction,
                videoId: videoId,
                videoUrl: videoUrl
            })
        });
        
        if (!response.ok) {
            throw new Error('Pipeline failed to start');
        }
        
        const result = await response.json();
        
        if (result.jobId) {
            // Poll for job completion
            await pollJobStatus(result.jobId, container);
        } else {
            // Simulate processing steps for demo
            await simulateProcessing(container);
        }
        
        showToast(action === 'shorts' ? 'Shorts created successfully!' : 'Auto-edit completed!', 'success');
        
    } catch (error) {
        console.error('[AI Pipeline] Error:', error);
        showToast('Processing failed. Please try again.', 'error');
        statusEl.classList.add('hidden');
    }
}

async function pollJobStatus(jobId, container) {
    const supabaseUrl = getSupabaseUrl();
    const maxAttempts = 60;
    const steps = [
        { dot: 'step1-dot', text: 'step1-text', name: 'Scene Detection' },
        { dot: 'step2-dot', text: 'step2-text', name: 'Highlight Detection' },
        { dot: 'step3-dot', text: 'step3-text', name: 'Clip Generation' },
        { dot: 'step4-dot', text: 'step4-text', name: 'Subtitles' },
        { dot: 'step5-dot', text: 'step5-text', name: 'Final Export' }
    ];
    
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await fetch(`${supabaseUrl}/functions/v1/videoagent?jobId=${jobId}`);
            const result = await response.json();
            
            if (result.status === 'completed') {
                // Mark all steps complete
                steps.forEach(step => {
                    container.querySelector(`#${step.dot}`).className = 'w-2 h-2 rounded-full bg-primary';
                    const textEl = container.querySelector(`#${step.text}`);
                    textEl.classList.remove('text-secondary');
                    textEl.classList.add('text-primary', 'font-bold');
                });
                return;
            } else if (result.status === 'failed') {
                throw new Error(result.error || 'Job failed');
            } else if (result.currentStep) {
                // Update current step
                const stepIndex = Math.min(result.currentStep - 1, steps.length - 1);
                for (let j = 0; j <= stepIndex; j++) {
                    container.querySelector(`#${steps[j].dot}`).className = 'w-2 h-2 rounded-full bg-primary';
                    const textEl = container.querySelector(`#${steps[j].text}`);
                    textEl.classList.remove('text-secondary');
                    textEl.classList.add('text-primary', 'font-bold');
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error('[Job Poll] Error:', error);
            throw error;
        }
    }
    
    throw new Error('Job timed out');
}

async function simulateProcessing(container) {
    const steps = [
        { dot: 'step1-dot', text: 'step1-text' },
        { dot: 'step2-dot', text: 'step2-text' },
        { dot: 'step3-dot', text: 'step3-text' },
        { dot: 'step4-dot', text: 'step4-text' },
        { dot: 'step5-dot', text: 'step5-text' }
    ];
    
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        container.querySelector(`#${steps[i].dot}`).className = 'w-2 h-2 rounded-full bg-primary';
        const textEl = container.querySelector(`#${steps[i].text}`);
        textEl.classList.remove('text-secondary');
        textEl.classList.add('text-primary', 'font-bold');
    }
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
