import { templates, getAllCategories } from '../lib/templates.js';
import { navigate } from '../lib/router.js';
import { getTemplateThumbnail, createThumbnailImg } from '../lib/thumbnails.js';
import { createInlineInstructions } from './InlineInstructions.js';

export function TemplatesPage() {
  const container = document.createElement('div');
  container.className = 'w-full h-full overflow-y-auto bg-app-bg';

  const inner = document.createElement('div');
  inner.className = 'max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12';

  const heroSection = document.createElement('div');
  heroSection.className = 'mb-10 animate-fade-in-up';
  heroSection.innerHTML = `
    <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">Templates</h1>
    <p class="text-secondary text-sm md:text-base max-w-xl">Ready-to-use creative templates. Pick one, upload your media, and generate.</p>
  `;
  inner.appendChild(heroSection);

  const controlsRow = document.createElement('div');
  controlsRow.className = 'mb-8 flex flex-col sm:flex-row gap-3 animate-fade-in-up';
  controlsRow.style.animationDelay = '0.1s';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search templates...';
  searchInput.className = 'w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors';
  controlsRow.appendChild(searchInput);

  const filterRow = document.createElement('div');
  filterRow.className = 'flex gap-2 overflow-x-auto no-scrollbar';

  const categories = getAllCategories();
  let activeFilter = null;

  const allBtn = createFilterChip('All', true);
  allBtn.onclick = () => {
    activeFilter = null;
    updateFilters();
    renderCategories();
  };
  filterRow.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = createFilterChip(cat, false);
    btn.onclick = () => {
      activeFilter = cat;
      updateFilters();
      renderCategories();
    };
    filterRow.appendChild(btn);
  });

  controlsRow.appendChild(filterRow);
  inner.appendChild(controlsRow);
  const inlineInstructions = createInlineInstructions('templates');
  inlineInstructions.classList.add('max-w-4xl', 'mb-8');
  inner.appendChild(inlineInstructions);

  const sectionsContainer = document.createElement('div');
  inner.appendChild(sectionsContainer);

  function updateFilters() {
    filterRow.querySelectorAll('button').forEach(btn => {
      const isActive = (activeFilter === null && btn.dataset.filter === 'all') ||
                       btn.dataset.filter === activeFilter;
      if (isActive) {
        btn.classList.add('bg-primary/20', 'text-primary', 'border-primary/30');
        btn.classList.remove('bg-white/5', 'text-secondary', 'border-white/10');
      } else {
        btn.classList.remove('bg-primary/20', 'text-primary', 'border-primary/30');
        btn.classList.add('bg-white/5', 'text-secondary', 'border-white/10');
      }
    });
  }

  function renderCategories() {
    sectionsContainer.innerHTML = '';
    const visibleCategories = activeFilter ? [activeFilter] : categories;

    visibleCategories.forEach((cat, i) => {
      const catTemplates = templates.filter(t => t.category === cat);
      const section = createTemplateSection(cat, catTemplates);
      section.style.animationDelay = `${0.15 + i * 0.05}s`;
      sectionsContainer.appendChild(section);
    });
  }

  renderCategories();
  container.appendChild(inner);

  searchInput.oninput = () => {
    const q = searchInput.value.toLowerCase();
    container.querySelectorAll('[data-searchable]').forEach(el => {
      const text = el.dataset.searchable.toLowerCase();
      el.style.display = text.includes(q) ? '' : 'none';
    });
  };

  return container;
}

function createFilterChip(label, isActive) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.dataset.filter = label === 'All' ? 'all' : label;
  btn.className = `px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-all ${
    isActive
      ? 'bg-primary/20 text-primary border-primary/30'
      : 'bg-white/5 text-secondary border-white/10 hover:bg-white/10'
  }`;
  return btn;
}

function createTemplateSection(category, catTemplates) {
  const section = document.createElement('div');
  section.className = 'mb-10 animate-fade-in-up';

  const heading = document.createElement('h2');
  heading.className = 'text-lg font-bold text-white mb-4 flex items-center gap-2';
  heading.innerHTML = `${category} <span class="text-xs font-medium text-muted">${catTemplates.length}</span>`;
  section.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3';

  catTemplates.forEach(t => {
    const card = document.createElement('div');
    card.className = 'bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-all group overflow-hidden';
    card.dataset.searchable = `${t.name} ${t.description || ''} ${category} ${t.outputType}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    const thumbnail = getTemplateThumbnail(t.id);
    if (thumbnail) {
      const heroWrapper = document.createElement('div');
      heroWrapper.className = 'thumb-hero h-32';

      const skeleton = document.createElement('div');
      skeleton.className = 'thumb-skeleton absolute inset-0';
      heroWrapper.appendChild(skeleton);

      const img = createThumbnailImg(thumbnail, t.name, 'absolute inset-0');
      heroWrapper.appendChild(img);
      card.appendChild(heroWrapper);
    }

    const color = t.outputType === 'video'
      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      : 'bg-primary/10 text-primary border-primary/20';

    const content = document.createElement('div');
    content.className = 'p-3';
    content.innerHTML = `
      <div class="flex items-start gap-3 mb-1">
        <div class="w-8 h-8 rounded-lg ${color} border flex items-center justify-center shrink-0">
          <span class="text-lg">${t.icon}</span>
        </div>
        <div class="min-w-0">
          <div class="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">${t.name}</div>
          ${t.description ? `<div class="text-[11px] text-muted mt-0.5 line-clamp-2">${t.description}</div>` : ''}
        </div>
      </div>
      <div class="text-[10px] font-bold text-muted mt-1 ml-11">${t.outputType === 'video' ? 'Video' : 'Image'}</div>
    `;
    card.appendChild(content);

    const onClick = () => navigate(`template/${t.id}`);
    card.onclick = onClick;
    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}
