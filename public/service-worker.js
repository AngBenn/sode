const CACHE_NAME = 'sode-cache-v2'; // Changed from v1 to v2
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  // Add additional static files as needed
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip caching for API requests
  if (requestUrl.pathname.startsWith('/api')) {
    event.respondWith(fetch(event.request)); // Bypass cache for API
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});