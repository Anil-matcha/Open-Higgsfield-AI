/**
 * Unified Layout System for Open Higgsfield AI
 * Vue implementation exports
 */

export { default as AppShell } from './AppShell.vue';
export { default as Header } from './Header.vue';
export { default as Sidebar } from './Sidebar.vue';
export { default as ContentArea } from './ContentArea.vue';

export type { AppShellConfig } from '../core/app-shell';
export type { HeaderConfig, NavigationItem } from '../core/header';
export type { SidebarConfig, SidebarItem } from '../core/sidebar';
export type { ContentAreaConfig } from '../core/content-area';
