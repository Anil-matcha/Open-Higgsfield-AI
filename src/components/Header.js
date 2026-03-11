import { getRouteForItem } from '../lib/router.js';

export function Header(navigate) {
  const header = document.createElement('header');
  header.className = 'w-full flex flex-col z-50 sticky top-0';

  const navBar = document.createElement('div');
  navBar.className = 'w-full h-14 bg-black flex items-center justify-between px-4 md:px-6 border-b border-white/5 backdrop-blur-md bg-opacity-95';

  const leftPart = document.createElement('div');
  leftPart.className = 'flex items-center gap-6';

  const logoContainer = document.createElement('div');
  logoContainer.className = 'cursor-pointer hover:scale-110 transition-transform';
  logoContainer.innerHTML = `
    <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-lg">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="black"/>
        <path d="M2 17L12 22L22 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
  logoContainer.onclick = () => navigate('apps');

  const menu = document.createElement('nav');
  menu.className = 'hidden lg:flex items-center gap-5 text-[13px] font-bold text-secondary';
  const items = ['Explore', 'Image', 'Video', 'Storyboard', 'Edit', 'Character', 'Vibe Motion', 'Cinema Studio', 'AI Influencer', 'Apps', 'Templates', 'Assist', 'Community'];

  const links = {};

  items.forEach(item => {
    const link = document.createElement('a');
    link.textContent = item;
    link.className = 'hover:text-white transition-all cursor-pointer relative group whitespace-nowrap';
    if (item === 'Image') link.classList.add('text-white');

    links[getRouteForItem(item)] = link;

    link.onclick = () => {
      const route = getRouteForItem(item);
      navigate(route);
    };

    menu.appendChild(link);
  });

  leftPart.appendChild(logoContainer);
  leftPart.appendChild(menu);

  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'lg:hidden p-2 text-secondary hover:text-white transition-colors';
  mobileMenuBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'lg:hidden fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center gap-4 opacity-0 pointer-events-none transition-opacity duration-300';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'absolute top-4 right-4 p-2 text-white';
  closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  closeBtn.onclick = () => {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
  };
  mobileMenu.appendChild(closeBtn);

  items.forEach(item => {
    const link = document.createElement('a');
    link.textContent = item;
    link.className = 'text-xl font-bold text-secondary hover:text-white transition-colors cursor-pointer';
    link.onclick = () => {
      navigate(getRouteForItem(item));
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
    };
    mobileMenu.appendChild(link);
  });

  mobileMenuBtn.onclick = () => {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
  };

  const existingMobileMenu = document.querySelector('[data-mobile-menu]');
  if (existingMobileMenu) existingMobileMenu.remove();
  mobileMenu.setAttribute('data-mobile-menu', '');
  document.body.appendChild(mobileMenu);

  const rightPart = document.createElement('div');
  rightPart.className = 'flex items-center gap-3';

  const keyBtn = document.createElement('button');
  keyBtn.className = 'p-2 text-secondary hover:text-white transition-colors';
  keyBtn.title = 'Update API Key';
  keyBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.25-2.25"/></svg>';
  keyBtn.onclick = () => {
    localStorage.removeItem('muapi_key');
    window.location.reload();
  };

  rightPart.appendChild(mobileMenuBtn);
  rightPart.appendChild(keyBtn);

  navBar.appendChild(leftPart);
  navBar.appendChild(rightPart);
  header.appendChild(navBar);

  header.addEventListener('route-changed', (e) => {
    const page = e.detail.page;
    Object.entries(links).forEach(([route, el]) => {
      if (route === page || (page.startsWith('template/') && route === 'templates')) {
        el.classList.add('text-white');
        el.classList.remove('text-secondary');
      } else {
        el.classList.remove('text-white');
        el.classList.add('text-secondary');
      }
    });
  });

  return header;
}
