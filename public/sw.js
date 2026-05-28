const CACHE = 'gv-v7';
self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e) {
  if(e.request.method!=='GET') return;
  if(e.request.url.includes('firebase')||e.request.url.includes('googleapis')||e.request.url.includes('gstatic')) return;
  e.respondWith(fetch(e.request).catch(function(){return caches.match('/index.html');}));
});
self.addEventListener('push', function(e) {
  if(!e.data) return;
  try {
    var d=e.data.json();
    var title=(d.notification&&d.notification.title)||'Consultorio GV';
    var body=(d.notification&&d.notification.body)||'';
    e.waitUntil(self.registration.showNotification(title,{body:body,icon:'/icon-192.png',badge:'/icon-192.png',vibrate:[200,100,200]}));
  } catch(err){}
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
