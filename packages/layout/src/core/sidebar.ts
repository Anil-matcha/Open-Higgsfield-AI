/**
 * Sidebar Layout Configuration
 * Collapsible navigation sidebar
 */

export interface SidebarConfig {
  /** Sidebar width */
  width: string;
  /** Whether sidebar is collapsible */
  collapsible: boolean;
  /** Default collapsed state */
  defaultCollapsed: boolean;
  /** Navigation items */
  items: SidebarItem[];
}

export interface SidebarItem {
  /** Display label */
  label: string;
  /** Navigation route */
  route: string;
  /** Icon identifier */
  icon?: string;
  /** Nested items */
  children?: SidebarItem[];
  /** Click handler */
  onClick?: () => void;
}

export const defaultSidebarConfig: SidebarConfig = {
  width: '250px',
  collapsible: true,
  defaultCollapsed: false,
  items: [],
};

/**
 * Creates sidebar layout structure
 */
export function createSidebarStructure(config: SidebarConfig = defaultSidebarConfig) {
  return {
    container: {
      width: config.width,
      height: '100%',
      background: 'var(--bg-panel, #0a0a0a)',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      color: 'var(--text-secondary, #a1a1aa)',
      cursor: 'pointer',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '8px',
      margin: '2px 8px',
    },
    itemHover: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'var(--text-primary, #ffffff)',
    },
    itemActive: {
      background: 'rgba(217, 255, 0, 0.1)',
      color: 'var(--color-primary, #d9ff00)',
    },
  };
}
