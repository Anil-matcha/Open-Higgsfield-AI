/**
 * ViMax Layout Implementation
 * Using the unified @higgsfield/layout system
 */

import React from 'react';
import { 
  AppShell, 
  Header, 
  Sidebar, 
  ContentArea,
  useAppShell,
  defaultAppShellConfig,
  defaultHeaderConfig,
  defaultSidebarConfig,
  NavigationItem,
  SidebarItem
} from '@higgsfield/layout/react';

// ViMax-specific navigation items
const navigationItems: NavigationItem[] = [
  { label: 'Home', route: 'home' },
  { 
    label: 'Create', 
    route: 'create',
    dropdown: [
      { label: 'Text to Video', route: 'text-to-video' },
      { label: 'Image to Video', route: 'image-to-video' },
      { label: 'Script to Video', route: 'script-to-video' },
    ]
  },
  { label: 'Templates', route: 'templates' },
  { label: 'History', route: 'history' },
  { label: 'Batches', route: 'batches' },
];

// ViMax-specific sidebar items
const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', route: 'dashboard', icon: '📊' },
  { label: 'New Video', route: 'new-video', icon: '🎬' },
  { label: 'Templates', route: 'templates', icon: '📁' },
  { label: 'History', route: 'history', icon: '📜' },
  { label: 'Settings', route: 'settings', icon: '⚙️' },
];

interface ViMaxLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function ViMaxLayout({ children, currentView, onViewChange }: ViMaxLayoutProps) {
  // Configure header with ViMax navigation
  const headerConfig = {
    ...defaultHeaderConfig,
    navigation: {
      enabled: true,
      items: navigationItems.map(item => ({
        ...item,
        onClick: () => onViewChange(item.route),
      })),
    },
  };

  // Configure sidebar with ViMax items
  const sidebarConfig = {
    ...defaultSidebarConfig,
    items: sidebarItems.map(item => ({
      ...item,
      onClick: () => onViewChange(item.route),
    })),
  };

  // Logo component
  const logo = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
      }}>
        V
      </div>
      <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>ViMax</span>
    </div>
  );

  // Actions component (user menu, settings)
  const actions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button className="p-2 text-secondary hover:text-white transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </div>
  );

  return (
    <AppShell config={defaultAppShellConfig}>
      <Header 
        config={headerConfig}
        logo={logo}
        actions={actions}
      />
      
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar config={sidebarConfig} />
        
        <ContentArea>
          {children}
        </ContentArea>
      </div>
    </AppShell>
  );
}
