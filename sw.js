const CACHE_NAME = 'fleet-ai-v1';
const ASSETS = [
  'index.html',
  'src/css/styles.css',
  'src/js/app.js',
  'src/js/data.js',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
