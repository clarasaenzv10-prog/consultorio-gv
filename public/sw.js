const CACHE = 'gv-v6';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  if(e.request.method !== 'GET') return;
  if(e.request.url.includes('firebase') || 
     e.request.url.includes('googleapis') ||
     e.request.url.includes('gstatic') ||
     e.request.url.includes('fonts')) return;
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match('/index.html');
    })
  );
});

// Handle push notifications from FCM
self.addEventListener('push', function(e) {
  if(!e.data) return;
  try {
    var payload = e.data.json();
    var title = (payload.notification && payload.notification.title) || 'Consultorio GV';
    var body = (payload.notification && payload.notification.body) || '';
    var options = {
      body: body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data: { url: '/' }
    };
    e.waitUntil(self.registration.showNotification(title, options));
  } catch(err) {
    var text = e.data.text();
    e.waitUntil(self.registration.showNotification('Consultorio GV', { body: text, icon: '/icon-192.png' }));
  }
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(cls) {
      if(cls.length > 0) return cls[0].focus();
      return clients.openWindow('/');
    })
  );
});
