/**
 * Navigation Manager
 * Cross-framework navigation utilities
 */

export interface NavigationEvent {
  type: 'navigate' | 'route-changed';
  route: string;
  params?: Record<string, string>;
}

export type NavigationCallback = (event: NavigationEvent) => void;

class NavigationManager {
  private listeners: Set<NavigationCallback> = new Set();
  private currentRoute: string = '';

  subscribe(callback: NavigationCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  navigate(route: string, params?: Record<string, string>): void {
    this.currentRoute = route;
    this.emit({ type: 'navigate', route, params });
    this.emit({ type: 'route-changed', route, params });
  }

  getCurrentRoute(): string {
    return this.currentRoute;
  }

  private emit(event: NavigationEvent): void {
    this.listeners.forEach(callback => callback(event));
  }
}

// Singleton instance
export const navigationManager = new NavigationManager();

/**
 * Creates a navigation handler for use in components
 */
export function createNavigationHandler(onNavigate?: (route: string) => void) {
  return (route: string, params?: Record<string, string>) => {
    navigationManager.navigate(route, params);
    onNavigate?.(route);
  };
}
