const CACHE = "consultorio-gv-v2";
const STATIC = ["/", "/index.html"];

self.addEventListener("install", function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(STATIC); })
  );
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  if(e.request.method !== "GET") return;
  if(e.request.url.includes("firebase") || e.request.url.includes("googleapis")) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      const network = fetch(e.request).then(function(res) {
        if(res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return res;
      });
      return cached || network;
    })
  );
});
