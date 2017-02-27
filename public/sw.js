// cache names
var cache_shell = 'shell_cache_v1',
    cache_data = 'data_cache_v1';
var filesToCache = [
    '/',
    '/index.html'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cache_shell).then(function(cache) {
            // caching app shell
            return cache.addAll(filesToCache);
        })
    );
});

// activate fires when SW starts
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cache_shell && key !== cache_data) {
                    // remove old cache
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// fetch cache, fallback to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});