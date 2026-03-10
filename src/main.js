import './style.css';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { initRouter, navigate } from './lib/router.js';

const app = document.querySelector('#app');
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

navigate('image');

window.addEventListener('navigate', (e) => {
  if (e.detail.page === 'settings') {
    import('./components/SettingsModal.js').then(({ SettingsModal }) => {
      document.body.appendChild(SettingsModal());
    });
  } else {
    navigate(e.detail.page);
  }
});
