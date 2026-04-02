import { navigate } from '../lib/router.js';
import { showToast } from '../lib/loading.js';
import { createHeroSection } from '../lib/thumbnails.js';
import { getSupabaseUrl, isSupabaseConfigured } from '../lib/supabase.js';

const AI_TOOLS = [
    { id: 'scene-detection', name: 'Scene Detection', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/></svg>', thumbnail: '/thumbnails/videoagent/scene-detection.png', color: 'blue', description: 'Identify scene boundaries', category: 'understanding' },
    { id: 'clip-segmentation', name: 'Clip Segmentation', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="8" height="16" rx="1"/><rect x="14" y="4" width="8" height="16" rx="1"/><line x1="12" y1="4" x2="12" y2="20" stroke-dasharray="2 2"/></svg>', thumbnail: '/thumbnails/videoagent/clip-segmentation.png', color: 'purple', description: 'Split into clip segments', category: 'editing' },
    { id: 'highlight-detection', name: 'Highlight Detection', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', thumbnail: '/thumbnails/videoagent/highlight-detection.png', color: 'orange', description: 'Find key moments', category: 'understanding' },
    { id: 'cosyvoice', name: 'CosyVoice', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>', thumbnail: '/thumbnails/videoagent/cosyvoice.png', color: 'pink', description: 'Voice cloning & TTS', category: 'audio' },
    { id: 'fish-speech', name: 'Fish Speech', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M2 10c1.5-1 3-1.5 4.5-1s3 1.5 4.5 1 3-1.5 4.5-1 3 1 4.5 1"/></svg>', thumbnail: '/thumbnails/videoagent/fish-speech.png', color: 'cyan', description: 'Voice synthesis', category: 'audio' },
    { id: 'seed-vc', name: 'Seed-VC', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 3l-7 7"/><path d="M3 3l7 7"/><path d="M3 21l7-7"/><path d="M21 21l-7-7"/></svg>', thumbnail: '/thumbnails/videoagent/seed-vc.png', color: 'teal', description: 'Voice conversion', category: 'audio' },
    { id: 'whisper', name: 'Whisper', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', thumbnail: '/thumbnails/videoagent/whisper.png', color: 'green', description: 'Audio transcription', category: 'audio' },
    { id: 'imagebind', name: 'ImageBind', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>', thumbnail: '/thumbnails/videoagent/imagebind.png', color: 'indigo', description: 'Multimodal understanding', category: 'understanding' },
    { id: 'dubbing', name: 'Cross-lingual Dub', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>', thumbnail: '/thumbnails/videoagent/dubbing.png', color: 'yellow', description: 'Translate & dub video', category: 'translate' },
    { id: 'color-correct', name: 'Color Correction', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22c-4.97 0-9-2.69-9-6v-.01C3 12.2 7.03 8.6 12 8.6s9 3.6 9 7.39V16c0 3.31-4.03 6-9 6z"/></svg>', thumbnail: '/thumbnails/videoagent/color-correct.png', color: 'rose', description: 'Adjust colors & tones', category: 'enhance' },
    { id: 'upscale', name: 'Video Upscale', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', thumbnail: '/thumbnails/videoagent/upscale.png', color: 'emerald', description: 'Enhance resolution', category: 'enhance' },
    { id: 'stabilize', name: 'Stabilize', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>', thumbnail: '/thumbnails/videoagent/stabilize.png', color: 'violet', description: 'Fix shaky footage', category: 'enhance' },
];

const USE_CASES = [
    { id: 'standup', name: 'Stand-up Comedy', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>', thumbnail: '/thumbnails/videoagent/standup.png', description: 'Transform video with comedy timing' },
    { id: 'commentary', name: 'Commentary', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', thumbnail: '/thumbnails/videoagent/commentary.png', description: 'Add AI commentary overlay' },
    { id: 'overview', name: 'Video Overview', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', thumbnail: '/thumbnails/videoagent/overview.png', description: 'Generate summary overview' },
    { id: 'meme', name: 'Meme Generator', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10"/><path d="M7 12h4"/><path d="M7 16h6"/></svg>', thumbnail: '/thumbnails/videoagent/meme.png', description: 'Create meme videos' },
    { id: 'music-video', name: 'Music Video', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>', thumbnail: '/thumbnails/videoagent/music-video.png', description: 'Set video to music' },
    { id: 'qa', name: 'Video Q&A', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', thumbnail: '/thumbnails/videoagent/qa.png', description: 'Interactive video Q&A' },
];

export function VideoAgentPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col items-center justify-center bg-app-bg relative p-4 md:p-6 overflow-y-auto custom-scrollbar overflow-x-hidden';

    // AbortController for cancelling async operations
    const abortController = new AbortController();

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId') || '';
    const videoUrl = urlParams.get('videoUrl') || '';
    
    let processingQueue = [];
    let isProcessing = false;
    
    // ==========================================
    // 1. HERO SECTION
    // ==========================================
    const hero = document.createElement('div');
    hero.className = 'flex flex-col items-center mb-8 md:mb-12 animate-fade-in-up transition-all duration-700 w-full max-w-5xl';
    const heroBanner = createHeroSection('videoagent', 'h-32 md:h-44 mb-4');
    if (heroBanner) {
        const heroContent = document.createElement('div');
        heroContent.className = 'absolute bottom-0 left-0 right-0 p-6 z-10';
        heroContent.innerHTML = `
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-1">VideoAgent</h1>
            <p class="text-white/60 text-sm font-medium">AI-powered video processing & enhancement</p>
        `;
        heroBanner.appendChild(heroContent);
        hero.appendChild(heroBanner);
    }
    container.appendChild(hero);
    
    // Main content wrapper with max-width
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'w-full max-w-5xl relative z-40 animate-fade-in-up';
    contentWrapper.style.animationDelay = '0.1s';
    
    contentWrapper.innerHTML = `
        <!-- Back Button -->
        <div class="mb-6">
            <button id="back-btn" class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/70 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Video
            </button>
        </div>
        
        <!-- Main Content -->
        <div class="flex flex-col lg:flex-row gap-6">
            <!-- Left: Video Preview + Use Cases -->
            <div class="flex-1 flex flex-col">
                <!-- Video Preview Card -->
                <div class="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-4 md:p-6 shadow-3xl mb-6">
                    <div class="aspect-video flex items-center justify-center bg-black rounded-xl overflow-hidden">
                        ${videoUrl ? `
                            <video 
                                id="videoagent-video" 
                                class="max-w-full max-h-full" 
                                controls
                                src="${escapeHtml(videoUrl)}"
                            >
                                Your browser does not support video playback.
                            </video>
                        ` : `
                            <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
                                <img src="/thumbnails/videoagent/empty-video.png" alt="No video loaded" class="absolute inset-0 w-full h-full object-cover opacity-40" onerror="this.style.display='none'" />
                                <div class="relative text-center p-8 z-10">
                                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-muted mx-auto mb-4">
                                        <polygon points="5 3 19 12 5 21 5 3"/>
                                    </svg>
                                    <p class="text-white/50">No video loaded</p>
                                    <p class="text-xs text-muted mt-2">Generate a video first to process</p>
                                </div>
                            </div>
                        `}
                    </div>
                </div>
                
                <!-- Use Cases -->
                <div class="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] overflow-hidden shadow-3xl">
                    <div class="relative w-full h-28 overflow-hidden">
                        <img src="/thumbnails/videoagent/header-use-cases.png" alt="AI Use Cases" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/50 to-transparent"></div>
                        <h3 class="absolute bottom-3 left-5 font-black text-white text-sm tracking-wide z-10">AI USE CASES</h3>
                    </div>
                    <div class="p-4 md:p-6 pt-4">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        ${USE_CASES.map(uc => `
                            <button class="usecase-btn overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer" data-usecase="${uc.id}">
                                <div class="relative w-full aspect-square overflow-hidden">
                                    <img src="${uc.thumbnail}" alt="${uc.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                    <div class="absolute bottom-0 left-0 right-0 p-3">
                                        <div class="font-bold text-white text-sm">${uc.name}</div>
                                        <div class="text-[10px] text-white/60">${uc.description}</div>
                                    </div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                    </div>
                </div>
                
                <!-- Processing Results -->
                <div id="results-panel" class="mt-6 hidden">
                    <h3 class="font-black text-white mb-3 text-sm tracking-wide">PROCESSING RESULTS</h3>
                    <div id="results-content" class="space-y-2">
                    </div>
                </div>
            </div>
            
            <!-- Right Panel - AI Tools -->
            <div class="w-full lg:w-96 flex-shrink-0">
                <div class="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] overflow-hidden shadow-3xl">
                    <!-- Tools Header Banner -->
                    <div class="relative w-full h-28 overflow-hidden">
                        <img src="/thumbnails/videoagent/header-tools.png" alt="AI Processing Tools" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/50 to-transparent"></div>
                        <h3 class="absolute bottom-3 left-5 font-black text-white text-sm tracking-wide z-10">AI PROCESSING TOOLS</h3>
                    </div>
                    <div class="p-4 md:p-6 pt-4">
                    <!-- Category Tabs -->
                    <div class="flex border-b border-white/10 mb-4 -mx-4 px-4">
                        <button class="category-tab flex-1 py-2 text-xs font-bold text-primary border-b-2 border-primary" data-category="all">
                            ALL
                        </button>
                        <button class="category-tab flex-1 py-2 text-xs font-bold text-muted hover:text-white" data-category="understanding">
                            UNDERSTAND
                        </button>
                        <button class="category-tab flex-1 py-2 text-xs font-bold text-muted hover:text-white" data-category="editing">
                            EDIT
                        </button>
                        <button class="category-tab flex-1 py-2 text-xs font-bold text-muted hover:text-white" data-category="audio">
                            AUDIO
                        </button>
                    </div>
                    
                    <!-- AI Tools Grid -->
                    <div id="tools-grid" class="grid grid-cols-2 gap-3 mb-6">
                        ${AI_TOOLS.map(tool => `
                            <button class="tool-btn overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer" data-tool="${tool.id}" data-category="${tool.category}">
                                <div class="relative w-full aspect-square overflow-hidden">
                                    <img src="${tool.thumbnail}" alt="${tool.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                    <div class="absolute bottom-0 left-0 right-0 p-2.5">
                                        <div class="font-bold text-white text-xs">${tool.name}</div>
                                        <div class="text-[9px] text-white/60">${tool.description}</div>
                                    </div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                    
                    <!-- Processing Queue -->
                    <div class="border-t border-white/10 pt-4 mb-4">
                        <h3 class="font-black text-white mb-3 text-sm flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            PROCESSING QUEUE
                        </h3>
                        <div id="queue-list" class="space-y-2 max-h-40 overflow-auto">
                            <div class="text-sm text-muted italic p-2">No jobs in queue</div>
                        </div>
                    </div>
                    
                    <!-- Full Pipeline -->
                    <button id="run-full-pipeline" class="w-full py-4 bg-primary text-black font-black rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        Run Full Pipeline
                    </button>
                    
                    <!-- Settings -->
                    <div class="border-t border-white/10 pt-4">
                        <h4 class="font-black text-white text-sm mb-3">SETTINGS</h4>
                        <div class="space-y-3">
                            <div>
                                <label class="text-xs text-muted block mb-1">Output Quality</label>
                                <select class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white">
                                    <option>720p</option>
                                    <option selected>1080p</option>
                                    <option>4K</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs text-muted block mb-1">Output Format</label>
                                <select class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white">
                                    <option selected>MP4</option>
                                    <option>WebM</option>
                                    <option>MOV</option>
                                </select>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-muted">Auto-save results</span>
                                <button class="w-10 h-5 bg-primary rounded-full relative">
                                    <span class="absolute right-0.5 top-0.5 w-4 h-4 bg-black rounded-full"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Processing Modal -->
        <div id="processing-modal" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 hidden">
            <div class="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-3xl">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                    <h3 class="text-xl font-black text-white mb-2">Processing Video</h3>
                    <p id="processing-name" class="text-sm text-muted">Initializing...</p>
                </div>
                
                <div class="mb-6">
                    <div class="flex justify-between text-xs mb-2">
                        <span class="text-muted">Progress</span>
                        <span id="processing-percent" class="text-primary font-black">0%</span>
                    </div>
                    <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div id="modal-progress-bar" class="h-full bg-primary transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
                
                <div id="processing-steps" class="space-y-2 mb-6">
                </div>
                
                <button id="cancel-processing" class="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    // Append content wrapper
    container.appendChild(contentWrapper);
    
    // Event handlers
    container.querySelector('#back-btn').onclick = () => {
        navigate('render', { videoId, videoUrl });
    };
    
    // Category tabs
    container.querySelectorAll('.category-tab').forEach(tab => {
        tab.onclick = () => {
            container.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('text-primary', 'border-primary');
                t.classList.add('text-muted');
            });
            tab.classList.remove('text-muted');
            tab.classList.add('text-primary', 'border-primary');
            
            const category = tab.dataset.category;
            container.querySelectorAll('.tool-btn').forEach(btn => {
                if (category === 'all' || btn.dataset.category === category) {
                    btn.style.display = 'block';
                } else {
                    btn.style.display = 'none';
                }
            });
        };
    });
    
    // Tool buttons
    container.querySelectorAll('.tool-btn').forEach(btn => {
        btn.onclick = () => {
            const toolId = btn.dataset.tool;
            const tool = AI_TOOLS.find(t => t.id === toolId);
            runTool(tool);
        };
    });
    
    // Use case buttons
    container.querySelectorAll('.usecase-btn').forEach(btn => {
        btn.onclick = () => {
            const usecaseId = btn.dataset.usecase;
            const usecase = USE_CASES.find(u => u.id === usecaseId);
            runUseCase(usecase);
        };
    });
    
    // Full pipeline button
    container.querySelector('#run-full-pipeline').onclick = async () => {
        await runFullPipeline();
    };
    
    // Cancel processing
    container.querySelector('#cancel-processing').onclick = () => {
        container.querySelector('#processing-modal').classList.add('hidden');
        isProcessing = false;
        showToast('Processing cancelled', 'info');
    };
    
    const runTool = async (tool) => {
        if (isProcessing) {
            showToast('Already processing', 'error');
            return;
        }
        
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
            showToast('Backend not configured. Using offline mode.', 'info');
            await simulateToolProcessing(tool);
            return;
        }
        
        // Validate video is loaded
        if (!videoId && !videoUrl) {
            showToast('Please load a video first', 'error');
            return;
        }
        
        isProcessing = true;
        addToQueue(tool.name, 'pending');
        
        const modal = container.querySelector('#processing-modal');
        const nameEl = container.querySelector('#processing-name');
        const stepsEl = container.querySelector('#processing-steps');
        const progressBar = container.querySelector('#modal-progress-bar');
        const percentEl = container.querySelector('#processing-percent');
        
        nameEl.textContent = tool.description;
        modal.classList.remove('hidden');
        
        try {
            // Call the videoagent API
            const supabaseUrl = getSupabaseUrl();
            const response = await fetch(`${supabaseUrl}/functions/v1/videoagent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'process-tool',
                    tool: tool.id,
                    toolName: tool.name,
                    videoId: videoId,
                    videoUrl: videoUrl,
                    settings: {
                        quality: container.querySelector('select')?.value || '1080p',
                        format: container.querySelectorAll('select')[1]?.value || 'MP4'
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const result = await response.json();
            
            // If we get a jobId, poll for completion
            if (result.jobId) {
                await pollToolJob(result.jobId, tool, stepsEl, progressBar, percentEl, abortController.signal);
            } else if (result.status === 'completed') {
                // Direct completion
                updateProgress(stepsEl, progressBar, percentEl, 100);
                await new Promise(r => setTimeout(r, 500));
            } else {
                // Fallback to simulation if no proper response
                throw new Error('Invalid response');
            }
            
            modal.classList.add('hidden');
            isProcessing = false;
            updateQueueItem(tool.name, 'complete');
            showResults(tool);
            showToast(`${tool.name} completed!`, 'success');
            
        } catch (error) {
            console.error('[VideoAgent] Tool error:', error);
            showToast('Processing failed. Using offline mode.', 'error');
            modal.classList.add('hidden');
            
            // Fallback to simulation
            await simulateToolProcessing(tool);
        }
    };
    
    const runUseCase = async (usecase) => {
        if (isProcessing) {
            showToast('Already processing', 'error');
            return;
        }
        
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
            showToast('Backend not configured. Using offline mode.', 'info');
            await simulateUseCaseProcessing(usecase);
            return;
        }
        
        // Validate video is loaded
        if (!videoId && !videoUrl) {
            showToast('Please load a video first', 'error');
            return;
        }
        
        isProcessing = true;
        addToQueue(usecase.name, 'pending');
        
        const modal = container.querySelector('#processing-modal');
        const nameEl = container.querySelector('#processing-name');
        const stepsEl = container.querySelector('#processing-steps');
        const progressBar = container.querySelector('#modal-progress-bar');
        const percentEl = container.querySelector('#processing-percent');
        
        nameEl.textContent = usecase.description;
        modal.classList.remove('hidden');
        
        try {
            const supabaseUrl = getSupabaseUrl();
            const response = await fetch(`${supabaseUrl}/functions/v1/videoagent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'process-usecase',
                    usecase: usecase.id,
                    usecaseName: usecase.name,
                    videoId: videoId,
                    videoUrl: videoUrl
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.jobId) {
                await pollToolJob(result.jobId, { name: usecase.name }, stepsEl, progressBar, percentEl, abortController.signal);
            } else if (result.status === 'completed') {
                updateProgress(stepsEl, progressBar, percentEl, 100);
                await new Promise(r => setTimeout(r, 500));
            } else {
                throw new Error('Invalid response');
            }
            
            modal.classList.add('hidden');
            isProcessing = false;
            updateQueueItem(usecase.name, 'complete');
            showResults({ name: usecase.name, icon: usecase.icon });
            showToast(`${usecase.name} completed!`, 'success');
            
        } catch (error) {
            console.error('[VideoAgent] UseCase error:', error);
            showToast('Processing failed. Using offline mode.', 'error');
            modal.classList.add('hidden');
            await simulateUseCaseProcessing(usecase);
        }
    };
    
    const runFullPipeline = async () => {
        if (isProcessing) {
            showToast('Already processing', 'error');
            return;
        }
        
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
            showToast('Backend not configured. Using offline mode.', 'info');
            await simulateFullPipeline();
            return;
        }
        
        // Validate video is loaded
        if (!videoId && !videoUrl) {
            showToast('Please load a video first', 'error');
            return;
        }
        
        isProcessing = true;
        
        const modal = container.querySelector('#processing-modal');
        const nameEl = container.querySelector('#processing-name');
        const stepsEl = container.querySelector('#processing-steps');
        const progressBar = container.querySelector('#modal-progress-bar');
        const percentEl = container.querySelector('#processing-percent');
        
        nameEl.textContent = 'Running full AI processing pipeline';
        modal.classList.remove('hidden');
        
        try {
            const supabaseUrl = getSupabaseUrl();
            const response = await fetch(`${supabaseUrl}/functions/v1/videoagent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'full-pipeline',
                    videoId: videoId,
                    videoUrl: videoUrl,
                    settings: {
                        quality: '1080p',
                        format: 'MP4'
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.jobId) {
                await pollPipelineJob(result.jobId, stepsEl, progressBar, percentEl, abortController.signal);
            } else if (result.status === 'completed') {
                updateProgress(stepsEl, progressBar, percentEl, 100);
                await new Promise(r => setTimeout(r, 500));
            } else {
                throw new Error('Invalid response');
            }
            
            modal.classList.add('hidden');
            isProcessing = false;
            showToast('Full pipeline completed!', 'success');
            
        } catch (error) {
            console.error('[VideoAgent] Pipeline error:', error);
            showToast('Pipeline failed. Using offline mode.', 'error');
            modal.classList.add('hidden');
            await simulateFullPipeline();
        }
    };
    
    const addToQueue = (name, status) => {
        processingQueue.push({ name, status, id: Date.now() });
        renderQueue();
    };
    
    const updateQueueItem = (name, status) => {
        const item = processingQueue.find(q => q.name === name);
        if (item) item.status = status;
        renderQueue();
    };
    
    const renderQueue = () => {
        const queueEl = container.querySelector('#queue-list');
        
        if (processingQueue.length === 0) {
            queueEl.innerHTML = '<div class="text-sm text-muted italic p-2">No jobs in queue</div>';
            return;
        }
        
        queueEl.innerHTML = processingQueue.map(item => `
            <div class="flex items-center gap-2 p-2 bg-white/5 rounded-xl">
                ${item.status === 'complete' ? `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-primary">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                ` : item.status === 'running' ? `
                    <div class="animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full"></div>
                ` : `
                    <span class="w-3 h-3 rounded-full bg-muted"></span>
                `}
                <span class="text-xs text-white flex-1">${item.name}</span>
            </div>
        `).join('');
    };
    
    const showResults = (tool) => {
        const resultsPanel = container.querySelector('#results-panel');
        const resultsContent = container.querySelector('#results-content');
        
        resultsPanel.classList.remove('hidden');
        
        const resultEl = document.createElement('div');
        resultEl.className = 'p-3 bg-white/5 rounded-xl flex items-center gap-3';
        resultEl.innerHTML = `
            <div class="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <span class="text-lg">${tool.icon || '✓'}</span>
            </div>
            <div class="flex-1">
                <div class="text-sm text-white font-bold">${tool.name}</div>
                <div class="text-xs text-secondary">Completed successfully</div>
            </div>
            <button class="p-2 hover:bg-white/10 rounded-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-secondary">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </button>
        `;
        
        resultsContent.insertBefore(resultEl, resultsContent.firstChild);
    };
    
    const getToolSteps = (toolId) => {
        const stepsMap = {
            'scene-detection': ['Analyzing video frames...', 'Detecting scene changes...', 'Labeling scenes...', 'Generating scene map...'],
            'clip-segmentation': ['Identifying segment boundaries...', 'Creating clip markers...', 'Optimizing cut points...', 'Finalizing segments...'],
            'highlight-detection': ['Analyzing content...', 'Scoring moments...', 'Ranking highlights...', 'Extracting clips...'],
            'cosyvoice': ['Loading voice model...', 'Processing audio...', 'Generating voice...', 'Finalizing output...'],
            'fish-speech': ['Synthesizing speech...', 'Applying voice characteristics...', 'Optimizing audio...', 'Complete!'],
            'seed-vc': ['Analyzing source voice...', 'Processing conversion...', 'Applying target voice...', 'Done!'],
            'whisper': ['Extracting audio...', 'Transcribing speech...', 'Formatting text...', 'Complete!'],
            'imagebind': ['Binding modalities...', 'Analyzing content...', 'Generating insights...', 'Complete!'],
            'dubbing': ['Translating content...', 'Synthesizing speech...', 'Syncing to video...', 'Complete!'],
            'color-correct': ['Analyzing color palette...', 'Applying corrections...', 'Balancing tones...', 'Final render...'],
            'upscale': ['Analyzing frames...', 'Enhancing resolution...', 'Applying AI scaling...', 'Complete!'],
            'stabilize': ['Analyzing motion...', 'Computing vectors...', 'Applying stabilization...', 'Done!'],
        };
        return stepsMap[toolId] || ['Processing...', 'Finalizing...'];
    };
    
    const getUseCaseSteps = (usecaseId) => {
        const stepsMap = {
            'standup': ['Analyzing content...', 'Detecting pacing...', 'Adding comedy timing...', 'Optimizing delivery...'],
            'commentary': ['Analyzing video...', 'Generating commentary...', 'Syncing overlay...', 'Complete!'],
            'overview': ['Summarizing content...', 'Generating chapters...', 'Creating overview...', 'Done!'],
            'meme': ['Analyzing frames...', 'Generating captions...', 'Applying effects...', 'Complete!'],
            'music-video': ['Analyzing audio...', 'Syncing to beat...', 'Adding effects...', 'Done!'],
            'qa': ['Analyzing content...', 'Generating questions...', 'Creating interaction...', 'Complete!'],
        };
        return stepsMap[usecaseId] || ['Processing...', 'Finalizing...'];
    };
    
    // ==========================================
    // API HELPER FUNCTIONS (need container access)
    // ==========================================
    
    function getModalElements() {
        return {
            modal: container.querySelector('#processing-modal'),
            nameEl: container.querySelector('#processing-name'),
            stepsEl: container.querySelector('#processing-steps'),
            progressBar: container.querySelector('#modal-progress-bar'),
            percentEl: container.querySelector('#processing-percent'),
            queueList: container.querySelector('#queue-list'),
            resultsPanel: container.querySelector('#results-panel'),
            resultsContent: container.querySelector('#results-content')
        };
    }
    
    // Poll for tool/job completion
    async function pollToolJob(jobId, tool, stepsEl, progressBar, percentEl, abortSignal) {
        const supabaseUrl = getSupabaseUrl();
        const maxAttempts = 60;
        const steps = getToolSteps(tool.id || '');

        for (let i = 0; i < maxAttempts; i++) {
            if (abortSignal?.aborted) return;
            try {
                if (abortSignal?.aborted) return;
                const response = await fetch(`${supabaseUrl}/functions/v1/videoagent?jobId=${jobId}`);
                const result = await response.json();
                
                if (result.status === 'completed') {
                    updateProgress(stepsEl, progressBar, percentEl, 100);
                    return;
                } else if (result.status === 'failed') {
                    throw new Error(result.error || 'Job failed');
                } else if (result.currentStep) {
                    const stepIndex = Math.min(result.currentStep - 1, steps.length - 1);
                    updateStepsDisplay(stepsEl, steps, stepIndex);
                    const percent = Math.round(((stepIndex + 1) / steps.length) * 100);
                    updateProgress(stepsEl, progressBar, percentEl, percent);
                }
                
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('[VideoAgent] Poll error:', error);
                throw error;
            }
        }
        
        throw new Error('Job timed out');
    }
    
    // Poll for pipeline completion
    async function pollPipelineJob(jobId, stepsEl, progressBar, percentEl, abortSignal) {
        const supabaseUrl = getSupabaseUrl();
        const maxAttempts = 120;
        const pipelineSteps = [
            { name: 'Scene Detection', steps: ['Analyzing frames...', 'Identifying boundaries...', 'Labeling scenes...'] },
            { name: 'Clip Segmentation', steps: ['Splitting video...', 'Creating segments...', 'Optimizing cuts...'] },
            { name: 'Highlight Detection', steps: ['Finding key moments...', 'Scoring highlights...', 'Ranking clips...'] },
            { name: 'Transcription', steps: ['Audio extraction...', 'Whisper transcription...', 'Text formatting...'] },
            { name: 'Color Correction', steps: ['Analyzing colors...', 'Balancing tones...', 'Applying LUTs...'] },
            { name: 'Final Export', steps: ['Merging outputs...', 'Encoding video...', 'Finalizing...'] }
        ];
        
        let totalSteps = pipelineSteps.reduce((sum, j) => sum + j.steps.length, 0);
        
        for (let i = 0; i < maxAttempts; i++) {
            if (abortSignal?.aborted) return;
            try {
                if (abortSignal?.aborted) return;
                const response = await fetch(`${supabaseUrl}/functions/v1/videoagent?jobId=${jobId}`);
                const result = await response.json();
                
                if (result.status === 'completed') {
                    updateProgress(stepsEl, progressBar, percentEl, 100);
                    return;
                } else if (result.status === 'failed') {
                    throw new Error(result.error || 'Job failed');
                } else if (result.currentStep) {
                    const stepIndex = Math.min(result.currentStep - 1, totalSteps - 1);
                    const percent = Math.round(((stepIndex + 1) / totalSteps) * 100);
                    updateProgress(stepsEl, progressBar, percentEl, percent);
                }
                
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('[VideoAgent] Pipeline poll error:', error);
                throw error;
            }
        }
        
        throw new Error('Pipeline job timed out');
    }
    
    // Update progress bar and percentage
    function updateProgress(stepsEl, progressBar, percentEl, percent) {
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (percentEl) percentEl.textContent = `${percent}%`;
    }
    
    // Update steps display during polling
    function updateStepsDisplay(stepsEl, steps, currentIndex) {
        if (!stepsEl) return;
        stepsEl.innerHTML = steps.map((s, idx) => `
            <div class="flex items-center gap-2 text-sm ${idx <= currentIndex ? 'text-white' : 'text-muted'}">
                <span class="w-1.5 h-1.5 rounded-full ${idx < currentIndex ? 'bg-primary' : idx === currentIndex ? 'bg-primary animate-pulse' : 'bg-muted'}"></span>
                ${s}
            </div>
        `).join('');
    }
    
    // Fallback simulation for tool processing
    async function simulateToolProcessing(tool) {
        const m = getModalElements();
        isProcessing = true;
        addToQueue(tool.name, 'pending');
        
        m.nameEl.textContent = tool.description;
        m.modal.classList.remove('hidden');
        
        const steps = getToolSteps(tool.id);
        
        for (let i = 0; i < steps.length; i++) {
            m.stepsEl.innerHTML = steps.map((s, idx) => `
                <div class="flex items-center gap-2 text-sm ${idx <= i ? 'text-white' : 'text-muted'}">
                    <span class="w-1.5 h-1.5 rounded-full ${idx < i ? 'bg-primary' : idx === i ? 'bg-primary animate-pulse' : 'bg-muted'}"></span>
                    ${s}
                </div>
            `).join('');
            
            const percent = Math.round(((i + 1) / steps.length) * 100);
            m.progressBar.style.width = `${percent}%`;
            m.percentEl.textContent = `${percent}%`;
            
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        }
        
        m.modal.classList.add('hidden');
        isProcessing = false;
        updateQueueItem(tool.name, 'complete');
        showResults(tool);
        showToast(`${tool.name} completed!`, 'success');
    }
    
    // Fallback simulation for use case processing
    async function simulateUseCaseProcessing(usecase) {
        const m = getModalElements();
        isProcessing = true;
        addToQueue(usecase.name, 'pending');
        
        m.nameEl.textContent = usecase.description;
        m.modal.classList.remove('hidden');
        
        const steps = getUseCaseSteps(usecase.id);
        
        for (let i = 0; i < steps.length; i++) {
            m.stepsEl.innerHTML = steps.map((s, idx) => `
                <div class="flex items-center gap-2 text-sm ${idx <= i ? 'text-white' : 'text-muted'}">
                    <span class="w-1.5 h-1.5 rounded-full ${idx < i ? 'bg-primary' : idx === i ? 'bg-primary animate-pulse' : 'bg-muted'}"></span>
                    ${s}
                </div>
            `).join('');
            
            const percent = Math.round(((i + 1) / steps.length) * 100);
            m.progressBar.style.width = `${percent}%`;
            m.percentEl.textContent = `${percent}%`;
            
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
        }
        
        m.modal.classList.add('hidden');
        isProcessing = false;
        updateQueueItem(usecase.name, 'complete');
        showResults({ name: usecase.name, icon: usecase.icon });
        showToast(`${usecase.name} completed!`, 'success');
    }
    
    // Fallback simulation for full pipeline
    async function simulateFullPipeline() {
        const m = getModalElements();
        isProcessing = true;
        
        m.nameEl.textContent = 'Running full AI processing pipeline (offline mode)';
        m.modal.classList.remove('hidden');
        
        const jobs = [
            { name: 'Scene Detection', steps: ['Analyzing frames...', 'Identifying boundaries...', 'Labeling scenes...'] },
            { name: 'Clip Segmentation', steps: ['Splitting video...', 'Creating segments...', 'Optimizing cuts...'] },
            { name: 'Highlight Detection', steps: ['Finding key moments...', 'Scoring highlights...', 'Ranking clips...'] },
            { name: 'Transcription', steps: ['Audio extraction...', 'Whisper transcription...', 'Text formatting...'] },
            { name: 'Color Correction', steps: ['Analyzing colors...', 'Balancing tones...', 'Applying LUTs...'] },
            { name: 'Final Export', steps: ['Merging outputs...', 'Encoding video...', 'Finalizing...'] }
        ];
        
        let totalSteps = jobs.reduce((sum, j) => sum + j.steps.length, 0);
        let completedSteps = 0;
        
        for (const job of jobs) {
            addToQueue(job.name, 'running');
            
            for (const step of job.steps) {
                m.stepsEl.innerHTML = `
                    <div class="text-sm text-white font-bold mb-2">${job.name}</div>
                    ${job.steps.map((s, idx) => `
                        <div class="flex items-center gap-2 text-sm ${s === step ? 'text-white' : 'text-muted'}">
                            <span class="w-1.5 h-1.5 rounded-full ${s === step ? 'bg-primary animate-pulse' : 'bg-green-500'}"></span>
                            ${s}
                        </div>
                    `).join('')}
                `;
                
                const percent = Math.round(((completedSteps + 1) / totalSteps) * 100);
                m.progressBar.style.width = `${percent}%`;
                m.percentEl.textContent = `${percent}%`;
                
                await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
                completedSteps++;
            }
            
            updateQueueItem(job.name, 'complete');
        }
        
        m.modal.classList.add('hidden');
        isProcessing = false;
        showToast('Full pipeline completed!', 'success');
    }

    // Cleanup function to abort ongoing operations
    container.cleanup = () => {
        abortController.abort();
    };

    return container;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
