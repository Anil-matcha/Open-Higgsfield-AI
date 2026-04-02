import { defaultHeaderConfig, createHeaderStructure } from '../core/header';

export function createHeader(options = {}) {
  const config = options.config || defaultHeaderConfig;
  const headerStructure = createHeaderStructure(config);

  let mobileMenuOpen = false;
  let mobileMenu = null;

  const header = document.createElement('header');
  header.className = 'header';
  Object.assign(header.style, headerStructure.container);

  const navBar = document.createElement('div');
  navBar.className = 'nav-bar';
  Object.assign(navBar.style, headerStructure.navBar);

  // Left Part - Logo and Navigation
  const leftPart = document.createElement('div');
  leftPart.className = 'left-part';
  Object.assign(leftPart.style, headerStructure.leftPart);

  if (config.logo.enabled && options.logo) {
    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';
    logoContainer.style.cursor = 'pointer';
    logoContainer.appendChild(options.logo);
    leftPart.appendChild(logoContainer);
  }

  if (config.navigation.enabled) {
    const menu = document.createElement('nav');
    menu.className = 'nav-menu hidden lg:flex items-center';
    Object.assign(menu.style, headerStructure.menu);

    config.navigation.items.forEach(item => {
      const link = createNavigationItem(item, options.onNavigate);
      menu.appendChild(link);
    });

    leftPart.appendChild(menu);
  }

  navBar.appendChild(leftPart);

  // Right Part - Actions
  const rightPart = document.createElement('div');
  rightPart.className = 'right-part';
  Object.assign(rightPart.style, headerStructure.rightPart);

  if (config.mobile.enabled) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn lg:hidden p-2 text-secondary hover:text-white transition-colors';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
    mobileMenuBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    `;

    mobileMenuBtn.onclick = () => {
      mobileMenuOpen = !mobileMenuOpen;
      if (mobileMenuOpen) {
        mobileMenu = createMobileMenu(config.navigation.items, options.onNavigate, () => {
          mobileMenuOpen = false;
          mobileMenu.remove();
          mobileMenu = null;
        });
        document.body.appendChild(mobileMenu);
      } else {
        mobileMenu.remove();
        mobileMenu = null;
      }
    };

    rightPart.appendChild(mobileMenuBtn);
  }

  if (config.actions.enabled && options.actions) {
    rightPart.appendChild(options.actions);
  }

  navBar.appendChild(rightPart);
  header.appendChild(navBar);

  return {
    element: header,
    setNavigationItems: (items) => {
      // Rebuild navigation menu
    },
  };
}

function createNavigationItem(item, onNavigate) {
  const link = document.createElement('a');
  link.textContent = item.label;
  link.className = 'hover:text-white transition-all cursor-pointer relative group whitespace-nowrap';

  let dropdown = null;

  if (item.dropdown) {
    link.onmouseenter = () => {
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'absolute top-full left-0 mt-2 w-48 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50';
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';

        item.dropdown.forEach(dropdownItem => {
          const dropdownLink = document.createElement('a');
          dropdownLink.textContent = dropdownItem.label;
          dropdownLink.className = 'block px-4 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 cursor-pointer';
          dropdownLink.onclick = () => {
            dropdownItem.onClick && dropdownItem.onClick();
            onNavigate && onNavigate(dropdownItem.route);
          };
          dropdown.appendChild(dropdownLink);
        });

        link.appendChild(dropdown);
      }
    };

    link.onmouseleave = () => {
      if (dropdown) {
        setTimeout(() => {
          dropdown.remove();
          dropdown = null;
        }, 100);
      }
    };
  }

  link.onclick = () => {
    item.onClick && item.onClick();
    onNavigate && onNavigate(item.route);
  };

  return link;
}

function createMobileMenu(items, onNavigate, onClose) {
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center gap-4';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'absolute top-4 right-4 p-2 text-white';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  `;
  closeBtn.onclick = () => onClose();
  mobileMenu.appendChild(closeBtn);

  items.forEach(item => {
    const link = document.createElement('a');
    link.textContent = item.label;
    link.className = 'text-xl font-bold text-secondary hover:text-white transition-colors cursor-pointer';
    link.onclick = () => {
      item.onClick && item.onClick();
      onNavigate && onNavigate(item.route);
      onClose();
    };
    mobileMenu.appendChild(link);

    if (item.dropdown) {
      item.dropdown.forEach(dropdownItem => {
        const subLink = document.createElement('a');
        subLink.textContent = '→ ' + dropdownItem.label;
        subLink.className = 'text-lg font-bold text-muted hover:text-white transition-colors cursor-pointer ml-4';
        subLink.onclick = () => {
          dropdownItem.onClick && dropdownItem.onClick();
          onNavigate && onNavigate(dropdownItem.route);
          onClose();
        };
        mobileMenu.appendChild(subLink);
      });
    }
  });

  return mobileMenu;
}
