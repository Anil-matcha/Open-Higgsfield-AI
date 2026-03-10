import { getInstructionsSync, getInstructions } from '../lib/instructions.js';

export function createInlineInstructions(studioId) {
  const instructions = getInstructionsSync(studioId);
  if (!instructions) return document.createElement('div');

  const wrapper = document.createElement('div');
  wrapper.className = 'w-full animate-fade-in-up';
  wrapper.style.animationDelay = '0.4s';

  const stepsGrid = document.createElement('div');
  stepsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';

  const renderSteps = (steps) => {
    stepsGrid.innerHTML = '';
    steps.forEach(s => {
      const step = document.createElement('div');
      step.className = 'bg-white/[0.03] border border-white/5 rounded-xl p-4 flex gap-3';
      step.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span class="text-[10px] font-black text-primary">${s.number}</span>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-bold text-white mb-0.5">${s.heading}</div>
          <div class="text-[11px] leading-relaxed text-muted">${s.description}</div>
        </div>
      `;
      stepsGrid.appendChild(step);
    });
  };

  renderSteps(instructions.steps);
  wrapper.appendChild(stepsGrid);

  if (instructions.quickTips?.length > 0) {
    const tipsSection = document.createElement('div');
    tipsSection.className = 'mt-3';

    const tipsToggle = document.createElement('button');
    tipsToggle.className = 'flex items-center gap-2 text-[11px] font-bold text-muted hover:text-secondary transition-colors';
    tipsToggle.innerHTML = `
      <span class="tips-chevron transition-transform duration-200">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </span>
      Quick Tips
    `;

    const tipsContent = document.createElement('div');
    tipsContent.className = 'overflow-hidden transition-all duration-300 ease-out';
    tipsContent.style.maxHeight = '0px';

    const tipsList = document.createElement('div');
    tipsList.className = 'flex flex-col gap-1.5 mt-2 pl-5';

    const renderTips = (tips) => {
      tipsList.innerHTML = '';
      tips.forEach(t => {
        const tip = document.createElement('div');
        tip.className = 'flex gap-2 items-start';
        tip.innerHTML = `
          <span class="text-primary text-[10px] mt-0.5 shrink-0">&#9679;</span>
          <span class="text-[11px] text-muted leading-relaxed">${t}</span>
        `;
        tipsList.appendChild(tip);
      });
    };

    renderTips(instructions.quickTips);
    tipsContent.appendChild(tipsList);

    tipsToggle.addEventListener('click', () => {
      const isOpen = tipsContent.style.maxHeight !== '0px';
      tipsContent.style.maxHeight = isOpen ? '0px' : `${tipsContent.scrollHeight}px`;
      const chevron = tipsToggle.querySelector('.tips-chevron');
      if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
    });

    tipsSection.appendChild(tipsToggle);
    tipsSection.appendChild(tipsContent);
    wrapper.appendChild(tipsSection);
  }

  getInstructions(studioId).then(fresh => {
    if (!fresh) return;
    renderSteps(fresh.steps);
    if (fresh.quickTips) {
      const tipsList = wrapper.querySelector('.flex.flex-col.gap-1\\.5');
      if (tipsList) {
        tipsList.innerHTML = '';
        fresh.quickTips.forEach(t => {
          const tip = document.createElement('div');
          tip.className = 'flex gap-2 items-start';
          tip.innerHTML = `
            <span class="text-primary text-[10px] mt-0.5 shrink-0">&#9679;</span>
            <span class="text-[11px] text-muted leading-relaxed">${t}</span>
          `;
          tipsList.appendChild(tip);
        });
      }
    }
  });

  return wrapper;
}
