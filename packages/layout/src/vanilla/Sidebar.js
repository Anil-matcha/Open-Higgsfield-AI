import { defaultSidebarConfig, createSidebarStructure } from '../core/sidebar';

export function createSidebar(options = {}) {
  const config = options.config || defaultSidebarConfig;
  const sidebarStructure = createSidebarStructure(config);

  let activeItem = null;
  let collapsed = config.defaultCollapsed;

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  Object.assign(sidebar.style, sidebarStructure.container);

  const content = document.createElement('div');
  content.className = 'sidebar-content';
  Object.assign(content.style, sidebarStructure.content);

  const renderItems = () => {
    content.innerHTML = '';
    config.items.forEach(item => {
      const itemElement = createSidebarItem(item, sidebarStructure, activeItem, () => {
        activeItem = item.route;
        item.onClick && item.onClick();
        options.onNavigate && options.onNavigate(item.route);
        renderItems();
      });
      content.appendChild(itemElement);
    });
  };

  renderItems();
  sidebar.appendChild(content);

  if (config.collapsible) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'p-2 m-2 text-secondary hover:text-white transition-colors';
    toggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="${collapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}" />
      </svg>
    `;

    toggleBtn.onclick = () => {
      collapsed = !collapsed;
      sidebar.style.width = collapsed ? '64px' : config.width;
      toggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      toggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="${collapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}" />
        </svg>
      `;
      options.onToggle && options.onToggle(collapsed);
    };

    sidebar.appendChild(toggleBtn);
  }

  return {
    element: sidebar,
    setItems: (items) => {
      config.items = items;
      renderItems();
    },
    isCollapsed: () => collapsed,
  };
}

function createSidebarItem(item, structure, activeRoute, onClick) {
  const itemEl = document.createElement('div');
  itemEl.className = 'sidebar-item';
  itemEl.setAttribute('data-sidebar-item', '');
  itemEl.setAttribute('data-active', String(activeRoute === item.route));

  const isActive = activeRoute === item.route;
  Object.assign(itemEl.style, {
    ...structure.item,
    ...(isActive ? structure.itemActive : {}),
  });

  itemEl.onmouseenter = () => {
    if (!isActive) {
      Object.assign(itemEl.style, structure.itemHover);
    }
  };

  itemEl.onmouseleave = () => {
    if (!isActive) {
      Object.assign(itemEl.style, structure.item);
    }
  };

  if (item.icon) {
    const icon = document.createElement('span');
    icon.className = 'sidebar-item-icon mr-3';
    icon.textContent = item.icon;
    itemEl.appendChild(icon);
  }

  const label = document.createElement('span');
  label.className = 'sidebar-item-label';
  label.textContent = item.label;
  itemEl.appendChild(label);

  if (item.children) {
    const arrow = document.createElement('svg');
    arrow.className = 'ml-auto';
    arrow.setAttribute('width', '16');
    arrow.setAttribute('height', '16');
    arrow.setAttribute('viewBox', '0 0 24 24');
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', 'currentColor');
    arrow.setAttribute('stroke-width', '2');
    arrow.innerHTML = '<path d="M9 18l6-6-6-6" />';
    itemEl.appendChild(arrow);
  }

  itemEl.onclick = onClick;

  return itemEl;
}
