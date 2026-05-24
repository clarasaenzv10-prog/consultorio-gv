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

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

let messaging = null;
try { messaging = getMessaging(firebaseApp); } catch(e) {}

export const VAPID_KEY = "BEOUqU1iowa8d-fZZkmIn44GmXyp6e4EMAfflzia-w_RqQw-E_QJJDdWHjRliXmWDktJb9PvPLHbqT27kNX2SMc";

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

export async function requestNotifPermission(userName) {
  if(!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if(permission !== "granted") return null;
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if(token && userName) {
      await setDoc(doc(db, "fcmTokens", token), { token, user: userName, updated: new Date().toISOString() }, { merge: true });
    }
    return token;
  } catch(e) { console.log("FCM error:", e); return null; }
}

export function listenForegroundMessages(cb) {
  if(!messaging) return function(){};
  return onMessage(messaging, cb);
}
