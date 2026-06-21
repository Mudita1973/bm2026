const CACHE = 'bm2026-v5';
const ASSETS = [
  './index.html',
  './crossover.html',
  './meinplan.html',
  './workshops.html',
  './manifest.json',
  './bm2026-icon.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('youtube.com')) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(r) {
        if (r&&r.status===200) {
          var clone=r.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        }
        return r;
      }).catch(function(){ return caches.match('./index.html'); });
    })
  );
});
