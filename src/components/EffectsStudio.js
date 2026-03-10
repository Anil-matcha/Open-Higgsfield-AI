import { muapi } from '../lib/muapi.js';
import { AuthModal } from './AuthModal.js';
import { createUploadPicker } from './UploadPicker.js';
import { createMediaPreview, createFullscreenPreview } from './MediaPreview.js';
import { createInlineInstructions } from './InlineInstructions.js';
import { i2iModels, i2vModels } from '../lib/models.js';

const EFFECT_TABS = [
  { id: 'image-effects', label: 'Image Effects', type: 'i2i', field: 'name' },
  { id: 'nano-banana-effects', label: 'Nano Banana', type: 'i2i', field: 'name' },
  { id: 'flux-kontext-effects', label: 'Kontext Effects', type: 'i2i', field: 'name' },
  { id: 'ai-video-effects', label: 'Video Effects', type: 'i2v', field: 'name' },
  { id: 'motion-controls', label: 'Motion Controls', type: 'i2v', field: 'name' },
  { id: 'video-effects', label: 'Video FX v2', type: 'i2v', field: 'name' },
];

function getEffectsForModel(modelId) {
  const allModels = [...i2iModels, ...i2vModels];
  const model = allModels.find(m => m.id === modelId);
  if (!model) return [];
  const nameField = model.inputs?.name;
  if (nameField?.enum) return nameField.enum;
  return [];
}

export function EffectsStudio() {
  const container = document.createElement('div');
  container.className = 'w-full h-full flex flex-col bg-app-bg overflow-hidden relative';

  let activeTab = EFFECT_TABS[0];
  let selectedEffect = null;
  let uploadedUrl = null;

  const fullscreen = createFullscreenPreview();
  container.appendChild(fullscreen.element);

  const topBar = document.createElement('div');
  topBar.className = 'px-4 md:px-8 pt-6 pb-4 shrink-0';
  topBar.innerHTML = `
    <h1 class="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Effects Studio</h1>
    <p class="text-secondary text-xs mb-4">Apply 350+ visual effects to your photos and videos</p>
  `;

  const tabRow = document.createElement('div');
  tabRow.className = 'flex gap-2 overflow-x-auto no-scrollbar pb-2';

  const tabButtons = {};
  EFFECT_TABS.forEach(tab => {
    const btn = document.createElement('button');
    const count = getEffectsForModel(tab.id).length;
    btn.className = 'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all';
    btn.textContent = `${tab.label} (${count})`;
    btn.onclick = () => switchTab(tab);
    tabButtons[tab.id] = btn;
    tabRow.appendChild(btn);
  });

  topBar.appendChild(tabRow);

  const inlineInstructions = createInlineInstructions('effects');
  inlineInstructions.classList.add('mt-2');
  topBar.appendChild(inlineInstructions);

  container.appendChild(topBar);

  const bodyArea = document.createElement('div');
  bodyArea.className = 'flex flex-1 overflow-hidden';

  const effectsPanel = document.createElement('div');
  effectsPanel.className = 'w-full md:w-[340px] lg:w-[400px] shrink-0 overflow-y-auto px-4 md:px-6 pb-6 md:border-r border-white/5';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search effects...';
  searchInput.className = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors mb-3';
  effectsPanel.appendChild(searchInput);

  const effectsGrid = document.createElement('div');
  effectsGrid.className = 'grid grid-cols-2 gap-2';
  effectsPanel.appendChild(effectsGrid);

  const previewPanel = document.createElement('div');
  previewPanel.className = 'hidden md:flex flex-1 flex-col overflow-y-auto';

  const previewTop = document.createElement('div');
  previewTop.className = 'p-4 lg:p-6 flex flex-col gap-4 flex-1';

  const previewHeader = document.createElement('div');
  previewHeader.className = 'flex items-center justify-between';
  previewHeader.innerHTML = '<div class="text-xs font-bold text-secondary uppercase tracking-wider">Preview</div>';

  const selectedBadge = document.createElement('div');
  selectedBadge.className = 'text-xs font-bold text-muted';
  selectedBadge.textContent = 'No effect selected';
  previewHeader.appendChild(selectedBadge);
  previewTop.appendChild(previewHeader);

  const splitRow = document.createElement('div');
  splitRow.className = 'flex gap-4 flex-1 min-h-0';

  const inputCol = document.createElement('div');
  inputCol.className = 'flex-1 flex flex-col gap-3 min-w-0';
  const inputLabel = document.createElement('div');
  inputLabel.className = 'text-[10px] font-bold text-muted uppercase tracking-wider';
  inputLabel.textContent = 'Input';
  inputCol.appendChild(inputLabel);

  const inputPreview = createMediaPreview({ maxHeight: '40vh', showDownload: false, showMeta: true });
  inputCol.appendChild(inputPreview.element);

  const uploadRow = document.createElement('div');
  uploadRow.className = 'flex items-center gap-3';

  const picker = createUploadPicker({
    anchorContainer: container,
    acceptVideo: true,
    onFilePreview: (file) => {
      inputPreview.loadFile(file);
    },
    onSelect: ({ url }) => {
      uploadedUrl = url;
      inputPreview.load(url, { filename: 'Uploaded media' });
    },
    onClear: () => {
      uploadedUrl = null;
      inputPreview.clear();
    },
  });
  uploadRow.appendChild(picker.trigger);
  container.appendChild(picker.panel);

  const uploadHint = document.createElement('span');
  uploadHint.className = 'text-xs text-muted';
  uploadHint.textContent = 'Upload image or video';
  uploadRow.appendChild(uploadHint);
  inputCol.appendChild(uploadRow);

  const outputCol = document.createElement('div');
  outputCol.className = 'flex-1 flex flex-col gap-3 min-w-0';
  const outputLabel = document.createElement('div');
  outputLabel.className = 'text-[10px] font-bold text-muted uppercase tracking-wider';
  outputLabel.textContent = 'Output';
  outputCol.appendChild(outputLabel);

  const outputPreview = createMediaPreview({ maxHeight: '40vh', showDownload: true, showMeta: true });
  outputCol.appendChild(outputPreview.element);

  splitRow.appendChild(inputCol);
  splitRow.appendChild(outputCol);
  previewTop.appendChild(splitRow);

  const promptRow = document.createElement('div');
  promptRow.className = 'flex items-center gap-3';
  const promptInput = document.createElement('input');
  promptInput.type = 'text';
  promptInput.placeholder = 'Optional prompt...';
  promptInput.className = 'flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors';
  promptRow.appendChild(promptInput);

  const generateBtn = document.createElement('button');
  generateBtn.className = 'bg-primary text-black px-6 py-2.5 rounded-xl font-black text-sm hover:shadow-glow transition-all whitespace-nowrap';
  generateBtn.textContent = 'Apply Effect';
  promptRow.appendChild(generateBtn);
  previewTop.appendChild(promptRow);

  previewPanel.appendChild(previewTop);

  bodyArea.appendChild(effectsPanel);
  bodyArea.appendChild(previewPanel);
  container.appendChild(bodyArea);

  const mobileControls = document.createElement('div');
  mobileControls.className = 'md:hidden px-4 pb-4 shrink-0 flex flex-col gap-3 border-t border-white/5 pt-3';

  const mobilePreviewRow = document.createElement('div');
  mobilePreviewRow.className = 'flex gap-3';

  const mobileInputPreview = createMediaPreview({ maxHeight: '30vh', showDownload: false, showMeta: false });
  mobileInputPreview.element.className += ' flex-1';
  const mobileOutputPreview = createMediaPreview({ maxHeight: '30vh', showDownload: true, showMeta: false });
  mobileOutputPreview.element.className += ' flex-1';

  mobilePreviewRow.appendChild(mobileInputPreview.element);
  mobilePreviewRow.appendChild(mobileOutputPreview.element);
  mobileControls.appendChild(mobilePreviewRow);

  const mobileUploadRow = document.createElement('div');
  mobileUploadRow.className = 'flex items-center gap-3';
  const mobilePicker = createUploadPicker({
    anchorContainer: container,
    acceptVideo: true,
    onFilePreview: (file) => { mobileInputPreview.loadFile(file); },
    onSelect: ({ url }) => {
      uploadedUrl = url;
      mobileInputPreview.load(url);
    },
    onClear: () => {
      uploadedUrl = null;
      mobileInputPreview.clear();
    },
  });
  mobileUploadRow.appendChild(mobilePicker.trigger);
  container.appendChild(mobilePicker.panel);

  const mobilePrompt = document.createElement('input');
  mobilePrompt.type = 'text';
  mobilePrompt.placeholder = 'Optional prompt...';
  mobilePrompt.className = 'flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder:text-muted focus:outline-none focus:border-primary/50';
  mobileUploadRow.appendChild(mobilePrompt);
  mobileControls.appendChild(mobileUploadRow);

  const mobileGenBtn = document.createElement('button');
  mobileGenBtn.className = 'w-full bg-primary text-black py-3 rounded-xl font-black text-sm';
  mobileGenBtn.textContent = 'Apply Effect';
  mobileControls.appendChild(mobileGenBtn);
  container.appendChild(mobileControls);

  function switchTab(tab) {
    activeTab = tab;
    selectedEffect = null;
    selectedBadge.textContent = 'No effect selected';
    selectedBadge.className = 'text-xs font-bold text-muted';
    Object.entries(tabButtons).forEach(([id, btn]) => {
      btn.className = id === tab.id
        ? 'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-primary text-black'
        : 'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-white/5 text-secondary hover:bg-white/10';
    });
    renderEffects();
  }

  function renderEffects(filter = '') {
    effectsGrid.innerHTML = '';
    let effects = getEffectsForModel(activeTab.id);

    if (filter) {
      effects = effects.filter(name => name.toLowerCase().includes(filter.toLowerCase()));
    }

    effects.forEach(name => {
      const card = document.createElement('div');
      const isVideo = activeTab.type === 'i2v';
      card.className = 'bg-white/[0.03] border border-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-all group';
      card.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
          ${isVideo ? '<div class="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>' : '<div class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>'}
          <div class="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">${name}</div>
        </div>
        <div class="text-[10px] text-muted">${isVideo ? 'Video' : 'Image'}</div>
      `;
      card.onclick = () => {
        selectedEffect = name;
        effectsGrid.querySelectorAll('[data-selected]').forEach(el => {
          el.removeAttribute('data-selected');
          el.classList.remove('border-primary/50', 'bg-primary/5');
          el.classList.add('border-white/5');
        });
        card.setAttribute('data-selected', '1');
        card.classList.remove('border-white/5');
        card.classList.add('border-primary/50', 'bg-primary/5');
        selectedBadge.textContent = name;
        selectedBadge.className = 'text-xs font-bold text-primary';
      };
      effectsGrid.appendChild(card);
    });

    if (effects.length === 0) {
      effectsGrid.innerHTML = '<div class="col-span-2 text-xs text-muted py-6 text-center">No effects match your search</div>';
    }
  }

  searchInput.oninput = () => renderEffects(searchInput.value);

  async function handleGenerate() {
    if (!selectedEffect) { alert('Select an effect first'); return; }
    if (!uploadedUrl) { alert('Upload an image or video first'); return; }
    const apiKey = localStorage.getItem('muapi_key');
    if (!apiKey) { AuthModal(() => handleGenerate()); return; }

    generateBtn.disabled = true;
    mobileGenBtn.disabled = true;
    generateBtn.innerHTML = '<span class="animate-spin inline-block mr-2">&#9711;</span> Processing...';
    mobileGenBtn.innerHTML = generateBtn.innerHTML;

    outputPreview.showLoading(`Applying "${selectedEffect}"...`);
    mobileOutputPreview.showLoading('Processing...');

    try {
      const params = {
        model: activeTab.id,
        image_url: uploadedUrl,
        [activeTab.field]: selectedEffect,
      };
      const prompt = promptInput.value.trim() || mobilePrompt.value.trim();
      if (prompt) params.prompt = prompt;

      let result;
      if (activeTab.type === 'i2v') {
        params.resolution = '720p';
        params.duration = 5;
        result = await muapi.generateI2V(params);
      } else {
        result = await muapi.generateI2I(params);
      }

      if (result?.url) {
        const mediaType = activeTab.type === 'i2v' ? 'video' : 'image';
        outputPreview.load(result.url, { type: mediaType, model: activeTab.label, filename: `${selectedEffect}-${Date.now()}` });
        mobileOutputPreview.load(result.url, { type: mediaType });

        saveToHistory(result.url, mediaType);
      } else {
        outputPreview.showError('No output URL returned');
        mobileOutputPreview.showError('Failed');
      }
    } catch (err) {
      outputPreview.showError(`Error: ${err.message}`);
      mobileOutputPreview.showError('Error');
    } finally {
      generateBtn.disabled = false;
      mobileGenBtn.disabled = false;
      generateBtn.textContent = 'Apply Effect';
      mobileGenBtn.textContent = 'Apply Effect';
    }
  }

  function saveToHistory(url, type) {
    try {
      const key = type === 'video' ? 'video_history' : 'muapi_history';
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      history.unshift({
        id: Date.now().toString(),
        url,
        prompt: selectedEffect,
        model: activeTab.id,
        type,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(history.slice(0, 100)));
    } catch (e) { /* ignore */ }
  }

  generateBtn.onclick = handleGenerate;
  mobileGenBtn.onclick = handleGenerate;

  outputPreview.element.style.cursor = 'pointer';
  outputPreview.element.onclick = () => {
    const url = outputPreview.getUrl();
    if (url) fullscreen.show(url, { type: outputPreview.getType(), model: activeTab.label });
  };

  switchTab(EFFECT_TABS[0]);
  return container;
}
