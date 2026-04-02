/**
 * Content Area Layout Configuration
 * Main content container filling remaining space
 */

export interface ContentAreaConfig {
  /** Flexible layout to fill remaining space */
  flexible: boolean;
  /** Background color */
  background: string;
  /** Padding */
  padding: string;
}

export const defaultContentAreaConfig: ContentAreaConfig = {
  flexible: true,
  background: 'var(--bg-app, #050505)',
  padding: '0',
};

/**
 * Creates content area layout structure
 */
export function createContentAreaStructure(config: ContentAreaConfig = defaultContentAreaConfig) {
  return {
    container: {
      flex: config.flexible ? 1 : 'none',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: config.background,
      padding: config.padding,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    inner: {
      flex: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
  };
}
