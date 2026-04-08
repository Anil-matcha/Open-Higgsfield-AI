export function TimelineEditorPage() {
  const container = document.createElement('div');
  container.className = 'w-full h-full';
  container.style.background = '#05070b';

  const iframe = document.createElement('iframe');
  iframe.title = 'Timeline Editor';
  iframe.style.cssText = 'width:100%;height:100%;border:0;background:#05070b;';
  iframe.sandbox = 'allow-scripts allow-same-origin';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Timeline Editor</title>
  <style>
    :root {
      --bg: #05070b;
      --panel: rgba(255,255,255,0.05);
      --panel-soft: rgba(255,255,255,0.03);
      --border: rgba(255,255,255,0.1);
      --border-soft: rgba(255,255,255,0.08);
      --text: #ffffff;
      --muted: rgba(255,255,255,0.6);
      --dim: rgba(255,255,255,0.4);
      --cyan: #22d3ee;
      --cyan-soft: rgba(34,211,238,0.2);
      --emerald: #34d399;
      --shadow: 0 20px 60px rgba(0,0,0,0.45);
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); }
    button, input, textarea, select { font: inherit; }
    body { padding: 18px; }
    .app-shell { max-width: 1500px; margin: 0 auto; }
    .header {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      margin-bottom: 16px; padding: 18px 20px; border-radius: 24px;
      border: 1px solid var(--border);
      background: linear-gradient(135deg, #171b24 0%, #07090d 45%, #111827 100%);
      box-shadow: var(--shadow);
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .icon-btn, .top-icon {
      border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85);
      display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
      transition: transform .15s ease, background .15s ease, border-color .15s ease;
    }
    .icon-btn:hover, .top-icon:hover, .mini-btn:hover, .rail-btn:hover, .tool-btn:hover, .clip:hover, .timeline-item:hover { transform: translateY(-1px); }

    /* Timeline Studio Styles */
    .timeline-item {
      position: absolute;
      height: 40px;
      background: linear-gradient(135deg, rgba(34,211,238,0.2), rgba(34,211,238,0.1));
      border: 1px solid rgba(34,211,238,0.3);
      border-radius: 6px;
      cursor: grab;
      display: flex;
      align-items: center;
      padding: 0 8px;
      transition: all 0.15s ease;
    }
    .timeline-item.active {
      border-color: var(--cyan);
      background: linear-gradient(135deg, rgba(34,211,238,0.3), rgba(34,211,238,0.2));
      box-shadow: 0 0 8px rgba(34,211,238,0.4);
    }
    .timeline-item.audio {
      background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.1));
      border-color: rgba(52,211,153,0.3);
    }
    .timeline-item.audio.active {
      border-color: var(--emerald);
      background: linear-gradient(135deg, rgba(52,211,153,0.3), rgba(52,211,153,0.2));
      box-shadow: 0 0 8px rgba(52,211,153,0.4);
    }
    .timeline-item .waveform-canvas {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.7;
    }
    .timeline-item .item-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--cyan);
      text-shadow: 0 0 4px rgba(34,211,238,0.5);
    }
    .timeline-item.audio .item-label {
      color: var(--emerald);
      text-shadow: 0 0 4px rgba(52,211,153,0.5);
    }

    .caption-item {
      position: absolute;
      height: 24px;
      background: rgba(0,0,0,0.7);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      cursor: grab;
      display: flex;
      align-items: center;
      padding: 0 8px;
      font-size: 11px;
      color: white;
    }
    .caption-item.active {
      border-color: var(--cyan);
      background: rgba(34,211,238,0.2);
    }
    .caption-item .caption-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .resize-handle {
      position: absolute;
      top: 0;
      width: 8px;
      height: 100%;
      background: var(--cyan);
      opacity: 0;
      cursor: ew-resize;
      transition: opacity 0.15s ease;
    }
    .timeline-item:hover .resize-handle,
    .caption-item:hover .resize-handle {
      opacity: 0.6;
    }
    .resize-handle.left { left: -4px; }
    .resize-handle.right { right: -4px; }

    .timeline-playhead {
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      background: var(--cyan);
      box-shadow: 0 0 8px rgba(34,211,238,0.6);
      z-index: 10;
      pointer-events: none;
    }
    .timeline-playhead::before {
      content: '';
      position: absolute;
      top: -6px;
      left: -4px;
      width: 10px;
      height: 10px;
      background: var(--cyan);
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(34,211,238,0.6);
    }
    .icon-btn { width: 40px; height: 40px; border-radius: 12px; }
    .brand-mark {
      width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; font-size: 22px;
      border: 1px solid rgba(34,211,238,0.2); background: rgba(34,211,238,0.1); box-shadow: 0 0 16px rgba(56,189,248,0.12);
    }
    .brand-title { font-size: 20px; font-weight: 900; letter-spacing: .04em; }
    .brand-sub { font-size: 10px; text-transform: uppercase; letter-spacing: .25em; color: var(--dim); }
    .project-head { text-align: center; }
    .project-head .title { font-size: 16px; font-weight: 700; }
    .project-head .sub { font-size: 10px; color: var(--dim); }
    .top-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; max-width: 420px; }
    .top-icon { width: 36px; height: 36px; border-radius: 10px; font-size: 18px; }
    .top-icon.active { border-color: rgba(34,211,238,0.4); background: rgba(34,211,238,0.2); }
    .ready-pill {
      margin-left: 4px; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(52,211,153,0.2);
      background: rgba(52,211,153,0.1); color: #bbf7d0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .ready-dot { width: 6px; height: 6px; border-radius: 999px; background: #86efac; }
    .main-grid { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 16px; }
    .left-col { min-width: 0; }
    .side-col { display: flex; flex-direction: column; gap: 16px; }
    .preview-card {
      position: relative; overflow: hidden; margin-bottom: 16px; border-radius: var(--radius-xl); aspect-ratio: 16 / 9;
      border: 1px solid var(--border-soft); background: #000; box-shadow: 0 0 70px rgba(56,189,248,0.14);
    }
    .preview-glow { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(34,211,238,0.12), transparent 55%); }
    .preview-inner {
      position: absolute; inset: 24px; border-radius: 22px; border: 1px solid rgba(34,211,238,0.15);
      background: linear-gradient(135deg, rgba(20,25,33,0.9), rgba(8,10,14,0.86));
      box-shadow: 0 0 60px rgba(34,211,238,0.1); display: flex; align-items: center; justify-content: center;
    }
    .preview-screen { text-align: center; }
    .preview-emoji { font-size: 72px; margin-bottom: 10px; }
    .preview-title { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.92); }
    .preview-sub { margin-top: 4px; font-size: 14px; color: rgba(255,255,255,0.45); }
    .preview-overlay {
      position: absolute; inset-inline: 0; bottom: 0; padding: 16px;
      background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2), transparent);
    }
    .time-row, .control-row { display: flex; align-items: center; justify-content: space-between; }
    .time-row { margin-bottom: 8px; font-size: 12px; color: rgba(255,255,255,0.6); }
    .progress-bar { height: 6px; border-radius: 999px; background: rgba(255,255,255,0.2); overflow: hidden; margin-bottom: 12px; }
    .progress-fill { height: 100%; width: 28%; border-radius: inherit; background: linear-gradient(to right, var(--cyan), var(--emerald)); }
    .control-row { justify-content: center; gap: 12px; }
    .circle-btn {
      width: 40px; height: 40px; border-radius: 999px; border: 1px solid transparent; background: rgba(255,255,255,0.1); color: white; cursor: pointer;
    }
    .circle-btn.primary { width: 48px; height: 48px; background: white; color: black; font-weight: 800; box-shadow: 0 10px 30px rgba(255,255,255,0.15); }
    .timeline-card, .side-card {
      border-radius: 24px; border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
      box-shadow: 0 20px 60px rgba(0,0,0,0.35); backdrop-filter: blur(20px);
    }
    .timeline-card { padding: 16px; }
    .side-card { padding: 14px; border-radius: 20px; box-shadow: var(--shadow); }
    .side-card.generate { border-color: rgba(34,211,238,0.2); background: linear-gradient(180deg, rgba(56,189,248,0.08), rgba(17,24,39,0.75)); }
    .card-title { margin-bottom: 12px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,0.82); }
    .card-title.cyan { color: #bae6fd; }
    .timeline-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    .toolbar-left, .toolbar-right, .tool-group, .pill-row, .floating-rail, .track-actions, .generate-types, .quick-commands { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .tool-group { gap: 4px; padding: 4px; border-radius: 14px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); }
    .tool-btn, .mini-btn, .chip, .command-btn, .rail-btn, .generate-type {
      border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.72); cursor: pointer; transition: all .15s ease;
    }
    .tool-btn { width: 32px; height: 32px; border-radius: 8px; font-size: 14px; }
    .tool-btn.active, .generate-type.active, .rail-btn.active { border-color: rgba(34,211,238,0.45); background: rgba(34,211,238,0.22); color: #cffafe; }
    .mini-btn, .chip, .command-btn { border-radius: 10px; padding: 8px 12px; font-size: 12px; }
    .pill-row { gap: 6px; }
    .pill { border-radius: 999px; padding: 7px 12px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); font-size: 10px; color: rgba(255,255,255,0.55); }
    .timeline-shell { position: relative; overflow: hidden; border-radius: 20px; border: 1px solid var(--border-soft); background: rgba(0,0,0,0.2); }
    .timeline-header { display: grid; grid-template-columns: 100px 1fr; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.03); font-size: 11px; text-transform: uppercase; letter-spacing: .25em; color: rgba(255,255,255,0.4); }
    .timeline-header div { padding: 10px 12px; }
    .timeline-body { position: relative; }
    .playhead-layer { position: absolute; left: 100px; right: 0; top: 0; bottom: 0; pointer-events: none; }
    .playhead-line { position: absolute; top: 0; bottom: 0; left: 32%; width: 2px; background: var(--cyan); box-shadow: 0 0 18px rgba(34,211,238,0.8); }
    .playhead-knob { position: absolute; top: 0; left: calc(32% - 4px); width: 10px; height: 10px; border-radius: 999px; background: var(--cyan); box-shadow: 0 0 15px rgba(34,211,238,0.8); }
    .track-row { display: grid; grid-template-columns: 100px 1fr; min-height: 62px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .track-row:last-child { border-bottom: 0; }
    .track-meta { padding: 10px 8px; border-right: 1px solid var(--border); background: rgba(0,0,0,0.35); }
    .track-name { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.86); }
    .track-actions { margin-top: 8px; gap: 4px; }
    .track-toggle {
      width: 18px; height: 18px; border-radius: 6px; border: 1px solid var(--border); background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9);
      font-size: 8px; cursor: pointer;
    }
    .track-toggle.locked { background: rgba(34,211,238,0.2); }
    .track-count { margin-top: 6px; font-size: 9px; color: rgba(255,255,255,0.35); }
    .track-lane {
      position: relative; background: rgba(255,255,255,0.02); min-height: 62px;
      background-image: linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 80px 100%;
    }
    .clip {
      position: absolute; top: 8px; bottom: 8px; border-radius: 12px; border: 1px solid var(--border); padding: 8px 10px;
      font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.86); background: rgba(255,255,255,0.1);
      box-shadow: 0 10px 24px rgba(0,0,0,0.25); display: flex; align-items: center; overflow: hidden; cursor: pointer;
    }
    .clip.active { border-color: rgba(34,211,238,0.5); background: rgba(34,211,238,0.2); color: #cffafe; }
    .clip-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .upload-btn, .primary-btn, .text-input, .text-area, .select-input {
      width: 100%; border-radius: 12px; border: 1px solid var(--border); background: rgba(0,0,0,0.4); color: white;
    }
    .upload-btn, .primary-btn { padding: 11px 14px; cursor: pointer; font-weight: 700; }
    .upload-btn { border-style: dashed; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.72); margin-bottom: 12px; }
    .media-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .media-note { margin: -4px 0 10px; font-size: 10px; line-height: 1.45; color: rgba(255,255,255,0.46); }
    .media-item {
      min-height: 64px; border-radius: 14px; border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
      display: flex; align-items: center; gap: 10px; padding: 10px 12px; text-align: left; cursor: pointer;
      transition: transform .15s ease, border-color .15s ease, background .15s ease;
    }
    .media-item:hover { transform: translateY(-1px); border-color: rgba(34,211,238,0.22); background: linear-gradient(180deg, rgba(34,211,238,0.08), rgba(255,255,255,0.03)); }
    .media-icon {
      width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.28); display: grid; place-items: center; font-size: 17px; flex: 0 0 auto;
    }
    .media-copy { min-width: 0; }
    .media-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.88); }
    .media-desc { margin-top: 2px; font-size: 9px; line-height: 1.35; color: rgba(255,255,255,0.45); }
    .generate-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .generate-types { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px; }
    .generate-type { border-radius: 12px; padding: 10px 6px; font-size: 10px; text-align: center; }
    .generate-type .emoji { display: block; font-size: 18px; margin-bottom: 6px; }
    .text-area { min-height: 88px; padding: 10px 12px; resize: vertical; margin-bottom: 8px; }
    .text-input, .select-input { padding: 10px 12px; margin-bottom: 8px; }
    .select-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
    .primary-btn { background: linear-gradient(to right, var(--cyan), var(--emerald)); color: #03131a; }
    .chat-stack { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
    .chat-bubble { border-radius: 10px; padding: 10px; font-size: 10px; }
    .chat-bubble.user { background: rgba(255,255,255,0.1); }
    .chat-bubble.ai { background: rgba(34,211,238,0.2); color: #cffafe; }
    .quick-commands { gap: 6px; }
    .command-btn { padding: 6px 10px; font-size: 9px; }
    .floating-rail {
      position: fixed; left: 50%; bottom: 16px; transform: translateX(-50%); z-index: 40;
      padding: 10px 14px; border-radius: 999px; border: 1px solid var(--border);
      background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
      backdrop-filter: blur(18px); box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .rail-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 7px 12px; border-radius: 12px; font-size: 10px; font-weight: 700; }
    .rail-btn .emoji { font-size: 16px; }
    .status-toast {
      position: fixed; right: 18px; bottom: 18px; max-width: 320px; padding: 12px 14px; border-radius: 14px;
      border: 1px solid rgba(34,211,238,0.18); background: rgba(7,12,18,0.95); color: rgba(255,255,255,0.86);
      box-shadow: 0 18px 50px rgba(0,0,0,0.4); font-size: 12px; opacity: 0; transform: translateY(10px); pointer-events: none; transition: all .2s ease;
    }
    .status-toast.show { opacity: 1; transform: translateY(0); }
    @media (max-width: 1180px) { .main-grid { grid-template-columns: 1fr; } }
    @media (max-width: 980px) { .top-actions { max-width: none; } .left-top { grid-template-columns: 1fr !important; } }
    @media (max-width: 860px) {
      .header { flex-direction: column; align-items: stretch; }
      .project-head { text-align: left; }
      .timeline-header, .track-row { grid-template-columns: 86px 1fr; }
      .playhead-layer { left: 86px; }
      .floating-rail { left: 16px; right: 16px; transform: none; justify-content: center; }
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <header class="header">
      <div class="brand">
        <button class="icon-btn" id="backBtn">←</button>
        <div class="brand-mark">🎬</div>
        <div>
          <div class="brand-title">TIMELINE</div>
          <div class="brand-sub">AI Video Editor</div>
        </div>
      </div>
      <div class="project-head">
        <div class="title" id="projectTitle">Untitled Project</div>
        <div class="sub" id="projectSub">Working timeline preview</div>
      </div>
      <div class="top-actions" id="topActions"></div>
    </header>
    <div class="main-grid">
      <div class="left-col">
        <div class="left-top" style="display:grid; grid-template-columns: 300px minmax(0,1fr); gap:16px; margin-bottom:16px; align-items:stretch;">
          <aside class="side-card" style="min-height:100%; display:flex; flex-direction:column;">
            <div class="card-title">💬 AI</div>
            <div class="chat-stack" id="chatStack"></div>
            <input class="text-input" id="chatInput" placeholder="Type command..." />
            <div class="quick-commands" id="quickCommands" style="margin-top:2px;"></div>
          </aside>
          <section class="preview-card" style="margin-bottom:0;">
            <div class="preview-glow"></div>
            <div class="preview-inner">
              <div class="preview-screen">
                <div class="preview-emoji" id="previewEmoji">🎥</div>
                <div class="preview-title" id="previewTitle">Center Preview</div>
                <div class="preview-sub" id="previewSubtitle">Glow preview styled like the render page</div>
              </div>
            </div>
            <div class="preview-overlay">
              <div class="time-row">
                <span id="currentTime">00:12.40</span>
                <span id="totalTime">01:00.00</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
              <div class="control-row">
                <button class="circle-btn" id="rewindBtn">⏮</button>
                <button class="circle-btn primary" id="playBtn">▶</button>
                <button class="circle-btn" id="stopBtn">⏹</button>
              </div>
            </div>
          </section>
        </div>
        <section class="timeline-card">
          <div class="timeline-top">
            <div class="toolbar-left">
              <div class="tool-group" id="toolGroup"></div>
              <button class="mini-btn" data-action="zoom-out">🔍-</button>
              <button class="mini-btn" data-action="zoom-in">🔍+</button>
              <button class="mini-btn" data-add-track="Video">+Video</button>
              <button class="mini-btn" data-add-track="Audio">+Audio</button>
              <button class="mini-btn" data-add-track="Text">+Text</button>
              <button class="mini-btn" data-add-track="B-Roll">+B-Roll</button>
            </div>
            <div class="pill-row" id="pillRow"></div>
          </div>
          <div class="timeline-shell">
            <div class="timeline-header">
              <div>Tracks</div>
              <div>Timeline</div>
            </div>
            <div class="timeline-body" id="timelineBody">
              <div class="playhead-layer">
                <div class="playhead-line" id="playheadLine"></div>
                <div class="playhead-knob" id="playheadKnob"></div>
              </div>
              <div id="trackRows"></div>
            </div>
          </div>
        </section>
      </div>
      <div class="side-col">
        <aside class="side-card">
          <div class="card-title">📁 Media</div>
          <button class="upload-btn" id="uploadBtn">Upload</button>
          <div class="media-note">Choose what you want to add to the timeline. Each tile inserts a different type of source asset.</div>
          <div class="media-grid" id="mediaGrid"></div>
        </aside>
        <aside class="side-card generate">
          <div class="generate-head">
            <div class="card-title cyan">⚡ Generate</div>
            <div style="color: rgba(255,255,255,0.4)">✕</div>
          </div>
          <div class="generate-types" id="generateTypes"></div>
          <textarea class="text-area" id="promptInput" placeholder="A cinematic shot of..."></textarea>
          <input class="text-input" id="negativeInput" placeholder="Negative prompt" />
          <div class="select-row">
            <select class="select-input" id="durationSelect">
              <option>5s</option>
              <option>8s</option>
              <option>12s</option>
            </select>
            <select class="select-input" id="aspectSelect">
              <option>16:9</option>
              <option>9:16</option>
              <option>1:1</option>
            </select>
            <select class="select-input" id="styleSelect">
              <option>Cinematic</option>
              <option>Commercial</option>
              <option>Documentary</option>
            </select>
          </div>
          <button class="primary-btn" id="generateBtn">⚡ Generate</button>
        </aside>
      </div>
    </div>
  </div>
  <div class="floating-rail" id="floatingRail"></div>
  <div class="status-toast" id="toast"></div>
  <script>
    // Enhanced Timeline Studio Data Model
    const state = {
      // Project-level metadata (Timeline Studio integration)
      project: {
        id: 'project-1',
        fps: 30,
        duration: 180000, // ms
        aspectRatio: '16:9',
        tracks: [],
        assets: [
          {
            id: 'asset-1',
            type: 'video',
            url: 'video.mp4',
            thumbnail: 'thumb.jpg',
            duration: 5000,
            waveform: [0.1, 0.3, 0.2, 0.8, 0.5, 0.7, 0.4, 0.6, 0.9, 0.3],
            proxyUrl: 'proxy.mp4',
            metadata: {}
          },
          {
            id: 'asset-2',
            type: 'audio',
            url: 'music.mp3',
            thumbnail: 'audio-thumb.jpg',
            duration: 42000,
            waveform: [0.2, 0.5, 0.8, 0.6, 0.3, 0.7, 0.9, 0.4, 0.1, 0.6, 0.8, 0.5, 0.3, 0.7, 0.9],
            metadata: {}
          }
        ],
        markers: [
          { id: 'marker-1', time: 2000, label: 'Opening', color: '#22d3ee' },
          { id: 'marker-2', time: 10000, label: 'Key Moment', color: '#34d399' }
        ],
        captions: [
          { id: 'caption-1', start: 2000, end: 5000, text: 'Welcome to the video', style: { fontSize: 24, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.7)' } },
          { id: 'caption-2', start: 8000, end: 12000, text: 'This is an amazing feature', style: { fontSize: 20, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.7)' } }
        ],
        effects: []
      },

      // Legacy properties for backward compatibility
      projectTitle: 'Untitled Project',
      selectedTool: 'Select',
      selectedClipId: 1,
      generateType: 'Text',
      playing: false,
      playheadPercent: 32,
      zoom: 1,
      timelineSeconds: 60,

      // Enhanced tracks with Timeline Studio structure
      tracks: [
        {
          id: 'video-1',
          type: 'video',
          name: 'Video',
          locked: false,
          muted: false,
          items: [
            {
              id: 1,
              assetId: 'asset-1',
              type: 'video',
              start: 0,
              end: 5000,
              sourceStart: 0,
              sourceEnd: 5000,
              lane: 0,
              x: 8,
              width: 18,
              trimIn: 0,
              trimOut: 0,
              volume: 1.0,
              playbackRate: 1.0,
              effects: []
            },
            {
              id: 2,
              assetId: 'asset-1',
              type: 'video',
              start: 8500,
              end: 13500,
              sourceStart: 1000,
              sourceEnd: 6000,
              lane: 0,
              x: 34,
              width: 16,
              trimIn: 1000,
              trimOut: 1000,
              volume: 1.0,
              playbackRate: 1.0,
              effects: []
            }
          ]
        },
        {
          id: 'audio-1',
          type: 'audio',
          name: 'Audio',
          locked: false,
          muted: false,
          items: [
            {
              id: 3,
              assetId: 'asset-2',
              type: 'audio',
              start: 0,
              end: 42000,
              sourceStart: 0,
              sourceEnd: 42000,
              lane: 0,
              x: 5,
              width: 42,
              trimIn: 0,
              trimOut: 0,
              volume: 0.8,
              playbackRate: 1.0,
              effects: []
            }
          ]
        },
        {
          id: 'caption-1',
          type: 'captions',
          name: 'Captions',
          locked: false,
          muted: false,
          items: [
            {
              id: 'caption-1',
              type: 'caption',
              start: 2000,
              end: 5000,
              text: 'Welcome to the video',
              style: { fontSize: 24, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.7)' },
              lane: 0,
              x: 12,
              width: 8
            },
            {
              id: 'caption-2',
              type: 'caption',
              start: 8000,
              end: 12000,
              text: 'This is an amazing feature',
              style: { fontSize: 20, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.7)' },
              lane: 0,
              x: 32,
              width: 12
            }
          ]
        }
      ],

      // Timeline Studio interaction state
      editor: {
        selectedItemId: null,
        playhead: 2000, // current time in ms
        zoom: 1,
        scrollX: 0,
        dragging: null,
        resizing: null,
        snapping: true,
        tool: 'select'
      },

      // Playback engine state
      playback: {
        playing: false,
        currentTime: 0,
        fps: 30,
        seek: (time) => { /* seek implementation */ },
        play: () => { /* play implementation */ },
        pause: () => { /* pause implementation */ },
        syncPreview: () => { /* sync preview */ },
        syncTimeline: () => { /* sync timeline */ },
        syncCaptions: () => { /* sync captions */ }
      },

      // Legacy UI state for backward compatibility
      tools: [['↖', 'Select'], ['✂', 'Blade'], ['⤵', 'Ripple'], ['⤶', 'Roll'], ['⇿', 'Slip'], ['⇆', 'Slide'], ['🔍', 'Zoom'], ['✋', 'Hand']],
      pills: ['Text to Video', 'Image to Video', 'Retake', 'Extend', 'B-Roll', 'Music Gen', 'Audio Sync', 'Fill Gap AI', 'Elements', 'Dual Viewer'],
      topIcons: ['👁','📺','📁','⚡','🎵','🔊','🎞️','👤','⚙️','💬','📋'],
      media: [
        { icon: '🎬', label: 'Video Clip', desc: 'Insert a source shot or generated video clip.' },
        { icon: '🖼️', label: 'Image Frame', desc: 'Add still images, frames, or storyboard art.' },
        { icon: '🎵', label: 'Audio Track', desc: 'Place music, voiceover, or sound design assets.' },
        { icon: '🎞️', label: 'B-Roll Asset', desc: 'Drop in cutaways, overlays, or support footage.' }
      ],
      generateTypes: [['✍️', 'Text'], ['🖼️', 'Image'], ['🔄', 'Retake'], ['➡️', 'Extend'], ['🎞️', 'B-Roll']],
      quickCommands: ['⚡Generate','Retake','Extend','B-Roll'],
      railActions: [['⚡', 'Generate', true], ['✂️', 'Split'], ['🎬', 'Scenes'], ['💬', 'Subtitle'], ['🎞️', 'B-Roll'], ['⏱️', 'Speed'], ['🪄', 'Stabilize'], ['📝', 'Text']],
      chat: [
        { role: 'user', text: 'Generate a better opening shot' },
        { role: 'ai', text: 'Opening idea ready. Use Generate or Retake.' }
      ]
    };
    const els = {
      topActions: document.getElementById('topActions'),
      toolGroup: document.getElementById('toolGroup'),
      pillRow: document.getElementById('pillRow'),
      trackRows: document.getElementById('trackRows'),
      mediaGrid: document.getElementById('mediaGrid'),
      generateTypes: document.getElementById('generateTypes'),
      chatStack: document.getElementById('chatStack'),
      quickCommands: document.getElementById('quickCommands'),
      floatingRail: document.getElementById('floatingRail'),
      playBtn: document.getElementById('playBtn'),
      stopBtn: document.getElementById('stopBtn'),
      rewindBtn: document.getElementById('rewindBtn'),
      currentTime: document.getElementById('currentTime'),
      totalTime: document.getElementById('totalTime'),
      progressFill: document.getElementById('progressFill'),
      previewTitle: document.getElementById('previewTitle'),
      previewSubtitle: document.getElementById('previewSubtitle'),
      previewEmoji: document.getElementById('previewEmoji'),
      playheadLine: document.getElementById('playheadLine'),
      playheadKnob: document.getElementById('playheadKnob'),
      projectTitle: document.getElementById('projectTitle'),
      promptInput: document.getElementById('promptInput'),
      negativeInput: document.getElementById('negativeInput'),
      durationSelect: document.getElementById('durationSelect'),
      aspectSelect: document.getElementById('aspectSelect'),
      styleSelect: document.getElementById('styleSelect'),
      generateBtn: document.getElementById('generateBtn'),
      chatInput: document.getElementById('chatInput'),
      toast: document.getElementById('toast')
    };
    let playbackTimer = null;
    function showToast(message) {
      els.toast.textContent = message;
      els.toast.classList.add('show');
      clearTimeout(showToast._timer);
      showToast._timer = setTimeout(() => els.toast.classList.remove('show'), 1800);
    }
    function formatTimeFromPercent(percent, totalSeconds) {
      const current = (percent / 100) * totalSeconds;
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      const hundredths = Math.floor((current % 1) * 100);
      return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + '.' + String(hundredths).padStart(2, '0');
    }
    function renderTopActions() {
      els.topActions.innerHTML = '';
      state.topIcons.forEach((icon, i) => {
        const btn = document.createElement('button');
        btn.className = 'top-icon ' + (i === 3 ? 'active' : '');
        btn.textContent = icon;
        btn.addEventListener('click', () => showToast(icon + ' action clicked'));
        els.topActions.appendChild(btn);
      });
      const ready = document.createElement('div');
      ready.className = 'ready-pill';
      ready.innerHTML = '<span class="ready-dot"></span>Ready';
      els.topActions.appendChild(ready);
    }
    function renderTools() {
      els.toolGroup.innerHTML = '';
      state.tools.forEach(([icon, label]) => {
        const btn = document.createElement('button');
        btn.className = 'tool-btn ' + (state.selectedTool === label ? 'active' : '');
        btn.title = label;
        btn.textContent = icon;
        btn.addEventListener('click', () => { state.selectedTool = label; state.editor.tool = label.toLowerCase(); renderTools(); updatePreview(); showToast(label + ' tool selected'); });
        els.toolGroup.appendChild(btn);
      });
    }
    function renderPills() {
      els.pillRow.innerHTML = '';
      state.pills.forEach((pill) => {
        const span = document.createElement('span');
        span.className = 'pill';
        span.textContent = pill;
        els.pillRow.appendChild(span);
      });
    }
    function renderTracks() {
      els.trackRows.innerHTML = '';
      state.tracks.forEach((track) => {
        const row = document.createElement('div');
        row.className = 'track-row';
        const meta = document.createElement('div');
        meta.className = 'track-meta';
        meta.innerHTML = '<div class="track-name">' + track.name + '</div><div class="track-actions"><button class="track-toggle ' + (track.muted ? 'locked' : '') + '" data-toggle="mute">M</button><button class="track-toggle ' + (track.solo ? 'locked' : '') + '" data-toggle="solo">S</button><button class="track-toggle ' + (track.locked ? 'locked' : '') + '" data-toggle="lock">L</button></div><div class="track-count">' + track.items.length + ' items</div>';
        meta.querySelectorAll('.track-toggle').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = btn.dataset.toggle;
            if (key === 'mute') track.muted = !track.muted;
            if (key === 'solo') track.solo = !track.solo;
            if (key === 'lock') track.locked = !track.locked;
            renderTracks();
            showToast(track.name + ' ' + key + ' toggled');
          });
        });

        const lane = document.createElement('div');
        lane.className = 'track-lane';
        lane.style.transform = 'scaleX(' + state.editor.zoom + ')';
        lane.style.transformOrigin = '0 0';

        // Timeline click for playhead positioning
        lane.addEventListener('click', (event) => {
          if (event.target !== lane) return;
          const rect = lane.getBoundingClientRect();
          const percent = ((event.clientX - rect.left) / rect.width) * 100;
          state.playheadPercent = Math.max(0, Math.min(100, percent));
          state.editor.playhead = (percent / 100) * state.project.duration;
          updatePlaybackUI();
          syncCaptions();
        });

        // Render items for this track
        track.items.forEach((item) => {
          if (item.type === 'caption') {
            // Render caption items
            const captionEl = document.createElement('div');
            captionEl.className = 'caption-item ' + (state.editor.selectedItemId === item.id ? 'active' : '');
            captionEl.style.left = item.x + '%';
            captionEl.style.width = item.width + '%';
            captionEl.innerHTML = '<span class="caption-text">' + item.text + '</span>';

            // Caption interactions
            captionEl.addEventListener('pointerdown', (e) => {
              e.stopPropagation();
              state.editor.selectedItemId = item.id;
              handlePointerDown(e, item.id);
            });

            // Add caption resize handles
            const leftHandle = document.createElement('div');
            leftHandle.className = 'resize-handle left';
            leftHandle.addEventListener('pointerdown', (e) => {
              e.stopPropagation();
              handlePointerDown(e, item.id, 'left');
            });
            captionEl.appendChild(leftHandle);

            const rightHandle = document.createElement('div');
            rightHandle.className = 'resize-handle right';
            rightHandle.addEventListener('pointerdown', (e) => {
              e.stopPropagation();
              handlePointerDown(e, item.id, 'right');
            });
            captionEl.appendChild(rightHandle);

            lane.appendChild(captionEl);
          } else {
            // Render media items (video/audio)
            const itemEl = document.createElement('div');
            itemEl.className = 'timeline-item ' + item.type + ' ' + (state.editor.selectedItemId === item.id ? 'active' : '');
            itemEl.style.left = item.x + '%';
            itemEl.style.width = item.width + '%';

            // Add waveform for audio items
            if (item.type === 'audio') {
              const waveformCanvas = document.createElement('canvas');
              waveformCanvas.className = 'waveform-canvas';
              waveformCanvas.width = item.width * 2; // Scale for better resolution
              waveformCanvas.height = 40;

              const asset = state.project.assets.find(a => a.id === item.assetId);
              if (asset && asset.waveform) {
                drawWaveform(waveformCanvas, asset.waveform, waveformCanvas.width, waveformCanvas.height);
              }

              itemEl.appendChild(waveformCanvas);
            }

            // Item label
            const label = document.createElement('div');
            label.className = 'item-label';
            const asset = state.project.assets.find(a => a.id === item.assetId);
            label.textContent = asset ? asset.type.toUpperCase() : item.type.toUpperCase();
            itemEl.appendChild(label);

            // Item interactions
            itemEl.addEventListener('pointerdown', (e) => {
              e.stopPropagation();
              state.editor.selectedItemId = item.id;
              handlePointerDown(e, item.id);
            });

            // Add resize handles for media items
            const leftHandle = document.createElement('div');
            leftHandle.className = 'resize-handle left';
            leftHandle.addEventListener('pointerdown', (e) => {
              e.stopPropagation();
              handlePointerDown(e, item.id, 'left');
            });
            itemEl.appendChild(leftHandle);

            const rightHandle = document.createElement('div');
            rightHandle.className = 'resize-handle right';
            rightHandle.addEventListener('pointerdown', (e) => {
              e.stopPropagation();
              handlePointerDown(e, item.id, 'right');
            });
            itemEl.appendChild(rightHandle);

            lane.appendChild(itemEl);
          }
        });

        row.appendChild(meta);
        row.appendChild(lane);
        els.trackRows.appendChild(row);
      });

      // Render playhead
      renderPlayhead();
    }

    function renderPlayhead() {
      // Remove existing playhead
      const existingPlayhead = document.querySelector('.timeline-playhead');
      if (existingPlayhead) existingPlayhead.remove();

      // Add new playhead
      const playhead = document.createElement('div');
      playhead.className = 'timeline-playhead';
      playhead.style.left = state.playheadPercent + '%';
      document.querySelector('.track-lane')?.appendChild(playhead);
    }

    function syncCaptions() {
      const activeCaptions = state.project.captions.filter(caption =>
        state.editor.playhead >= caption.start && state.editor.playhead <= caption.end
      );

      // Update preview with active captions
      const captionDisplay = activeCaptions.map(c => c.text).join(' ');
      els.previewSubtitle.textContent = captionDisplay || 'No active captions';
    }

    // Timeline Studio Features - Enhanced Interactions
    function handlePointerDown(event, itemId, edge = null) {
      event.preventDefault();

      if (state.editor.tool === 'blade') {
        // Split clip at click position
        splitClipAtPosition(itemId, event.offsetX);
        return;
      }

      if (edge) {
        // Start resizing
        state.editor.resizing = { itemId, edge };
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
      } else {
        // Start dragging
        const item = findItemById(itemId);
        if (item) {
          state.editor.dragging = {
            itemId,
            startX: event.clientX,
            startItemX: item.x
          };
          document.addEventListener('pointermove', handlePointerMove);
          document.addEventListener('pointerup', handlePointerUp);
        }
      }
    }

    function handlePointerMove(event) {
      if (state.editor.resizing) {
        resizeItem(state.editor.resizing.itemId, event.clientX, state.editor.resizing.edge);
      } else if (state.editor.dragging) {
        moveItem(state.editor.dragging.itemId, event.clientX);
      }
    }

    function handlePointerUp() {
      state.editor.resizing = null;
      state.editor.dragging = null;
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      renderTracks();
    }

    function findItemById(itemId) {
      for (const track of state.tracks) {
        const item = track.items.find(item => item.id === itemId);
        if (item) return item;
      }
      return null;
    }

    function findTrackByItemId(itemId) {
      return state.tracks.find(track => track.items.some(item => item.id === itemId));
    }

    function moveItem(itemId, clientX) {
      const item = findItemById(itemId);
      if (!item) return;

      const timelineEl = document.querySelector('.track-lane');
      const rect = timelineEl.getBoundingClientRect();
      const newX = ((clientX - rect.left) / rect.width) * 100;

      // Snap to grid if enabled
      if (state.editor.snapping) {
        item.x = Math.round(newX / 2) * 2; // Snap to 2% increments
      } else {
        item.x = Math.max(0, Math.min(100 - item.width, newX));
      }

      // Update start/end times based on position
      const pixelsPerSecond = (rect.width / 100) / (state.project.duration / 1000);
      item.start = (item.x / 100) * state.project.duration;
      item.end = item.start + ((item.width / 100) * state.project.duration);
    }

    function resizeItem(itemId, clientX, edge) {
      const item = findItemById(itemId);
      if (!item) return;

      const timelineEl = document.querySelector('.track-lane');
      const rect = timelineEl.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;

      if (edge === 'left') {
        const newWidth = item.x + item.width - percent;
        if (newWidth > 1) {
          item.x = percent;
          item.width = newWidth;
          item.start = (item.x / 100) * state.project.duration;
          item.trimIn = ((item.x - percent) / item.width) * (item.sourceEnd - item.sourceStart);
        }
      } else if (edge === 'right') {
        const newWidth = percent - item.x;
        if (newWidth > 1) {
          item.width = newWidth;
          item.end = (percent / 100) * state.project.duration;
          item.trimOut = ((percent - item.x - item.width) / item.width) * (item.sourceEnd - item.sourceStart);
        }
      }
    }

    function splitClipAtPosition(itemId, offsetX) {
      const item = findItemById(itemId);
      const track = findTrackByItemId(itemId);
      if (!item || !track) return;

      const timelineEl = document.querySelector('.track-lane');
      const rect = timelineEl.getBoundingClientRect();
      const percent = (offsetX / rect.width) * 100;

      // Calculate split time
      const splitTime = (percent / 100) * state.project.duration;
      if (splitTime <= item.start || splitTime >= item.end) return;

      // Create second half
      const secondHalf = {
        ...item,
        id: Date.now(),
        start: splitTime,
        end: item.end,
        sourceStart: item.sourceStart + (splitTime - item.start) * (item.playbackRate || 1),
        x: percent,
        width: item.width - (percent - item.x),
        trimIn: item.trimIn + (splitTime - item.start)
      };

      // Update first half
      item.end = splitTime;
      item.width = percent - item.x;
      item.trimOut = item.trimIn + (splitTime - item.start);

      // Add second half to track
      track.items.push(secondHalf);
      track.items.sort((a, b) => a.start - b.start);

      renderTracks();
      showToast('Clip split at ' + formatTimeFromPercent(percent, state.timelineSeconds));
    }

    function drawWaveform(canvas, waveform, width, height) {
      if (!canvas || !waveform || waveform.length === 0) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);

      const step = waveform.length / width;
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const peak = waveform[Math.floor(x * step)] || 0;
        const y = (1 - peak) * height / 2;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    function applyTimelinePatch(patch) {
      try {
        patch.actions.forEach(action => {
          switch (action.type) {
            case 'splitClip':
              // Find clip and split at time
              break;
            case 'removeClipRange':
              // Remove portion of clip
              break;
            case 'addCaptionTrack':
              // Add captions
              if (action.captions) {
                state.project.captions.push(...action.captions);
              }
              break;
            case 'createSequence':
              // Create new sequence of clips
              break;
          }
        });

        renderTracks();
        showToast('AI changes applied successfully');
      } catch (error) {
        showToast('Error applying AI changes: ' + error.message);
      }
    }

    function renderMedia() {
      els.mediaGrid.innerHTML = '';
      state.media.forEach((media, index) => {
        const item = document.createElement('button');
        item.className = 'media-item';
        item.innerHTML = '<span class="media-icon">' + media.icon + '</span><span class="media-copy"><div class="media-label">' + media.label + '</div><div class="media-desc">' + media.desc + '</div></span>';
        item.addEventListener('click', () => {
          const targetTrack = media.label === 'Audio Track' ? (state.tracks.find((t) => t.name === 'Audio') || state.tracks[1] || state.tracks[0]) : media.label === 'Image Frame' ? (state.tracks.find((t) => t.name === 'Text') || state.tracks[0]) : media.label === 'B-Roll Asset' ? (state.tracks.find((t) => t.name === 'B-Roll') || state.tracks[0]) : (state.tracks.find((t) => t.name === 'Video') || state.tracks[0]);
          const newId = Date.now() + index;
          targetTrack.clips.push({ id: newId, name: media.label + ' ' + (targetTrack.clips.length + 1), left: Math.min(78, 8 + targetTrack.clips.length * 10), width: 12, type: media.label === 'Audio Track' ? 'audio' : media.label === 'Image Frame' ? 'text' : media.label === 'B-Roll Asset' ? 'broll' : 'video' });
          state.selectedClipId = newId;
          renderTracks();
          updatePreview();
          showToast(media.label + ' inserted into ' + targetTrack.name + ' track');
        });
        els.mediaGrid.appendChild(item);
      });
    }
    function renderGenerateTypes() {
      els.generateTypes.innerHTML = '';
      state.generateTypes.forEach(([icon, label]) => {
        const btn = document.createElement('button');
        btn.className = 'generate-type ' + (state.generateType === label ? 'active' : '');
        btn.innerHTML = '<span class="emoji">' + icon + '</span><span>' + label + '</span>';
        btn.addEventListener('click', () => { state.generateType = label; renderGenerateTypes(); showToast(label + ' mode selected'); });
        els.generateTypes.appendChild(btn);
      });
    }
    function renderChat() {
      els.chatStack.innerHTML = '';
      state.chat.forEach((entry) => {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + entry.role;
        bubble.textContent = entry.text;
        els.chatStack.appendChild(bubble);
      });
    }
    function renderQuickCommands() {
      els.quickCommands.innerHTML = '';
      state.quickCommands.forEach((command) => {
        const btn = document.createElement('button');
        btn.className = 'command-btn';
        btn.textContent = command;
        btn.addEventListener('click', () => { els.chatInput.value = command; handleChatSubmit(); });
        els.quickCommands.appendChild(btn);
      });
    }
    function renderRail() {
      els.floatingRail.innerHTML = '';
      state.railActions.forEach(([icon, label, active]) => {
        const btn = document.createElement('button');
        btn.className = 'rail-btn ' + (active ? 'active' : '');
        btn.innerHTML = '<span class="emoji">' + icon + '</span><span>' + label + '</span>';
        btn.addEventListener('click', () => showToast(label + ' action triggered'));
        els.floatingRail.appendChild(btn);
      });
    }
    function updatePreview(clip) {
      const selected = clip || state.tracks.flatMap(t => t.clips).find(c => c.id === state.selectedClipId);
      els.projectTitle.textContent = state.projectTitle;
      if (selected) {
        els.previewTitle.textContent = selected.name;
        els.previewSubtitle.textContent = state.selectedTool + ' tool active • ' + state.generateType + ' generation ready';
        els.previewEmoji.textContent = selected.type === 'audio' ? '🎵' : selected.type === 'text' ? '📝' : selected.type === 'broll' ? '🎞️' : '🎥';
      } else {
        els.previewTitle.textContent = 'Center Preview';
        els.previewSubtitle.textContent = 'Glow preview styled like the render page';
        els.previewEmoji.textContent = '🎥';
      }
    }
    function updatePlaybackUI() {
      els.progressFill.style.width = state.playheadPercent + '%';
      els.playheadLine.style.left = state.playheadPercent + '%';
      els.playheadKnob.style.left = 'calc(' + state.playheadPercent + '% - 4px)';
      els.currentTime.textContent = formatTimeFromPercent(state.playheadPercent, state.timelineSeconds);
      els.totalTime.textContent = formatTimeFromPercent(100, state.timelineSeconds);
      els.playBtn.textContent = state.playing ? '❚❚' : '▶';
    }
    function togglePlayback() {
      state.playing = !state.playing;
      if (state.playing) {
        playbackTimer = setInterval(() => {
          state.playheadPercent += 0.6;
          if (state.playheadPercent >= 100) { state.playheadPercent = 100; state.playing = false; clearInterval(playbackTimer); }
          updatePlaybackUI();
        }, 120);
      } else { clearInterval(playbackTimer); }
      updatePlaybackUI();
    }
    function stopPlayback() { state.playing = false; clearInterval(playbackTimer); state.playheadPercent = 0; updatePlaybackUI(); }
    function rewindPlayback() { state.playing = false; clearInterval(playbackTimer); state.playheadPercent = Math.max(0, state.playheadPercent - 10); updatePlaybackUI(); }
    function generateClip() {
      const prompt = els.promptInput.value.trim() || (state.generateType + ' cinematic shot');
      const track = state.tracks.find(t => t.name === 'Video') || state.tracks[0];
      const clipId = Date.now();
      track.clips.push({ id: clipId, name: state.generateType + ': ' + prompt.slice(0, 18), left: Math.min(76, 10 + track.clips.length * 9), width: 14, type: 'video' });
      state.selectedClipId = clipId;
      state.chat.push({ role: 'user', text: state.generateType + ' generate: ' + prompt });
      state.chat.push({ role: 'ai', text: 'Created a ' + state.generateType.toLowerCase() + ' clip with ' + els.durationSelect.value + ', ' + els.aspectSelect.value + ', ' + els.styleSelect.value + '.' });
      renderTracks();
      renderChat();
      updatePreview();
      showToast(state.generateType + ' clip added to timeline');
    }
    function handleChatSubmit() {
      const text = els.chatInput.value.trim();
      if (!text) return;
      state.chat.push({ role: 'user', text });
      let reply = 'Command added to the workflow.';
      if (/generate/i.test(text)) reply = 'Generate command staged. Use the Generate panel to create the clip.';
      if (/retake/i.test(text)) reply = 'Retake command staged for the selected clip.';
      if (/extend/i.test(text)) reply = 'Extend command queued for the selected clip.';
      if (/b-roll|broll/i.test(text)) reply = 'B-Roll suggestion added to the sequence.';
      state.chat.push({ role: 'ai', text: reply });
      els.chatInput.value = '';
      renderChat();
      showToast('AI command processed');
    }
    function addTrack(type) {
      const id = type.toLowerCase() + '-' + Date.now();
      state.tracks.push({ id, name: type, muted: false, solo: false, locked: false, clips: [] });
      renderTracks();
      showToast(type + ' track added');
    }
    function bindEvents() {
      els.playBtn.addEventListener('click', togglePlayback);
      els.stopBtn.addEventListener('click', stopPlayback);
      els.rewindBtn.addEventListener('click', rewindPlayback);
      els.generateBtn.addEventListener('click', generateClip);
      els.chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleChatSubmit(); });
      document.querySelectorAll('[data-add-track]').forEach((btn) => { btn.addEventListener('click', () => addTrack(btn.dataset.addTrack)); });
      document.querySelectorAll('[data-action="zoom-in"]').forEach((btn) => btn.addEventListener('click', () => { state.zoom = Math.min(2, state.zoom + 0.1); showToast('Zoom ' + state.zoom.toFixed(1) + 'x'); }));
      document.querySelectorAll('[data-action="zoom-out"]').forEach((btn) => btn.addEventListener('click', () => { state.zoom = Math.max(0.5, state.zoom - 0.1); showToast('Zoom ' + state.zoom.toFixed(1) + 'x'); }));
      document.getElementById('uploadBtn').addEventListener('click', () => showToast('Upload flow placeholder triggered'));
      document.getElementById('backBtn').addEventListener('click', () => { if (parent && parent.window && parent.window.navigate) { parent.window.navigate('apps'); } else { showToast('Back action clicked'); } });
    }
    function renderAll() { renderTopActions(); renderTools(); renderPills(); renderTracks(); renderMedia(); renderGenerateTypes(); renderChat(); renderQuickCommands(); renderRail(); updatePreview(); updatePlaybackUI(); }
    renderAll();
    bindEvents();
  </script>
</body>
</html>`;

  iframe.srcdoc = html;
  container.appendChild(iframe);

  // Cleanup function to clear timers
  container.cleanup = () => {
    if (playbackTimer) {
      clearInterval(playbackTimer);
      playbackTimer = null;
    }
  };

  return container;
}
