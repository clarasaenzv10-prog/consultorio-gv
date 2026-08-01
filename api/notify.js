// api/notify.js - Vercel Serverless Function
// Manda push notifications via FCM cuando llega una solicitud o mensaje

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, body, tokens } = req.body;

  if (!title || !body || !tokens || !tokens.length) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const serverKey = process.env.FIREBASE_SERVER_KEY;
  if (!serverKey) {
    return res.status(500).json({ error: "Server key no configurada" });
  }

  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Authorization": "key=" + serverKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registration_ids: tokens,
        notification: { title, body },
        android: { priority: "high" },
        apns: { payload: { aps: { sound: "default" } } },
      }),
    });

    const data = await response.json();
    return res.status(200).json({ ok: true, result: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
