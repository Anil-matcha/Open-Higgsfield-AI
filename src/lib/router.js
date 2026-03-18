const ROUTE_MAP = {
  'Explore': 'explore',
  'Image': 'image',
  'Video': 'video',
  'Storyboard': 'storyboard',
  'Edit': 'edit',
  'Character': 'character',

  'Vibe Motion': 'effects',
  'Cinema Studio': 'cinema',
  'AI Influencer': 'influencer',
  'Apps': 'apps',
  'Templates': 'templates',
  'Assist': 'assist',
  'Community': 'community',
};

export function getRouteForItem(item) {
  return ROUTE_MAP[item] || item.toLowerCase().replace(/\s+/g, '-');
}

const pageLoaders = {
  image: () => import('../components/ImageStudio.js').then(m => m.ImageStudio()),
  video: () => import('../components/VideoStudio.js').then(m => m.VideoStudio()),
  cinema: () => import('../components/CinemaStudio.js').then(m => m.CinemaStudio()),
  apps: () => import('../components/AppsHub.js').then(m => m.AppsHub()),
  templates: () => import('../components/TemplatesPage.js').then(m => m.TemplatesPage()),
  effects: () => import('../components/EffectsStudio.js').then(m => m.EffectsStudio()),
  edit: () => import('../components/EditStudio.js').then(m => m.EditStudio()),
  upscale: () => import('../components/UpscaleStudio.js').then(m => m.UpscaleStudio()),
  library: () => import('../components/LibraryPage.js').then(m => m.LibraryPage()),
  character: () => import('../components/CharacterStudio.js').then(m => m.CharacterStudio()),
  influencer: () => import('../components/InfluencerStudio.js').then(m => m.InfluencerStudio()),
  commercial: () => import('../components/CommercialStudio.js').then(m => m.CommercialStudio()),
  explore: () => import('../components/ExplorePage.js').then(m => m.ExplorePage()),

  assist: () => import('../components/AssistPage.js').then(m => m.AssistPage()),
  community: () => import('../components/CommunityPage.js').then(m => m.CommunityPage()),
  storyboard: () => import('../components/StoryboardStudio.js').then(m => m.StoryboardStudio()),
  
  // AI Video Agency Platform routes
  render: () => import('../components/RenderPage.js').then(m => m.RenderPage()),
  director: () => import('../components/DirectorPage.js').then(m => m.DirectorPage()),
  editor: () => import('../components/EditorPage.js').then(m => m.EditorPage()),
  videoagent: () => import('../components/VideoAgentPage.js').then(m => m.VideoAgentPage()),
};

// Valid routes for 404 checking
const validRoutes = new Set([
  ...Object.values(ROUTE_MAP),
  'upscale',
  'storyboard',
  'placeholder', // Allow placeholder pages
  // Template routes use pattern matching
]);

let currentPage = null;
let contentArea = null;
let onNavigateCallback = null;
let isNavigating = false;
let navigationHistory = [];

export function initRouter(container, callback) {
  contentArea = container;
  onNavigateCallback = callback;
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state?.page) {
      navigate(e.state.page, {}, true);
    }
  });
}

export async function navigate(page, params = {}, replaceState = false) {
  if (!contentArea) {
    console.warn('[Router] Router not initialized');
    return;
  }

  // Prevent concurrent navigation
  if (isNavigating) {
    console.warn('[Router] Navigation already in progress, skipping...');
    return;
  }

  isNavigating = true;

  // Store previous page for back navigation
  const previousPage = currentPage;
  
  // Update URL without full page reload
  const url = page === 'image' ? '/' : `/${page}`;
  
  if (replaceState) {
    window.history.replaceState({ page }, '', url);
  } else {
    window.history.pushState({ page }, '', url);
    navigationHistory.push(previousPage);
  }
  
  currentPage = page;

  // Show loading indicator
  contentArea.innerHTML = '';
  const loading = document.createElement('div');
  loading.className = 'w-full h-full flex items-center justify-center';
  loading.innerHTML = `
    <div class="flex flex-col items-center gap-4">
      <div class="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full"></div>
      <p class="text-secondary text-sm">Loading...</p>
    </div>
  `;
  contentArea.appendChild(loading);

  try {
    let element;

    // Handle template routes
    if (page.startsWith('template/')) {
      const templateId = page.replace('template/', '');
      const mod = await import('../components/TemplateStudio.js');
      element = mod.TemplateStudio(templateId);
    }
    // Handle dynamic routes
    else if (pageLoaders[page]) {
      element = await pageLoaders[page]();
    }
    // Handle 404 for unknown routes
    else {
      const { Page404 } = await import('../components/Page404.js');
      element = Page404(page);
      
      // Update page title for 404
      document.title = `Page Not Found — Open Higgsfield AI`;
    }

    // Check if navigation was superseded
    if (currentPage !== page) {
      isNavigating = false;
      return;
    }

    contentArea.innerHTML = '';
    contentArea.appendChild(element);
    
    // Update page title
    const pageTitle = getPageTitle(page);
    document.title = `${pageTitle} — Open Higgsfield AI`;
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Notify listeners
    if (onNavigateCallback) {
      onNavigateCallback(page);
    }
    
    // Dispatch custom event for analytics
    window.dispatchEvent(new CustomEvent('pageview', { 
      detail: { page, params, timestamp: Date.now() } 
    }));

  } catch (err) {
    console.error(`[Router] Failed to load page: ${page}`, err);
    
    // Show error state with retry option
    contentArea.innerHTML = '';
    const errorEl = document.createElement('div');
    errorEl.className = 'w-full h-full flex items-center justify-center p-8';
    errorEl.innerHTML = `
      <div class="text-center max-w-md">
        <div class="text-5xl mb-4">😕</div>
        <h2 class="text-xl font-bold text-white mb-2">Failed to Load</h2>
        <p class="text-secondary text-sm mb-6">Something went wrong while loading this page.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button class="retry-btn px-6 py-3 bg-primary text-black font-bold rounded-xl hover:scale-105 transition-transform">
            Try Again
          </button>
          <button class="home-btn px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
            Go Home
          </button>
        </div>
        ${import.meta.env.DEV ? `<p class="text-red-400 text-xs mt-4 text-left bg-black/50 p-2 rounded">${escapeHtml(err.message)}</p>` : ''}
      </div>
    `;
    
    errorEl.querySelector('.retry-btn').onclick = () => navigate(page, params);
    errorEl.querySelector('.home-btn').onclick = () => navigate('image');
    
    contentArea.appendChild(errorEl);
    
    // Report error for monitoring
    if (import.meta.env.PROD) {
      window.dispatchEvent(new CustomEvent('error', { 
        detail: { type: 'navigation', page, error: err.message, timestamp: Date.now() } 
      }));
    }
    
  } finally {
    isNavigating = false;
  }
}

function getPageTitle(page) {
  const titles = {
    'image': 'Image Studio',
    'video': 'Video Studio',
    'cinema': 'Cinema Studio',
    'apps': 'Apps',
    'templates': 'Templates',
    'effects': 'Vibe Motion',
    'edit': 'Edit Studio',
    'upscale': 'Upscale Studio',
    'library': 'Library',
    'character': 'Character Studio',
    'influencer': 'AI Influencer',
    'commercial': 'Commercial Studio',
    'explore': 'Explore',
    'assist': 'Assist',
    'community': 'Community',
    'storyboard': 'Storyboard',
    // AI Video Agency Platform
    'render': 'Render',
    'director': 'Director - Agentic Editor',
    'editor': 'Editor - Full Editor',
    'videoagent': 'VideoAgent - AI Processing',
  };
  
  if (page.startsWith('template/')) {
    return 'Template Studio';
  }
  
  return titles[page] || 'Open Higgsfield AI';
}

export function getCurrentPage() {
  return currentPage;
}

export function goBack() {
  if (navigationHistory.length > 0) {
    const previousPage = navigationHistory.pop();
    navigate(previousPage, {}, true);
  } else {
    navigate('image', {}, true);
  }
}

export function getNavigationHistory() {
  return [...navigationHistory];
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
