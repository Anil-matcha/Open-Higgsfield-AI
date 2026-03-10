import { muapi } from '../lib/muapi.js';
import { AuthModal } from './AuthModal.js';
import { createUploadPicker } from './UploadPicker.js';
import { createHelpToggle } from './HelpPanel.js';

const CHARACTER_MODELS = [
  { id: 'flux-pulid', name: 'Flux PuLID', description: 'Face ID preservation with text prompt' },
  { id: 'minimax-image-01-subject-reference', name: 'Subject Reference', description: 'Maintain subject consistency across images' },
];

export function CharacterStudio() {
  const container = document.createElement('div');
  container.className = 'w-full h-full flex flex-col items-center bg-app-bg overflow-y-auto p-6 md:p-10 relative';

  let uploadedUrl = null;
  let selectedModel = CHARACTER_MODELS[0];

  const header = document.createElement('div');
  header.className = 'mb-8 animate-fade-in-up text-center';
  header.innerHTML = `
    <div class="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 mb-4 mx-auto">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-rose-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>
    <h1 class="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">Character Studio</h1>
    <p class="text-secondary text-sm max-w-md mx-auto">Generate consistent character images using face ID preservation</p>
  `;
  container.appendChild(header);

  const helpBtn = createHelpToggle('character');
  helpBtn.classList.add('absolute', 'top-4', 'right-4', 'z-30');
  container.appendChild(helpBtn);

  const formCard = document.createElement('div');
  formCard.className = 'w-full max-w-lg bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 animate-fade-in-up';
  formCard.style.animationDelay = '0.15s';

  const modelLabel = document.createElement('label');
  modelLabel.className = 'text-xs font-bold text-secondary uppercase tracking-wider';
  modelLabel.textContent = 'Model';
  formCard.appendChild(modelLabel);

  const modelRow = document.createElement('div');
  modelRow.className = 'flex gap-2';
  const modelBtns = {};
  CHARACTER_MODELS.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all border text-left';
    btn.innerHTML = `<div class="text-white">${m.name}</div><div class="text-muted text-[10px] mt-0.5">${m.description}</div>`;
    btn.onclick = () => {
      selectedModel = m;
      Object.entries(modelBtns).forEach(([id, b]) => {
        b.className = id === m.id
          ? 'flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all border bg-primary/10 border-primary/30'
          : 'flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all border bg-white/[0.03] border-white/10 hover:border-white/20';
      });
    };
    modelBtns[m.id] = btn;
    modelRow.appendChild(btn);
  });
  formCard.appendChild(modelRow);

  const uploadLabel = document.createElement('label');
  uploadLabel.className = 'text-xs font-bold text-secondary uppercase tracking-wider';
  uploadLabel.textContent = 'Reference Face';
  formCard.appendChild(uploadLabel);

  const uploadRow = document.createElement('div');
  uploadRow.className = 'flex items-center gap-4';
  const picker = createUploadPicker({
    anchorContainer: container,
    onSelect: ({ url }) => { uploadedUrl = url; },
    onClear: () => { uploadedUrl = null; },
  });
  uploadRow.appendChild(picker.trigger);
  const hint = document.createElement('span');
  hint.className = 'text-sm text-muted';
  hint.textContent = 'Upload a clear face photo';
  uploadRow.appendChild(hint);
  formCard.appendChild(uploadRow);
  container.appendChild(picker.panel);

  const promptLabel = document.createElement('label');
  promptLabel.className = 'text-xs font-bold text-secondary uppercase tracking-wider';
  promptLabel.textContent = 'Character Description';
  formCard.appendChild(promptLabel);

  const promptInput = document.createElement('textarea');
  promptInput.className = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none';
  promptInput.rows = 3;
  promptInput.placeholder = 'e.g. wearing a leather jacket, standing in a neon-lit alley, cyberpunk style';
  formCard.appendChild(promptInput);

  const genBtn = document.createElement('button');
  genBtn.className = 'w-full bg-primary text-black py-3.5 rounded-xl font-black text-sm hover:shadow-glow transition-all mt-2';
  genBtn.textContent = 'Generate Character';
  formCard.appendChild(genBtn);
  container.appendChild(formCard);

  const resultArea = document.createElement('div');
  resultArea.className = 'w-full max-w-lg mt-6 hidden';
  container.appendChild(resultArea);

  genBtn.onclick = async () => {
    if (!uploadedUrl) { alert('Upload a reference face first'); return; }
    const apiKey = localStorage.getItem('muapi_key');
    if (!apiKey) { AuthModal(() => genBtn.click()); return; }

    genBtn.disabled = true;
    genBtn.innerHTML = '<span class="animate-spin inline-block mr-2">&#9711;</span> Generating...';

    try {
      const params = {
        model: selectedModel.id,
        image_url: uploadedUrl,
        prompt: promptInput.value.trim() || 'professional portrait photo',
      };
      const result = await muapi.generateI2I(params);
      if (result?.url) {
        resultArea.classList.remove('hidden');
        resultArea.innerHTML = `
          <div class="bg-[#111]/80 border border-white/10 rounded-2xl p-4 animate-fade-in-up">
            <img src="${result.url}" class="w-full rounded-xl mb-3">
            <div class="flex gap-3">
              <a href="${result.url}" download class="flex-1 bg-primary text-black py-2.5 rounded-xl font-bold text-sm text-center hover:shadow-glow transition-all">Download</a>
              <button class="flex-1 bg-white/10 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all" onclick="this.closest('.bg-\\\\[\\\\#111\\\\]').remove()">Generate Again</button>
            </div>
          </div>
        `;
        resultArea.querySelector('button').onclick = () => genBtn.click();
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      genBtn.disabled = false;
      genBtn.textContent = 'Generate Character';
    }
  };

  Object.entries(modelBtns).forEach(([id, btn]) => {
    btn.className = id === selectedModel.id
      ? 'flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all border bg-primary/10 border-primary/30'
      : 'flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all border bg-white/[0.03] border-white/10 hover:border-white/20';
  });

  return container;
}
