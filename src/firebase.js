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

export async function requestNotifPermission(userName) {
  try {
    if (typeof Notification === "undefined") return null;
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return null;
    const { getMessaging, getToken } = await import("firebase/messaging");
    const messaging = getMessaging(app);
    const reg = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey: "BEOUqU1iowa8d-fZZkmIn44GmXyp6e4EMAfflzia-w_RqQw-E_QJJDdWHjRliXmWDktJb9PvPLHbqT27kNX2SMc",
      serviceWorkerRegistration: reg
    });
    if (token && userName) {
      await setDoc(doc(db, "fcmTokens", token.substring(0, 100)), { token, user: userName, ts: new Date().toISOString() }, { merge: true });
    }
    return token;
  } catch(e) {
    console.log("FCM error:", e);
    return null;
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
