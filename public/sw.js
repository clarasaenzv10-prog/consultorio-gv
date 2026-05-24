// Service Worker - Gloria Videla Consultorio
const CACHE = 'consultorio-gv-v4';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(['/', '/index.html']).catch(function(){});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if(e.request.method !== 'GET') return;
  if(e.request.url.includes('firebase') || 
     e.request.url.includes('googleapis') ||
     e.request.url.includes('gstatic')) return;
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request).then(function(r){
        return r || caches.match('/index.html');
      });
    })
  );
});

// FCM Background messages
self.addEventListener('push', function(e) {
  if(!e.data) return;
  try {
    const data = e.data.json();
    const title = (data.notification && data.notification.title) || 'Consultorio GV';
    const body = (data.notification && data.notification.body) || '';
    e.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200]
      })
    );
  } catch(err) {}
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
