import { defaultAppShellConfig, createLayoutStructure } from '../core/app-shell';

export function createAppShell(options = {}) {
  const config = options.config || defaultAppShellConfig;
  let sidebarCollapsed = config.sidebar.defaultCollapsed;

  const layoutStructure = createLayoutStructure(config);

  const shell = document.createElement('div');
  shell.className = 'app-shell';
  Object.assign(shell.style, layoutStructure.appShell);

  const toggleSidebar = () => {
    sidebarCollapsed = !sidebarCollapsed;
    options.onSidebarToggle && options.onSidebarToggle(sidebarCollapsed);
  };

  return {
    element: shell,
    toggleSidebar,
    isSidebarCollapsed: () => sidebarCollapsed,
    config,
  };
}
