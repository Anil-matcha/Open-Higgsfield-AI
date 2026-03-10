export function Sidebar(navigate) {
  const element = document.createElement('aside');
  element.className = 'hidden md:flex flex-col items-center py-4 z-40 border-r border-white/5 bg-panel-bg';
  element.style.width = '68px';

  const navItems = [
    { id: 'apps', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', label: 'Apps' },
    { id: 'image', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', label: 'Image' },
    { id: 'video', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>', label: 'Video' },
    { id: 'effects', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', label: 'Effects' },
    { id: 'edit', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>', label: 'Edit' },
    { id: 'library', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>', label: 'Library' },
  ];

  const bottomItems = [
    { id: 'settings', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', label: 'Settings' },
  ];

  const buttons = {};

  const createButton = (item) => {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center gap-0.5 mb-1 cursor-pointer group w-full px-2';

    const iconBtn = document.createElement('button');
    iconBtn.innerHTML = item.icon;
    iconBtn.className = 'w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-transparent text-secondary group-hover:bg-white/5 group-hover:text-white';

    const label = document.createElement('span');
    label.textContent = item.label;
    label.className = 'text-[9px] font-bold uppercase tracking-wider text-secondary group-hover:text-white transition-colors';

    if (item.id === 'image') {
      iconBtn.style.color = 'var(--color-primary)';
      iconBtn.classList.add('bg-primary/10');
      label.style.color = 'var(--color-primary)';
    }

    container.onclick = () => {
      if (item.id === 'settings') {
        const event = new CustomEvent('navigate', { detail: { page: 'settings' } });
        window.dispatchEvent(event);
        return;
      }
      navigate(item.id);
    };

    container.appendChild(iconBtn);
    container.appendChild(label);
    buttons[item.id] = { iconBtn, label };
    return container;
  };

  const navContainer = document.createElement('div');
  navContainer.className = 'flex flex-col flex-1 w-full items-center pt-2 gap-1';
  navItems.forEach(item => navContainer.appendChild(createButton(item)));
  element.appendChild(navContainer);

  const bottomContainer = document.createElement('div');
  bottomContainer.className = 'flex flex-col w-full items-center mt-auto';
  bottomItems.forEach(item => bottomContainer.appendChild(createButton(item)));
  element.appendChild(bottomContainer);

  element.addEventListener('route-changed', (e) => {
    const page = e.detail.page;
    const mappedPage = page.startsWith('template/') ? 'apps' : page;

    Object.entries(buttons).forEach(([id, { iconBtn, label }]) => {
      if (id === mappedPage) {
        iconBtn.style.color = 'var(--color-primary)';
        iconBtn.classList.add('bg-primary/10');
        label.style.color = 'var(--color-primary)';
      } else {
        iconBtn.style.color = '';
        iconBtn.classList.remove('bg-primary/10');
        label.style.color = '';
      }
    });
  });

  return element;
}
