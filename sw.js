/**
 * Create cache when SW installs
 */
const cacheName = 'static-cache-v2';

const filesToCache = [
  '/ALC-7DaysofCodeChallenge/', // This root url caches normalize.css and google fonts
  './index.html',
  './manifest.json',
  './public/css/styles.min.css',
  './public/css/styles.min.css.map',
  './public/js/app.min.js',
  './public/js/app.min.js.map',
  './public/favicons/favicon.ico',
];

/**
 * Cache static files
 */
self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }),
  );
});

/**
 *  Purge previous cache after activating the next cache
 */
self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});

/**
 * Serve app from cache if there is a cached version
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request)),
  );
});
