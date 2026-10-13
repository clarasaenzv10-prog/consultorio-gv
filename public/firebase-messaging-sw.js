// firebase-messaging-sw.js
// Este archivo DEBE estar en /public/ para que FCM funcione en background.
// Los avisos llegan como mensajes "data-only" (sin campo notification) para que
// este service worker sea el UNICO que muestra la notificacion y actualiza el
// numero rojo del icono (Badging API). Asi no se duplican ni dependen del navegador.

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

function actualizarBadge(n) {
  try {
    var nav = self.navigator;
    if (!nav) return Promise.resolve();
    if (n > 0 && nav.setAppBadge) return Promise.resolve(nav.setAppBadge(n)).catch(function() {});
    if (n === 0 && nav.clearAppBadge) return Promise.resolve(nav.clearAppBadge()).catch(function() {});
  } catch (e) {}
  return Promise.resolve();
}

// Mensajes en background (app cerrada o en segundo plano)
messaging.onBackgroundMessage(function(payload) {
  var d = payload.data || {};
  var n = payload.notification || {};
  var title = d.title || n.title || 'Consultorio GV';
  var body = d.body || n.body || '';
  var badge = parseInt(d.badge, 10);

  var tareas = [];
  if (!isNaN(badge)) tareas.push(actualizarBadge(badge));
  tareas.push(self.registration.showNotification(title, {
    body: body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: d.url || '/' }
  }));
  return Promise.all(tareas);
});

// Click en la notificacion abre la app
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
