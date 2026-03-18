import './style.css';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { initRouter, navigate } from './lib/router.js';

console.log('[App] Starting initialization...');

// Global error handlers for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error);
  
  // Don't show error UI for known benign errors
  if (event.message?.includes('ResizeObserver') || 
      event.message?.includes('passive event listener')) {
    return;
  }
  
  // Show error toast notification instead of full page crash
  const errorToast = document.createElement('div');
  errorToast.id = 'global-error-toast';
  errorToast.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(220, 38, 38, 0.95); color: white; padding: 16px 24px; border-radius: 12px; font-size: 14px; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 400px;">
      <div style="font-weight: bold; margin-bottom: 4px;">Something went wrong</div>
      <div style="opacity: 0.9; font-size: 12px;">${event.message || 'An unexpected error occurred'}</div>
    </div>
  `;
  document.body.appendChild(errorToast);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    errorToast.style.opacity = '0';
    errorToast.style.transition = 'opacity 0.3s';
    setTimeout(() => errorToast.remove(), 300);
  }, 5000);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
  
  // Only show UI for significant errors (not API cancellations)
  if (event.reason?.name === 'AbortError' || 
      event.reason?.message?.includes('cancelled')) {
    return;
  }
});

// Service worker registration for offline support (production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('[SW] Registration failed:', err);
    });
  });
}

try {
  const app = document.querySelector('#app');
  if (!app) {
    throw new Error('App container not found');
  }

  app.innerHTML = '';

  const headerEl = Header((page) => navigate(page));
  app.appendChild(headerEl);

  const body = document.createElement('div');
  body.className = 'flex flex-1 overflow-hidden';

  const sidebar = Sidebar((page) => navigate(page));
  body.appendChild(sidebar);

  const contentArea = document.createElement('main');
  contentArea.id = 'content-area';
  contentArea.className = 'flex-1 relative w-full overflow-hidden flex flex-col bg-app-bg';
  body.appendChild(contentArea);

  app.appendChild(body);

  initRouter(contentArea, (page) => {
    headerEl.dispatchEvent(new CustomEvent('route-changed', { detail: { page } }));
    sidebar.dispatchEvent(new CustomEvent('route-changed', { detail: { page } }));
  });

  console.log('[App] Navigating to image studio...');
  navigate('image');
} catch (error) {
  console.error('[App] Fatal initialization error:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #000; color: #fff; flex-direction: column; padding: 20px; text-align: center;">
      <h1 style="color: #ff4444; margin-bottom: 20px;">Application Error</h1>
      <p style="color: #aaa; max-width: 600px;">${error.message}</p>
      <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; border: none; border-radius: 8px; color: white; cursor: pointer;">Reload Page</button>
    </div>
  `;
}

window.addEventListener('navigate', (e) => {
  if (e.detail.page === 'settings') {
    import('./components/SettingsModal.js').then(({ SettingsModal }) => {
      document.body.appendChild(SettingsModal());
    });
  } else {
    navigate(e.detail.page);
  }
});

// Clean up mobile menu when navigating away
const originalNavigate = navigate;
navigate = (page, params) => {
  // Remove any existing mobile menu before navigation
  const existingMobileMenu = document.querySelector('[data-mobile-menu]');
  if (existingMobileMenu) {
    existingMobileMenu.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => existingMobileMenu.remove(), 300);
  }
  return originalNavigate(page, params);
};
