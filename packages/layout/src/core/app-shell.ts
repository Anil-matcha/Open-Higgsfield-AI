/**
 * App Shell Layout Configuration
 * Manages the full-page app container with header, sidebar, and content area
 */

export interface AppShellConfig {
  /** Full-width header spanning the entire app */
  header: {
    enabled: boolean;
    sticky: boolean;
    zIndex: number;
  };
  /** Sidebar navigation */
  sidebar: {
    enabled: boolean;
    width: string;
    collapsible: boolean;
    defaultCollapsed: boolean;
  };
  /** Main content area */
  content: {
    flexible: boolean;
  };
}

export const defaultAppShellConfig: AppShellConfig = {
  header: {
    enabled: true,
    sticky: true,
    zIndex: 50,
  },
  sidebar: {
    enabled: true,
    width: '250px',
    collapsible: true,
    defaultCollapsed: false,
  },
  content: {
    flexible: true,
  },
};

/**
 * Creates the layout structure configuration
 */
export function createLayoutStructure(config: AppShellConfig = defaultAppShellConfig) {
  return {
    appShell: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-app, #050505)',
    },
    header: config.header.enabled
      ? {
          width: '100%',
          position: config.header.sticky ? 'sticky' : 'relative',
          top: config.header.sticky ? 0 : 'auto',
          zIndex: config.header.zIndex,
        }
      : null,
    body: {
      flex: 1,
      display: 'flex',
    },
    sidebar: config.sidebar.enabled
      ? {
          width: config.sidebar.width,
          flexShrink: 0,
        }
      : null,
    content: {
      flex: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-app, #050505)',
    },
  };
}
