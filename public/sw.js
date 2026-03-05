// Nora Story Service Worker
const CACHE_NAME = 'nora-story-v1';
const STATIC_ASSETS = [
    '/',
    '/logo.png',
    '/manifest.json',
];

// Install — cache essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

// Fetch — network-first strategy (always get fresh content, fallback to cache)
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and chrome-extension URLs
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
