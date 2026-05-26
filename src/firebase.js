import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
export function saveDoc(col, id, data) { return setDoc(doc(db, col, String(id)), data, { merge: true }); }
export function delDoc(col, id) { return deleteDoc(doc(db, col, String(id))); }
export async function seedIfEmpty(col, items) {
  const snap = await getDocs(collection(db, col));
  if (!snap.empty) return;
  const batch = writeBatch(db);
  items.forEach(function(item) { batch.set(doc(db, col, String(item.id)), item); });
  await batch.commit();
}

let _messaging = null;
function getMsg() {
  if (!_messaging) {
    try { _messaging = getMessaging(app); } catch(e) { return null; }
  }
  return _messaging;
}

export async function requestNotifPermission(userName) {
  try {
    if (typeof Notification === "undefined") return null;
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return null;
    const msg = getMsg();
    if (!msg) return null;
    const token = await getToken(msg, { vapidKey: "BEOUqU1iowa8d-fZZkmIn44GmXyp6e4EMAfflzia-w_RqQw-E_QJJDdWHjRliXmWDktJb9PvPLHbqT27kNX2SMc", serviceWorkerRegistration: await navigator.serviceWorker.ready });
    if (token && userName) {
      await setDoc(doc(db, "fcmTokens", token.substring(0, 100)), { token, user: userName, ts: new Date().toISOString() }, { merge: true });
    }
    return token;
  } catch(e) {
    console.log("FCM permission error:", e);
    return null;
  }
}

export function listenForeground(cb) {
  const msg = getMsg();
  if (!msg) return function() {};
  try { return onMessage(msg, cb); } catch(e) { return function() {}; }
}
