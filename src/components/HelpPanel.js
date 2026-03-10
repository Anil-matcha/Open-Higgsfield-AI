import { getInstructionsSync, getInstructions } from '../lib/instructions.js';

const HELP_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

const CLOSE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const CHEVRON_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

function getStoredState() {
  try {
    return localStorage.getItem('help_panel_open') === 'true';
  } catch { return false; }
}

function setStoredState(open) {
  try {
    localStorage.setItem('help_panel_open', String(open));
  } catch { /* ignore */ }
}

export function createHelpToggle(studioId) {
  const btn = document.createElement('button');
  btn.className = 'w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:text-white hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';
  btn.innerHTML = HELP_ICON;
  btn.setAttribute('aria-label', 'Toggle help panel');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');

  btn.addEventListener('click', () => {
    const existing = document.getElementById('help-panel-overlay');
    if (existing) {
      closeHelpPanel(existing, btn);
    } else {
      openHelpPanel(studioId, btn);
    }
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });

  if (getStoredState()) {
    requestAnimationFrame(() => openHelpPanel(studioId, btn));
  }

  return btn;
}

function openHelpPanel(studioId, toggleBtn) {
  const instructions = getInstructionsSync(studioId);
  if (!instructions) return;

  const overlay = document.createElement('div');
  overlay.id = 'help-panel-overlay';
  overlay.className = 'fixed inset-0 z-50 pointer-events-none';

  const backdrop = document.createElement('div');
  backdrop.className = 'absolute inset-0 pointer-events-auto lg:pointer-events-none';
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop && window.innerWidth < 1024) {
      closeHelpPanel(overlay, toggleBtn);
    }
  });
  overlay.appendChild(backdrop);

  const panel = document.createElement('div');
  panel.className = 'help-panel pointer-events-auto';
  panel.setAttribute('aria-label', 'Help and instructions');
  panel.setAttribute('role', 'complementary');
  panel.innerHTML = buildPanelContent(instructions);
  overlay.appendChild(panel);

  const closeBtn = panel.querySelector('[data-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeHelpPanel(overlay, toggleBtn));
  }

  const tipsToggle = panel.querySelector('[data-tips-toggle]');
  if (tipsToggle) {
    tipsToggle.addEventListener('click', () => {
      const content = panel.querySelector('[data-tips-content]');
      const chevron = tipsToggle.querySelector('.tips-chevron');
      if (content) {
        const isOpen = content.style.maxHeight !== '0px';
        content.style.maxHeight = isOpen ? '0px' : `${content.scrollHeight}px`;
        if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
      }
    });
  }

  document.body.appendChild(overlay);
  requestAnimationFrame(() => panel.classList.add('help-panel--open'));

  toggleBtn.setAttribute('aria-expanded', 'true');
  setStoredState(true);

  getInstructions(studioId).then(fresh => {
    if (fresh && document.getElementById('help-panel-overlay')) {
      const stepsContainer = panel.querySelector('[data-steps]');
      const tipsContent = panel.querySelector('[data-tips-content]');
      if (stepsContainer) stepsContainer.innerHTML = buildSteps(fresh.steps);
      if (tipsContent && fresh.quickTips) {
        tipsContent.innerHTML = buildTips(fresh.quickTips);
      }
    }
  });
}

function closeHelpPanel(overlay, toggleBtn) {
  const panel = overlay.querySelector('.help-panel');
  if (panel) panel.classList.remove('help-panel--open');
  toggleBtn.setAttribute('aria-expanded', 'false');
  setStoredState(false);
  setTimeout(() => overlay.remove(), 350);
}

function buildPanelContent(instructions) {
  return `
    <div class="flex items-center justify-between p-4 border-b border-white/5">
      <h3 class="text-sm font-bold text-white">${instructions.title}</h3>
      <button data-close class="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" aria-label="Close help panel" role="button" tabindex="0">${CLOSE_ICON}</button>
    </div>
    <div class="flex-1 overflow-y-auto p-4 space-y-1" data-steps>
      ${buildSteps(instructions.steps)}
    </div>
    ${instructions.quickTips ? `
    <div class="border-t border-white/5">
      <button data-tips-toggle class="w-full flex items-center justify-between p-4 text-xs font-bold text-muted hover:text-secondary transition-colors focus-visible:outline-none" aria-expanded="false">
        Quick Tips
        <span class="tips-chevron transition-transform duration-200">${CHEVRON_ICON}</span>
      </button>
      <div data-tips-content class="overflow-hidden transition-all duration-300 ease-out" style="max-height: 0px">
        ${buildTips(instructions.quickTips)}
      </div>
    </div>
    ` : ''}
  `;
}

function buildSteps(steps) {
  return steps.map(s => `
    <div class="flex gap-3 py-3">
      <div class="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
        <span class="text-[10px] font-black text-primary">${s.number}</span>
      </div>
      <div class="min-w-0">
        <div class="text-xs font-bold text-white mb-1">${s.heading}</div>
        <div class="text-[11px] leading-relaxed text-secondary">${s.description}</div>
      </div>
    </div>
  `).join('');
}

function buildTips(tips) {
  return `<div class="px-4 pb-4 space-y-2">
    ${tips.map(t => `
      <div class="flex gap-2 items-start">
        <span class="text-primary text-[10px] mt-0.5 shrink-0">&#9679;</span>
        <span class="text-[11px] text-secondary leading-relaxed">${t}</span>
      </div>
    `).join('')}
  </div>`;
}
