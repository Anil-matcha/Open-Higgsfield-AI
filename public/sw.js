/**
 * Service Worker for Offline Support
 * Caches critical assets for offline access
 */

const CACHE_NAME = 'higgsfield-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => {
            // Activate immediately
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            // Take control of all pages immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests except for CDN assets
    if (url.origin !== self.location.origin && 
        !url.hostname.includes('cdn') &&
        !url.hostname.includes('supabase')) {
        return;
    }
    
    event.respondWith(
        caches.match(request).then((cached) => {
            // Return cached version if available
            if (cached) {
                // Fetch in background to update cache
                fetch(request).then((response) => {
                    if (response.ok) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, response);
                        });
                    }
                }).catch(() => {});
                
                return cached;
            }
            
            // Fetch from network
            return fetch(request).then((response) => {
                // Don't cache non-OK responses
                if (!response.ok) {
                    return response;
                }
                
                // Cache successful responses
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone);
                });
                
                return response;
            }).catch(() => {
                // Return offline page for navigation requests
                if (request.mode === 'navigate') {
                    return caches.match('/');
                }
                
                return new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            });
        })
    );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
