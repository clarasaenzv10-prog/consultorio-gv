// firebase-messaging-sw.js
// Este archivo DEBE estar en /public/ para que FCM funcione en background

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBfF3r9X9END2GH8mFwDsXmoy7crk0LJiE",
  authDomain: "consultorio-gv-dc2db.firebaseapp.com",
  projectId: "consultorio-gv-dc2db",
  storageBucket: "consultorio-gv-dc2db.firebasestorage.app",
  messagingSenderId: "816478423904",
  appId: "1:816478423904:web:9252d5b442048f3d882c05"
});

const messaging = firebase.messaging();

// Manejar mensajes en background (app cerrada o en segundo plano)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message:', payload);

  const title = (payload.notification && payload.notification.title) || 'Consultorio GV';
  const body = (payload.notification && payload.notification.body) || '';

  self.registration.showNotification(title, {
    body: body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'consultorio-gv',
    renotify: true
  });
});

// Click en la notificación abre la app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url.includes(self.location.origin) && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
