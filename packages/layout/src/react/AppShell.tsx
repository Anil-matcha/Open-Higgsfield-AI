import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppShellConfig, defaultAppShellConfig, createLayoutStructure } from '../core/app-shell';

interface AppShellContextValue {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  config: AppShellConfig;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShell provider');
  }
  return context;
}

interface AppShellProps {
  children: ReactNode;
  config?: AppShellConfig;
  className?: string;
}

export function AppShell({ children, config = defaultAppShellConfig, className = '' }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(config.sidebar.defaultCollapsed);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const layoutStructure = createLayoutStructure(config);

  return (
    <AppShellContext.Provider value={{ sidebarCollapsed, toggleSidebar, config }}>
      <div
        className={`app-shell ${className}`}
        style={layoutStructure.appShell as any}
      >
        {children}
      </div>
    </AppShellContext.Provider>
  );
}
