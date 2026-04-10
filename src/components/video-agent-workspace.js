export function createVideoAgentWorkspace(runtime = null) {
  // Create the main container
  const container = document.createElement('div');
  container.className = 'w-full h-full bg-app-bg text-white font-sans overflow-hidden';
  container.style.background = '#050505';

  // ==========================================
  // 0. STATE MANAGEMENT
  // ==========================================
  let uploadedVideoUrl = null;
  let isDragOver = false;

  // ==========================================
  // 1. STYLES
  // ==========================================
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .card {
      background: rgba(17,17,17,0.9);
      backdrop-filter: blur(20px);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:1.5rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }

    .subtle-card {
      background: rgba(255,255,255,0.03);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:1rem;
      transition: all 0.25s ease;
    }

    .subtle-card:hover {
      border-color: rgba(139,92,246,0.3);
      transform: translateY(-2px);
    }

    .goal-btn {
      background: rgba(255,255,255,0.05);
      border:1px solid rgba(255,255,255,0.08);
      padding:12px 14px;
      border-radius:12px;
      font-size:14px;
      text-align:left;
      transition: all 0.25s ease;
    }

    .goal-btn:hover {
      border-color: rgba(139,92,246,0.3);
      background: rgba(255,255,255,0.08);
      transform: translateY(-2px);
    }

    .primary-btn {
      background:#a855f7;
      color:black;
      font-weight:900;
      border-radius:12px;
      padding:10px 16px;
      transition: all 0.2s ease;
    }

    .primary-btn:hover {
      transform: scale(1.04);
      box-shadow: 0 0 20px rgba(168,85,247,0.6);
    }

    .ghost-btn {
      background: rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.88);
      border-radius: 12px;
      padding: 10px 14px;
      transition: all 0.2s ease;
    }

    .ghost-btn:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(139,92,246,0.25);
    }

    .hero-banner {
      position: relative;
      overflow: hidden;
      min-height: 180px;
      background:
        radial-gradient(circle at 20% 20%, rgba(168,85,247,0.25), transparent 30%),
        radial-gradient(circle at 80% 30%, rgba(59,130,246,0.18), transparent 30%),
        linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
    }

    .hero-banner::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(17,17,17,0.95), rgba(17,17,17,0.25), transparent);
      pointer-events: none;
    }

    .status-pill {
      background: rgba(168,85,247,0.12);
      border: 1px solid rgba(168,85,247,0.25);
      color: #d8b4fe;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 700;
    }

    .timeline-track {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      min-height: 56px;
    }

    .timeline-block {
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(168,85,247,0.32), rgba(255,255,255,0.08));
      border: 1px solid rgba(168,85,247,0.22);
      color: rgba(255,255,255,0.92);
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }

    .mini-label {
      color: rgba(255,255,255,0.42);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
    }

    .chat-bubble-user {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 10px 12px;
    }

    .chat-bubble-agent {
      background: rgba(168,85,247,0.08);
      border: 1px solid rgba(168,85,247,0.16);
      border-radius: 14px;
      padding: 10px 12px;
    }

    .progress-bar {
      background: linear-gradient(90deg, #a855f7, #c084fc);
      box-shadow: 0 0 18px rgba(168,85,247,0.45);
    }

    .workspace-grid {
      display: grid;
      grid-template-columns: 240px minmax(0, 1.7fr) 300px;
      gap: 1rem;
      align-items: start;
    }

    .preview-stage {
      position: relative;
      min-height: 620px;
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at center, rgba(168,85,247,0.08), transparent 35%),
        #000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.05);
    }

    .preview-stage video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      background: #000;
    }

    @media (max-width: 1535px) {
      .workspace-grid {
        grid-template-columns: 220px minmax(0, 1.55fr) 280px;
      }

      .preview-stage {
        min-height: 560px;
      }
    }

    @media (max-width: 1279px) {
      .workspace-grid {
        grid-template-columns: 1fr;
      }

      .preview-stage {
        min-height: 480px;
      }
    }

    .drag-over {
      border-color: rgba(168,85,247,0.6) !important;
      background: rgba(168,85,247,0.05) !important;
    }

    .upload-zone {
      border: 2px dashed rgba(255,255,255,0.2);
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .upload-zone:hover {
      border-color: rgba(168,85,247,0.4);
      background: rgba(168,85,247,0.02);
    }

    .tab-btn.active {
      background: rgba(168,85,247,0.1);
      border-color: rgba(168,85,247,0.3);
      color: #d8b4fe;
    }
  `;
  document.head.appendChild(style);

  container.innerHTML = `
    <!-- TOP BAR -->
    <div class="w-full flex items-center justify-between px-6 py-4 bg-panel-bg border-b border-white/5">
      <div class="flex items-center gap-4">
        <div>
          <div class="font-black text-lg leading-none">VideoAgent</div>
          <div class="text-xs text-muted mt-1">Project: Summer Campaign Edit</div>
        </div>
        <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">AI READY</span>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-muted text-sm rounded-lg transition-colors">Version History</button>
        <button class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-muted text-sm rounded-lg transition-colors">Save</button>
        <button class="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:scale-105 transition-transform">Export</button>
      </div>
    </div>

    <!-- HERO -->
    <div class="card hero-banner p-6 md:p-8 flex items-end">
      <div class="relative z-10 max-w-3xl">
        <div class="text-xs text-white/50 font-bold tracking-[0.25em] mb-3">AI VIDEO AGENT WORKSPACE</div>
        <h1 class="text-3xl md:text-5xl font-black tracking-tight mb-2">Edit, repurpose, and direct videos with AI.</h1>
        <p class="text-sm md:text-base text-white/65 max-w-2xl">Use Director-style planning, ArcReel-style job flow, and FireRed-style editing actions inside one cinematic workspace built in the Storyboard theme.</p>
        <div class="flex flex-wrap gap-3 mt-5">
          <button class="primary-btn">Start With AI Plan</button>
          <button class="ghost-btn">Open Existing Project</button>
        </div>
      </div>
    </div>

    <!-- FEATURES -->
    <div class="card p-4 md:p-6">
      <h2 class="text-xl font-black text-white mb-1">Agent Capabilities</h2>
      <p class="text-sm text-white/50 mb-6">Built like a premium storyboard app, but designed for AI-powered editing workflows.</p>
      <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="subtle-card p-4">
          <div class="text-3xl mb-3">🎬</div>
          <div class="font-black mb-1">Goal-Based Editing</div>
          <div class="text-sm text-white/55">Tell the agent what outcome you want instead of manually chaining tools together.</div>
        </div>
        <div class="subtle-card p-4">
          <div class="text-3xl mb-3">🧠</div>
          <div class="font-black mb-1">AI Planning</div>
          <div class="text-sm text-white/55">The agent builds a task plan for highlights, shorts, captions, dubbing, and quality improvements.</div>
        </div>
        <div class="subtle-card p-4">
          <div class="text-3xl mb-3">📝</div>
          <div class="font-black mb-1">Timeline + Outputs</div>
          <div class="text-sm text-white/55">Review scenes, generated clips, captions, and timeline changes from one unified workspace.</div>
        </div>
        <div class="subtle-card p-4">
          <div class="text-3xl mb-3">✨</div>
          <div class="font-black mb-1">Premium Workflow UX</div>
          <div class="text-sm text-white/55">Storyboard-style cards, polished interaction states, and a cinematic editing environment.</div>
        </div>
      </div>
    </div>

    <!-- QUICK ACTIONS -->
    <div class="card p-4 md:p-6">
      <h2 class="text-xl font-black text-white mb-1">Quick Actions</h2>
      <p class="text-sm text-white/50 mb-6">Launch the agent with common editing goals.</p>
      <div class="flex flex-wrap gap-3" id="quick-actions">
        <button class="goal-btn" data-prompt="Create highlights from this video">Create Highlights</button>
        <button class="goal-btn" data-prompt="Make 3 short vertical clips">Make Shorts</button>
        <button class="goal-btn" data-prompt="Add captions to this video">Add Captions</button>
        <button class="goal-btn" data-prompt="Dub this video into Spanish">Dub Video</button>
        <button class="goal-btn" data-prompt="Improve video quality and pacing">Improve Quality</button>
        <button class="goal-btn" data-prompt="Build a trailer cut from this video">Build Trailer</button>
      </div>
    </div>

    <!-- EXAMPLE OUTPUTS -->
    <div class="card p-4 md:p-6">
      <h2 class="text-xl font-black text-white mb-1">Example Outputs</h2>
      <p class="text-sm text-white/50 mb-6">Preview the kinds of transformations the agent can create.</p>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="subtle-card p-4 cursor-pointer">
          <div class="mb-3"><span class="status-pill">HIGHLIGHTS</span></div>
          <div class="text-white/80 text-sm">Three high-energy clips pulled from the strongest moments in your source video.</div>
        </div>
        <div class="subtle-card p-4 cursor-pointer">
          <div class="mb-3"><span class="status-pill">CAPTIONS</span></div>
          <div class="text-white/80 text-sm">Clean branded captions generated from transcript timing and scene pacing.</div>
        </div>
        <div class="subtle-card p-4 cursor-pointer">
          <div class="mb-3"><span class="status-pill">SHORTS</span></div>
          <div class="text-white/80 text-sm">Vertical edits with tighter pacing, stronger hooks, and mobile-first framing.</div>
        </div>
      </div>
    </div>

    <!-- MAIN WORKSPACE -->
    <div class="workspace-grid">

      <!-- LEFT: GOALS + JOBS -->
      <div class="space-y-4">
        <div class="card p-4 flex flex-col gap-3">
          <div class="mini-label mb-1">AGENT GOALS</div>
          <button class="goal-btn" data-goal="Create highlights from this video">🎬 Create Highlights</button>
          <button class="goal-btn" data-goal="Make 3 short vertical clips">📱 Make Shorts</button>
          <button class="goal-btn" data-goal="Add captions to this video">📝 Add Captions</button>
          <button class="goal-btn" data-goal="Dub this video into Spanish">🌍 Dub Video</button>
          <button class="goal-btn" data-goal="Improve video quality and pacing">✨ Improve Quality</button>
        </div>

        <div class="card p-4">
          <div class="mini-label mb-3">JOB CENTER</div>
          <div class="space-y-3" id="job-list">
            <div class="subtle-card p-3">
              <div class="flex items-center justify-between mb-2">
                <div class="text-sm font-bold">Current Session</div>
                <div class="text-xs text-white/45">Idle</div>
              </div>
              <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div id="job-progress" class="progress-bar h-full w-0 rounded-full"></div>
              </div>
              <div class="text-xs text-white/45 mt-2" id="job-status-text">Waiting for a goal...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CENTER -->
      <div class="space-y-4">
        <div class="card p-4 md:p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="mini-label mb-1">VIDEO PREVIEW</div>
              <div class="text-sm text-white/55">Source video, generated cuts, and scene-aware review.</div>
            </div>
            <div class="flex gap-2">
              <button class="ghost-btn">Original</button>
              <button class="primary-btn">AI Version</button>
            </div>
          </div>
          <div class="preview-stage" id="preview-stage">
            <video id="video" controls aria-label="Video preview player" style="display: none;"></video>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none" id="upload-zone">
              <div class="upload-zone w-full h-full flex flex-col items-center justify-center" id="drop-zone">
                <div class="text-6xl mb-4 opacity-70">🎬</div>
                <div class="text-xl font-bold text-white/80 mb-2">Drop your video here</div>
                <div class="text-base text-white/55 font-medium mb-4">Or click to browse files</div>
                <div class="text-sm text-white/35">Supports MP4, MOV, AVI, WebM up to 2GB</div>
                <input type="file" id="video-upload" accept="video/*" style="display: none;">
              </div>
            </div>
          </div>
          <div class="grid md:grid-cols-3 gap-3 mt-4">
            <div class="subtle-card p-3">
              <div class="mini-label mb-2">SOURCE</div>
              <div class="text-sm">Summer-Campaign-Full.mp4</div>
              <div class="text-xs text-white/45 mt-1">03:42 • 1080p • 16:9</div>
            </div>
            <div class="subtle-card p-3">
              <div class="mini-label mb-2">SCENES</div>
              <div class="text-sm">12 detected scenes</div>
              <div class="text-xs text-white/45 mt-1">Hook, demo, proof, CTA</div>
            </div>
            <div class="subtle-card p-3">
              <div class="mini-label mb-2">ACTIVE OUTPUT</div>
              <div class="text-sm">AI Short v2</div>
              <div class="text-xs text-white/45 mt-1">Captioned vertical export</div>
            </div>
          </div>
        </div>

        <div class="card p-4 md:p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="mini-label mb-1">TIMELINE</div>
              <div class="text-sm text-white/55">Scene structure, captions, and AI-generated edits.</div>
            </div>
            <div class="text-xs text-white/40">00:00 — 03:42</div>
          </div>

          <div class="space-y-3">
            <div>
              <div class="mini-label mb-2">VIDEO TRACK</div>
              <div class="timeline-track p-3 flex items-center gap-2 overflow-x-auto">
                <div class="timeline-block" style="width: 80px">Hook</div>
                <div class="timeline-block" style="width: 100px">Demo</div>
                <div class="timeline-block" style="width: 90px">Social Proof</div>
                <div class="timeline-block" style="width: 110px">Offer</div>
                <div class="timeline-block" style="width: 82px">CTA</div>
              </div>
            </div>

            <div>
              <div class="mini-label mb-2">CAPTION TRACK</div>
              <div class="timeline-track p-3 flex items-center gap-2 overflow-x-auto">
                <div class="timeline-block" style="width: 70px">Cap 1</div>
                <div class="timeline-block" style="width: 90px">Cap 2</div>
                <div class="timeline-block" style="width: 85px">Cap 3</div>
                <div class="timeline-block" style="width: 75px">Cap 4</div>
                <div class="timeline-block" style="width: 100px">Cap 5</div>
              </div>
            </div>

            <div>
              <div class="mini-label mb-2">AI SUGGESTIONS</div>
              <div class="timeline-track p-3 flex items-center gap-2 overflow-x-auto">
                <div class="timeline-block" style="width: 120px">Tighten Intro</div>
                <div class="timeline-block" style="width: 135px">Boost Hook</div>
                <div class="timeline-block" style="width: 145px">Shorten Pause</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="space-y-4">
        <div class="card flex flex-col min-h-[620px]">
          <div class="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <div class="mini-label mb-1">AI AGENT</div>
              <div class="text-sm text-white/55">Chat with the editing agent and review its plan.</div>
            </div>
            <span class="status-pill">LIVE</span>
          </div>

          <div class="px-4 pt-4 grid grid-cols-3 gap-2">
            <button class="tab-btn ghost-btn text-xs active" data-tab="chat">Chat</button>
            <button class="tab-btn ghost-btn text-xs" data-tab="outputs">Outputs</button>
            <button class="tab-btn ghost-btn text-xs" data-tab="inspector">Inspector</button>
          </div>

          <div id="chat" class="tab-content flex-1 overflow-y-auto p-4 space-y-3">
            <div class="chat-bubble-agent text-sm text-white/80">I can plan edits, create shorts, add captions, improve pacing, and help you build new video versions.</div>
            <div class="chat-bubble-agent text-sm text-white/80">Try: "Make 3 short clips from the strongest moments."</div>
          </div>

          <div id="outputs" class="tab-content flex-1 overflow-y-auto p-4 space-y-3" style="display: none;">
            <div class="text-sm text-white/70 mb-4">Generated outputs will appear here</div>
            <div class="subtle-card p-3">
              <div class="text-sm font-bold text-white mb-1">No outputs yet</div>
              <div class="text-xs text-white/50">Run an AI agent to generate video outputs</div>
            </div>
          </div>

          <div id="inspector" class="tab-content flex-1 overflow-y-auto p-4 space-y-3" style="display: none;">
            <div class="text-sm text-white/70 mb-4">Video analysis and metadata</div>
            <div class="subtle-card p-3">
              <div class="text-sm font-bold text-white mb-1">Video Metadata</div>
              <div class="text-xs text-white/50 space-y-1">
                <div>Duration: --</div>
                <div>Resolution: --</div>
                <div>Codec: --</div>
                <div>Size: --</div>
              </div>
            </div>
          </div>

          <div class="p-4 border-t border-white/10 space-y-3">
            <div class="subtle-card p-3">
              <div class="mini-label mb-2">CURRENT PLAN</div>
              <div id="plan-preview" class="text-sm text-white/65">No active plan yet.</div>
            </div>
            <input id="input" placeholder="Tell the agent what to do..." class="w-full bg-black/50 px-3 py-3 rounded-xl border border-white/10 focus:border-purple-500 outline-none" />
          </div>
        </div>
      </div>

    </div>
  `;

  // Add JavaScript functionality
  function parseIntent(input) {
    const normalized = input.toLowerCase();
    if (normalized.includes('highlight')) return 'highlights';
    if (normalized.includes('short')) return 'shorts';
    if (normalized.includes('caption')) return 'captions';
    if (normalized.includes('dub')) return 'dub';
    if (normalized.includes('quality') || normalized.includes('improve')) return 'enhance';
    return 'unknown';
  }

  function planTasks(intent) {
    const plans = {
      highlights: ['scene-detect', 'score-moments', 'cut-clips', 'export'],
      shorts: ['detect-hooks', 'resize-vertical', 'caption', 'export'],
      captions: ['transcribe', 'generate-captions', 'overlay'],
      dub: ['transcribe', 'translate', 'tts', 'replace-audio'],
      enhance: ['analyze-quality', 'improve-pacing', 'color-balance', 'export']
    };
    return plans[intent] || ['analyze-video', 'build-plan'];
  }

  const jobs = [];
  let currentProgress = 0;

  async function runTasks(tasks) {
    const progressBar = container.querySelector('#job-progress');
    const statusText = container.querySelector('#job-status-text');
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      log(`Running: ${t}`, 'agent');
      statusText.textContent = `Running ${t}...`;
      currentProgress = Math.round(((i + 1) / tasks.length) * 100);
      progressBar.style.width = currentProgress + '%';
      await new Promise(r => setTimeout(r, 700));
    }
    statusText.textContent = 'Plan completed.';
    log('✅ Done', 'agent');
  }

  function createJob(tasks) {
    const job = { id: Date.now(), tasks, status: 'running' };
    jobs.push(job);
    executeJob(job);
  }

  async function executeJob(job) {
    await runTasks(job.tasks);
    job.status = 'done';
  }

  const chat = container.querySelector('#chat');
  const input = container.querySelector('#input');
  const planPreview = container.querySelector('#plan-preview');

  const handleInput = async (val) => {
    if (!val) return;
    input.value = '';

    log(val, 'user');

    if (runtime) {
      // Use the real director runtime
      try {
        const result = await runtime.processChatCommand(val);
        const activatedAgents = result.activatedAgents || [];
        const agentNames = activatedAgents.map(a => typeof a === 'string' ? a : a.name || a).join(', ');

        if (activatedAgents.length > 0) {
          log(`Activating agents: ${agentNames}`, 'agent');
          planPreview.textContent = `Agents: ${agentNames}`;
        }

        // Execute agent commands
        for (const agent of activatedAgents) {
          const agentId = typeof agent === 'string' ? agent : agent.id;
          try {
            await runtime.executeAgentCommand(agentId, { videoUrl: runtime.getVideoUrl() });
          } catch (error) {
            log(`Agent ${agentId} failed: ${error.message}`, 'agent');
          }
        }

        if (activatedAgents.length === 0) {
          log('No specific agents needed for this task.', 'agent');
        }
      } catch (error) {
        log(`Error processing command: ${error.message}`, 'agent');
      }
    } else {
      // Fallback to mock functionality
      const intent = parseIntent(val);
      const tasks = planTasks(intent);
      const planText = tasks.join(' → ');
      log(`Plan: ${planText}`, 'agent');
      planPreview.textContent = planText;
      createJob(tasks);
    }
  };

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      await handleInput(input.value.trim());
    }
  });

  function log(text, type = 'agent') {
    const el = document.createElement('div');
    el.className = type === 'user' ? 'chat-bubble-user text-sm text-white/85' : 'chat-bubble-agent text-sm text-white/80';
    el.textContent = type === 'user' ? `You: ${text}` : `Agent: ${text}`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
  }

  container.querySelectorAll('#quick-actions [data-prompt]').forEach(btn => {
    btn.addEventListener('click', async () => {
      input.value = btn.dataset.prompt;
      await handleInput(btn.dataset.prompt);
    });
  });

  // ==========================================
  // 4. VIDEO UPLOAD FUNCTIONALITY
  // ==========================================
  const previewStage = container.querySelector('#preview-stage');
  const videoElement = container.querySelector('#video');
  const uploadZone = container.querySelector('#upload-zone');
  const dropZone = container.querySelector('#drop-zone');
  const fileInput = container.querySelector('#video-upload');

  function showVideoPlayer(url) {
    uploadedVideoUrl = url;
    videoElement.src = url;
    videoElement.style.display = 'block';
    uploadZone.style.display = 'none';

    // Update runtime if available
    if (runtime) {
      runtime.setVideoUrl(url);
    }
  }

  function showUploadZone() {
    videoElement.style.display = 'none';
    uploadZone.style.display = 'flex';
    uploadedVideoUrl = null;
  }

  // Drag and drop handlers
  previewStage.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = true;
    dropZone.classList.add('drag-over');
  });

  previewStage.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!previewStage.contains(e.relatedTarget)) {
      isDragOver = false;
      dropZone.classList.remove('drag-over');
    }
  });

  previewStage.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = false;
    dropZone.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleVideoFile(files[0]);
    }
  });

  // Click to upload
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleVideoFile(file);
    }
  });

  function handleVideoFile(file) {
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB limit
      alert('File size must be less than 2GB.');
      return;
    }

    const url = URL.createObjectURL(file);
    showVideoPlayer(url);

    // Update metadata display
    const sourceDiv = container.querySelector('.subtle-card:nth-child(1) .text-sm');
    const sizeDiv = container.querySelector('.subtle-card:nth-child(1) .text-xs');
    if (sourceDiv && sizeDiv) {
      sourceDiv.textContent = file.name;
      sizeDiv.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB • ${file.type}`;
    }
  }

  // ==========================================
  // 5. GOAL BUTTON HANDLERS
  // ==========================================
  container.querySelectorAll('.goal-btn[data-goal]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const goal = btn.dataset.goal;
      input.value = goal;
      await handleInput(goal);
    });
  });

  // ==========================================
  // 6. TAB SWITCHING FUNCTIONALITY
  // ==========================================
  const tabButtons = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      // Update button states
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Show selected tab content
      tabContents.forEach(content => {
        content.style.display = content.id === tabName ? 'block' : 'none';
      });
    });
  });

  // Add video controls
  const originalBtn = container.querySelector('button[data-original]');
  const aiBtn = container.querySelector('button[data-ai]');

  if (originalBtn && aiBtn) {
    originalBtn.addEventListener('click', () => {
      if (uploadedVideoUrl) {
        showVideoPlayer(uploadedVideoUrl);
      }
    });

    aiBtn.addEventListener('click', () => {
      // TODO: Show AI processed version when available
      showToast('AI processing not yet implemented', 'info');
    });
  }

  return container;
}