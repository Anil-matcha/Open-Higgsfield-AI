import { navigate } from '../lib/router.js';
import { showToast } from '../lib/loading.js';

const AI_TOOLS = [
    { id: 'scene-detection', name: 'Scene Detection', icon: '🎬', color: 'blue', description: 'Identify scene boundaries', category: 'understanding' },
    { id: 'clip-segmentation', name: 'Clip Segmentation', icon: '✂️', color: 'purple', description: 'Split into clip segments', category: 'editing' },
    { id: 'highlight-detection', name: 'Highlight Detection', icon: '⚡', color: 'orange', description: 'Find key moments', category: 'understanding' },
    { id: 'cosyvoice', name: 'CosyVoice', icon: '🎤', color: 'pink', description: 'Voice cloning & TTS', category: 'audio' },
    { id: 'fish-speech', name: 'Fish Speech', icon: '🐟', color: 'cyan', description: 'Voice synthesis', category: 'audio' },
    { id: 'seed-vc', name: 'Seed-VC', icon: '🔄', color: 'teal', description: 'Voice conversion', category: 'audio' },
    { id: 'whisper', name: 'Whisper', icon: '📝', color: 'green', description: 'Audio transcription', category: 'audio' },
    { id: 'imagebind', name: 'ImageBind', icon: '🔗', color: 'indigo', description: 'Multimodal understanding', category: 'understanding' },
    { id: 'dubbing', name: 'Cross-lingual Dub', icon: '🌍', color: 'yellow', description: 'Translate & dub video', category: 'translate' },
    { id: 'color-correct', name: 'Color Correction', icon: '🎨', color: 'rose', description: 'Adjust colors & tones', category: 'enhance' },
    { id: 'upscale', name: 'Video Upscale', icon: '📈', color: 'emerald', description: 'Enhance resolution', category: 'enhance' },
    { id: 'stabilize', name: 'Stabilize', icon: '🪄', color: 'violet', description: 'Fix shaky footage', category: 'enhance' },
];

const USE_CASES = [
    { id: 'standup', name: 'Stand-up Comedy', icon: '🎤', description: 'Transform video with comedy timing' },
    { id: 'commentary', name: 'Commentary', icon: '💬', description: 'Add AI commentary overlay' },
    { id: 'overview', name: 'Video Overview', icon: '📋', description: 'Generate summary overview' },
    { id: 'meme', name: 'Meme Generator', icon: '😂', description: 'Create meme videos' },
    { id: 'music-video', name: 'Music Video', icon: '🎵', description: 'Set video to music' },
    { id: 'qa', name: 'Video Q&A', icon: '❓', description: 'Interactive video Q&A' },
];

export function VideoAgentPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col overflow-hidden';
    
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId') || '';
    const videoUrl = urlParams.get('videoUrl') || '';
    
    let processingQueue = [];
    let isProcessing = false;
    
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
                    <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-lg font-black text-white">VIDEOAGENT</h1>
                        <p class="text-xs text-secondary">AI Processing Engine</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-bold rounded-full flex items-center gap-2">
                    <span class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                    AI POWERED
                </span>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Left: Video Preview + Use Cases -->
            <div class="flex-1 flex flex-col p-4 overflow-auto">
                <!-- Video Preview -->
                <div class="bg-black/50 rounded-2xl overflow-hidden mb-4">
                    <div class="aspect-video flex items-center justify-center bg-black">
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
                            <div class="text-center p-8">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-secondary mx-auto mb-4">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                </svg>
                                <p class="text-secondary">No video loaded</p>
                                <p class="text-xs text-muted mt-2">Generate a video first to process</p>
                            </div>
                        `}
                    </div>
                </div>
                
                <!-- Use Cases -->
                <div>
                    <h3 class="font-bold text-white mb-3 text-sm">AI USE CASES</h3>
                    <div class="grid grid-cols-3 gap-3">
                        ${USE_CASES.map(uc => `
                            <button class="usecase-btn p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer" data-usecase="${uc.id}">
                                <div class="text-2xl mb-2">${uc.icon}</div>
                                <div class="font-bold text-white text-sm">${uc.name}</div>
                                <div class="text-xs text-secondary">${uc.description}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Processing Results -->
                <div id="results-panel" class="mt-4 hidden">
                    <h3 class="font-bold text-white mb-3 text-sm">PROCESSING RESULTS</h3>
                    <div id="results-content" class="space-y-2">
                    </div>
                </div>
            </div>
            
            <!-- Right Panel - AI Tools -->
            <div class="w-96 border-l border-white/5 overflow-auto">
                <!-- Category Tabs -->
                <div class="flex border-b border-white/5">
                    <button class="category-tab flex-1 p-3 text-xs font-bold text-primary border-b-2 border-primary" data-category="all">
                        ALL
                    </button>
                    <button class="category-tab flex-1 p-3 text-xs font-bold text-secondary hover:text-white" data-category="understanding">
                        UNDERSTAND
                    </button>
                    <button class="category-tab flex-1 p-3 text-xs font-bold text-secondary hover:text-white" data-category="editing">
                        EDIT
                    </button>
                    <button class="category-tab flex-1 p-3 text-xs font-bold text-secondary hover:text-white" data-category="audio">
                        AUDIO
                    </button>
                </div>
                
                <!-- AI Tools Grid -->
                <div class="p-4">
                    <h3 class="font-bold text-white mb-3 text-sm">AI PROCESSING TOOLS</h3>
                    <div id="tools-grid" class="grid grid-cols-2 gap-3">
                        ${AI_TOOLS.map(tool => `
                            <button class="tool-btn p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer" data-tool="${tool.id}" data-category="${tool.category}">
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="w-10 h-10 bg-${tool.color}-600/20 rounded-xl flex items-center justify-center">
                                        <span class="text-lg">${tool.icon}</span>
                                    </div>
                                </div>
                                <div class="font-bold text-white text-sm">${tool.name}</div>
                                <div class="text-xs text-secondary">${tool.description}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Processing Queue -->
                <div class="p-4 border-t border-white/5">
                    <h3 class="font-bold text-white mb-3 text-sm flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        PROCESSING QUEUE
                    </h3>
                    <div id="queue-list" class="space-y-2 max-h-40 overflow-auto mb-4">
                        <div class="text-sm text-secondary italic p-2">No jobs in queue</div>
                    </div>
                </div>
                
                <!-- Full Pipeline -->
                <div class="p-4 border-t border-white/5">
                    <button id="run-full-pipeline" class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        Run Full Pipeline
                    </button>
                </div>
                
                <!-- Settings -->
                <div class="p-4 border-t border-white/5">
                    <h4 class="font-bold text-white text-sm mb-3">SETTINGS</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="text-xs text-secondary block mb-1">Output Quality</label>
                            <select class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                                <option>720p</option>
                                <option selected>1080p</option>
                                <option>4K</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs text-secondary block mb-1">Output Format</label>
                            <select class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                                <option selected>MP4</option>
                                <option>WebM</option>
                                <option>MOV</option>
                            </select>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-secondary">Auto-save results</span>
                            <button class="w-10 h-5 bg-primary rounded-full relative">
                                <span class="absolute right-0.5 top-0.5 w-4 h-4 bg-black rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Processing Modal -->
        <div id="processing-modal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 hidden">
            <div class="bg-black border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 mx-auto mb-4 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <div class="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Processing Video</h3>
                    <p id="processing-name" class="text-sm text-secondary">Initializing...</p>
                </div>
                
                <div class="mb-6">
                    <div class="flex justify-between text-xs mb-2">
                        <span class="text-secondary">Progress</span>
                        <span id="processing-percent" class="text-primary font-bold">0%</span>
                    </div>
                    <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div id="modal-progress-bar" class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" style="width: 0%"></div>
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
    
    // Event handlers
    container.querySelector('#back-btn').onclick = () => {
        navigate('render', { videoId, videoUrl });
    };
    
    // Category tabs
    container.querySelectorAll('.category-tab').forEach(tab => {
        tab.onclick = () => {
            container.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('text-primary', 'border-primary');
                t.classList.add('text-secondary');
            });
            tab.classList.remove('text-secondary');
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
        
        isProcessing = true;
        
        // Add to queue
        addToQueue(tool.name, 'pending');
        
        // Show modal
        const modal = container.querySelector('#processing-modal');
        const nameEl = container.querySelector('#processing-name');
        const stepsEl = container.querySelector('#processing-steps');
        const progressBar = container.querySelector('#modal-progress-bar');
        const percentEl = container.querySelector('#processing-percent');
        
        nameEl.textContent = tool.description;
        modal.classList.remove('hidden');
        
        const steps = getToolSteps(tool.id);
        
        for (let i = 0; i < steps.length; i++) {
            stepsEl.innerHTML = steps.map((s, idx) => `
                <div class="flex items-center gap-2 text-sm ${idx <= i ? 'text-white' : 'text-secondary'}">
                    <span class="w-1.5 h-1.5 rounded-full ${idx < i ? 'bg-primary' : idx === i ? 'bg-primary animate-pulse' : 'bg-secondary'}"></span>
                    ${s}
                </div>
            `).join('');
            
            const percent = Math.round(((i + 1) / steps.length) * 100);
            progressBar.style.width = `${percent}%`;
            percentEl.textContent = `${percent}%`;
            
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        }
        
        modal.classList.add('hidden');
        isProcessing = false;
        
        // Update queue
        updateQueueItem(tool.name, 'complete');
        
        // Show results
        showResults(tool);
        
        showToast(`${tool.name} completed!`, 'success');
    };
    
    const runUseCase = async (usecase) => {
        if (isProcessing) {
            showToast('Already processing', 'error');
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
        
        const steps = getUseCaseSteps(usecase.id);
        
        for (let i = 0; i < steps.length; i++) {
            stepsEl.innerHTML = steps.map((s, idx) => `
                <div class="flex items-center gap-2 text-sm ${idx <= i ? 'text-white' : 'text-secondary'}">
                    <span class="w-1.5 h-1.5 rounded-full ${idx < i ? 'bg-primary' : idx === i ? 'bg-primary animate-pulse' : 'bg-secondary'}"></span>
                    ${s}
                </div>
            `).join('');
            
            const percent = Math.round(((i + 1) / steps.length) * 100);
            progressBar.style.width = `${percent}%`;
            percentEl.textContent = `${percent}%`;
            
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
        }
        
        modal.classList.add('hidden');
        isProcessing = false;
        
        updateQueueItem(usecase.name, 'complete');
        showResults({ name: usecase.name, icon: usecase.icon });
        
        showToast(`${usecase.name} completed!`, 'success');
    };
    
    const runFullPipeline = async () => {
        if (isProcessing) {
            showToast('Already processing', 'error');
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
                stepsEl.innerHTML = `
                    <div class="text-sm text-white font-bold mb-2">${job.name}</div>
                    ${job.steps.map((s, idx) => `
                        <div class="flex items-center gap-2 text-sm ${s === step ? 'text-white' : 'text-secondary'}">
                            <span class="w-1.5 h-1.5 rounded-full ${s === step ? 'bg-primary animate-pulse' : 'bg-green-500'}"></span>
                            ${s}
                        </div>
                    `).join('')}
                `;
                
                const percent = Math.round(((completedSteps + 1) / totalSteps) * 100);
                progressBar.style.width = `${percent}%`;
                percentEl.textContent = `${percent}%`;
                
                await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
                completedSteps++;
            }
            
            updateQueueItem(job.name, 'complete');
        }
        
        modal.classList.add('hidden');
        isProcessing = false;
        
        showToast('Full pipeline completed!', 'success');
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
            queueEl.innerHTML = '<div class="text-sm text-secondary italic p-2">No jobs in queue</div>';
            return;
        }
        
        queueEl.innerHTML = processingQueue.map(item => `
            <div class="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                ${item.status === 'complete' ? `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-green-400">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                ` : item.status === 'running' ? `
                    <div class="animate-spin w-3 h-3 border border-purple-400 border-t-transparent rounded-full"></div>
                ` : `
                    <span class="w-3 h-3 rounded-full bg-secondary"></span>
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
    
    return container;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
