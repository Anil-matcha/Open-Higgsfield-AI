import React, { useState, useCallback, ReactNode } from 'react';
import { HeaderConfig, defaultHeaderConfig, createHeaderStructure, NavigationItem } from '../core/header';

interface HeaderProps {
  config?: HeaderConfig;
  logo?: ReactNode;
  actions?: ReactNode;
  className?: string;
  mobileMenuRenderer?: (items: NavigationItem[], closeMenu: () => void) => ReactNode;
}

export function Header({
  config = defaultHeaderConfig,
  logo,
  actions,
  className = '',
  mobileMenuRenderer,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerStructure = createHeaderStructure(config);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header
      className={`header ${className}`}
      style={headerStructure.container}
    >
      <div style={headerStructure.navBar}>
        {/* Left Part - Logo and Navigation */}
        <div style={headerStructure.leftPart}>
          {config.logo.enabled && logo && (
            <div className="logo-container" style={{ cursor: 'pointer' }}>
              {logo}
            </div>
          )}

          {config.navigation.enabled && (
            <nav
              className={`hidden ${config.mobile.breakpoint}:flex items-center`}
              style={headerStructure.menu}
            >
              {config.navigation.items.map((item, index) => (
                <NavigationMenuItem key={index} item={item} />
              ))}
            </nav>
          )}
        </div>

        {/* Right Part - Actions */}
        <div style={headerStructure.rightPart}>
          {config.mobile.enabled && (
            <button
              className={`${config.mobile.breakpoint}:hidden p-2 text-secondary hover:text-white transition-colors`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}

          {config.actions.enabled && actions}
        </div>
      </div>

      {/* Mobile Menu */}
      {config.mobile.enabled && mobileMenuOpen && (
        <MobileMenu
          items={config.navigation.items}
          onClose={closeMobileMenu}
          renderer={mobileMenuRenderer}
        />
      )}
    </header>
  );
}

interface NavigationMenuItemProps {
  item: NavigationItem;
}

function NavigationMenuItem({ item }: NavigationMenuItemProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <a
      className="hover:text-white transition-all cursor-pointer relative group whitespace-nowrap"
      onClick={item.onClick}
      onMouseEnter={() => item.dropdown && setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      {item.label}

      {item.dropdown && dropdownOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-48 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50"
          style={{ opacity: 1, visibility: 'visible' }}
        >
          {item.dropdown.map((dropdownItem, index) => (
            <a
              key={index}
              className="block px-4 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 cursor-pointer"
              onClick={dropdownItem.onClick}
            >
              {dropdownItem.label}
            </a>
          ))}
        </div>
      )}
    </a>
  );
}

interface MobileMenuProps {
  items: NavigationItem[];
  onClose: () => void;
  renderer?: (items: NavigationItem[], closeMenu: () => void) => ReactNode;
}

function MobileMenu({ items, onClose, renderer }: MobileMenuProps) {
  if (renderer) {
    return <>{renderer(items, onClose)}</>;
  }

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center gap-4"
      style={{ opacity: 1, pointerEvents: 'auto' }}
    >
      <button
        className="absolute top-4 right-4 p-2 text-white"
        onClick={onClose}
        aria-label="Close menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {items.map((item, index) => (
        <a
          key={index}
          className="text-xl font-bold text-secondary hover:text-white transition-colors cursor-pointer"
          onClick={() => {
            item.onClick?.();
            onClose();
          }}
        >
          {item.label}

          {item.dropdown?.map((dropdownItem, dropdownIndex) => (
            <a
              key={dropdownIndex}
              className="block text-lg font-bold text-muted hover:text-white transition-colors cursor-pointer mt-2 ml-4"
              onClick={() => {
                dropdownItem.onClick?.();
                onClose();
              }}
            >
              → {dropdownItem.label}
            </a>
          ))}
        </a>
      ))}
    </div>
  );
}
