/**
 * Route Events
 * Event system for route changes
 */

export interface RouteChangeEvent extends CustomEvent {
  detail: {
    page: string;
    params?: Record<string, string>;
  };
}

/**
 * Dispatches a route change event
 */
export function dispatchRouteChange(element: HTMLElement, page: string, params?: Record<string, string>): void {
  const event = new CustomEvent('route-changed', {
    detail: { page, params },
    bubbles: true,
    composed: true,
  });
  element.dispatchEvent(event);
}

/**
 * Listens for route change events
 */
export function onRouteChange(element: HTMLElement, callback: (page: string, params?: Record<string, string>) => void): () => void {
  const handler = (event: Event) => {
    const customEvent = event as RouteChangeEvent;
    callback(customEvent.detail.page, customEvent.detail.params);
  };
  
  element.addEventListener('route-changed', handler);
  return () => element.removeEventListener('route-changed', handler);
}
