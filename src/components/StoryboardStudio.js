import { muapi } from '../lib/muapi.js';
import { AuthModal } from './AuthModal.js';
import { createHelpToggle } from './HelpPanel.js';

const SHOT_TYPES = ['Wide Shot', 'Medium Shot', 'Close-Up', 'Extreme Close-Up', 'POV', 'Overhead', 'Low Angle'];

export function StoryboardStudio() {
  const container = document.createElement('div');
  container.className = 'w-full h-full flex flex-col bg-app-bg overflow-y-auto relative';

  const topBar = document.createElement('div');
  topBar.className = 'px-4 md:px-8 pt-6 pb-4 shrink-0';
  topBar.innerHTML = `
    <h1 class="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Storyboard Studio</h1>
    <p class="text-secondary text-xs mb-4">Plan your scenes with AI-generated storyboard frames</p>
  `;
  container.appendChild(topBar);

  const helpBtn = createHelpToggle('storyboard');
  helpBtn.classList.add('absolute', 'top-4', 'right-4', 'z-30');
  container.appendChild(helpBtn);

  const frames = [
    { prompt: '', shot: 'Wide Shot', imageUrl: null },
    { prompt: '', shot: 'Medium Shot', imageUrl: null },
    { prompt: '', shot: 'Close-Up', imageUrl: null },
  ];

  const controlBar = document.createElement('div');
  controlBar.className = 'px-4 md:px-8 mb-4 flex items-center gap-3';

  const addFrameBtn = document.createElement('button');
  addFrameBtn.className = 'px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all';
  addFrameBtn.textContent = '+ Add Frame';
  addFrameBtn.onclick = () => {
    frames.push({ prompt: '', shot: 'Wide Shot', imageUrl: null });
    renderFrames();
  };
  controlBar.appendChild(addFrameBtn);

  const genAllBtn = document.createElement('button');
  genAllBtn.className = 'px-4 py-2 bg-primary text-black rounded-xl text-xs font-bold hover:shadow-glow transition-all';
  genAllBtn.textContent = 'Generate All Frames';
  controlBar.appendChild(genAllBtn);
  container.appendChild(controlBar);

  const framesArea = document.createElement('div');
  framesArea.className = 'px-4 md:px-8 pb-8 flex gap-4 overflow-x-auto no-scrollbar';
  container.appendChild(framesArea);

  function renderFrames() {
    framesArea.innerHTML = '';
    frames.forEach((frame, idx) => {
      const card = document.createElement('div');
      card.className = 'shrink-0 w-72 bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col gap-3';

      const frameNum = document.createElement('div');
      frameNum.className = 'flex items-center justify-between';
      frameNum.innerHTML = `
        <span class="text-xs font-bold text-primary">Frame ${idx + 1}</span>
        <button class="text-muted hover:text-red-400 transition-colors text-xs remove-frame">&times;</button>
      `;
      card.appendChild(frameNum);

      const imageArea = document.createElement('div');
      imageArea.className = 'w-full aspect-video bg-white/[0.02] rounded-lg border border-white/5 flex items-center justify-center overflow-hidden';
      if (frame.imageUrl) {
        imageArea.innerHTML = `<img src="${frame.imageUrl}" class="w-full h-full object-cover">`;
      } else {
        imageArea.innerHTML = '<span class="text-muted text-xs">No image</span>';
      }
      card.appendChild(imageArea);

      const shotSelect = document.createElement('select');
      shotSelect.className = 'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none appearance-none cursor-pointer';
      SHOT_TYPES.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        opt.style.background = '#111';
        if (s === frame.shot) opt.selected = true;
        shotSelect.appendChild(opt);
      });
      shotSelect.onchange = () => { frame.shot = shotSelect.value; };
      card.appendChild(shotSelect);

      const promptInput = document.createElement('textarea');
      promptInput.className = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-muted focus:outline-none focus:border-primary/50 resize-none';
      promptInput.rows = 2;
      promptInput.placeholder = 'Describe this scene...';
      promptInput.value = frame.prompt;
      promptInput.oninput = () => { frame.prompt = promptInput.value; };
      card.appendChild(promptInput);

      const genFrameBtn = document.createElement('button');
      genFrameBtn.className = 'w-full bg-white/10 text-white py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-all';
      genFrameBtn.textContent = 'Generate Frame';
      genFrameBtn.onclick = () => generateFrame(idx, genFrameBtn, imageArea);
      card.appendChild(genFrameBtn);

      card.querySelector('.remove-frame').onclick = () => {
        if (frames.length > 1) { frames.splice(idx, 1); renderFrames(); }
      };

      framesArea.appendChild(card);
    });
  }

  async function generateFrame(idx, btn, imageArea) {
    const frame = frames[idx];
    if (!frame.prompt.trim()) { alert('Enter a scene description'); return; }
    const apiKey = localStorage.getItem('muapi_key');
    if (!apiKey) { AuthModal(() => generateFrame(idx, btn, imageArea)); return; }

    btn.disabled = true;
    btn.innerHTML = '<span class="animate-spin inline-block mr-2">&#9711;</span>';

    try {
      const prompt = `${frame.shot} cinematic storyboard frame: ${frame.prompt}, professional cinematography, 4K quality`;
      const result = await muapi.generateImage({ model: 'nano-banana', prompt, aspect_ratio: '16:9' });
      if (result?.url) {
        frame.imageUrl = result.url;
        imageArea.innerHTML = `<img src="${result.url}" class="w-full h-full object-cover">`;
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Generate Frame';
    }
  }

  genAllBtn.onclick = async () => {
    const apiKey = localStorage.getItem('muapi_key');
    if (!apiKey) { AuthModal(() => genAllBtn.click()); return; }

    genAllBtn.disabled = true;
    genAllBtn.innerHTML = '<span class="animate-spin inline-block mr-2">&#9711;</span> Generating...';

    for (let i = 0; i < frames.length; i++) {
      if (frames[i].prompt.trim()) {
        const card = framesArea.children[i];
        const btn = card.querySelector('button:last-child');
        const imageArea = card.querySelector('.aspect-video');
        await generateFrame(i, btn, imageArea);
      }
    }

    genAllBtn.disabled = false;
    genAllBtn.textContent = 'Generate All Frames';
  };

  renderFrames();
  return container;
}
