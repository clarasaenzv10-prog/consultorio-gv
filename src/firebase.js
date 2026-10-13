import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfF3r9X9END2GH8mFwDsXmoy7crk0LJiE",
  authDomain: "consultorio-gv-dc2db.firebaseapp.com",
  projectId: "consultorio-gv-dc2db",
  storageBucket: "consultorio-gv-dc2db.firebasestorage.app",
  messagingSenderId: "816478423904",
  appId: "1:816478423904:web:9252d5b442048f3d882c05"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function listenCol(name, cb) {
  return onSnapshot(collection(db, name), function(snap) {
    cb(snap.docs.map(function(d) { return Object.assign({}, d.data(), { id: d.id }); }));
  });
}

export function saveDoc(col, id, data) {
  return setDoc(doc(db, col, String(id)), data, { merge: true });
}

export function delDoc(col, id) {
  return deleteDoc(doc(db, col, String(id)));
}

export async function seedIfEmpty(col, items) {
  const snap = await getDocs(collection(db, col));
  if (!snap.empty) return;
  const batch = writeBatch(db);
  items.forEach(function(item) { batch.set(doc(db, col, String(item.id)), item); });
  await batch.commit();
}

// Pide permiso (si falta), registra el service worker de FCM y guarda el token del
// dispositivo en Firestore (fcmTokens) con el usuario y su rol.
// IMPORTANTE: en iPhone hay que llamarla desde un toque del usuario (boton) y la app
// tiene que estar abierta desde el icono de la pantalla de inicio.
// Devuelve { status: "granted"|"denied"|"default"|"unsupported"|"error", token?, error? }
export async function requestNotifPermission(userName, role) {
  try {
    if (typeof Notification === "undefined" || !("serviceWorker" in navigator)) return { status: "unsupported" };
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    if (perm !== "granted") return { status: perm };
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const reg = await navigator.serviceWorker.ready;
    const { getMessaging, getToken } = await import("firebase/messaging");
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: "BEOUqU1iowa8d-fZZkmIn44GmXyp6e4EMAfflzia-w_RqQw-E_QJJDdWHjRliXmWDktJb9PvPLHbqT27kNX2SMc",
      serviceWorkerRegistration: reg
    });
    if (!token) return { status: "error", error: "FCM no devolvio token" };
    await setDoc(doc(db, "fcmTokens", token.substring(0, 100)), { token: token, user: userName || "", role: role || "", ts: new Date().toISOString() }, { merge: true });
    return { status: "granted", token: token };
  } catch (e) {
    console.log("FCM error:", e);
    return { status: "error", error: String((e && e.message) || e) };
  }
}

export function listenForeground(cb) {
  import("firebase/messaging").then(function(m) {
    try {
      const messaging = m.getMessaging(app);
      m.onMessage(messaging, cb);
    } catch(e) {}
  }).catch(function(){});
  return function() {};
}
