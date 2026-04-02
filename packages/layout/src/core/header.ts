/**
 * Header Layout Configuration
 * Full-width header component spanning the entire app
 */

export interface HeaderConfig {
  /** Logo configuration */
  logo: {
    enabled: boolean;
    onClick?: () => void;
  };
  /** Navigation menu items */
  navigation: {
    enabled: boolean;
    items: NavigationItem[];
  };
  /** Right-side actions (user menu, settings, etc.) */
  actions: {
    enabled: boolean;
  };
  /** Mobile menu */
  mobile: {
    enabled: boolean;
    breakpoint: string;
  };
}

export interface NavigationItem {
  label: string;
  route: string;
  icon?: string;
  dropdown?: NavigationItem[];
  onClick?: () => void;
}

export const defaultHeaderConfig: HeaderConfig = {
  logo: {
    enabled: true,
  },
  navigation: {
    enabled: true,
    items: [],
  },
  actions: {
    enabled: true,
  },
  mobile: {
    enabled: true,
    breakpoint: 'lg',
  },
};

/**
 * Creates header layout structure
 */
export function createHeaderStructure(config: HeaderConfig = defaultHeaderConfig) {
  return {
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      position: 'sticky',
      top: 0,
    },
    navBar: {
      width: '100%',
      height: '56px', // h-14
      background: 'var(--bg-app, #050505)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', // px-6
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(12px)',
    },
    leftPart: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px', // gap-6
    },
    rightPart: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px', // gap-3
    },
    menu: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px', // gap-5
      fontSize: '13px',
      fontWeight: '700',
      color: 'var(--text-secondary, #a1a1aa)',
    },
  };
}
