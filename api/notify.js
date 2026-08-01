// api/notify.js - Vercel Serverless Function - FCM HTTP V1

async function getAccessToken() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Faltan variables de entorno de Firebase");
  }

  // Build JWT
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const b64 = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const signingInput = b64(header) + "." + b64(payload);

  // Sign with RS256
  const { createSign } = await import("crypto");
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(privateKey, "base64url");

  const jwt = signingInput + "." + signature;

  // Exchange JWT for access token
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" +
      jwt,
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("No se obtuvo access token: " + JSON.stringify(data));
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, body, tokens } = req.body;
  if (!title || !body || !tokens || !tokens.length) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const accessToken = await getAccessToken();
    const projectId = process.env.FIREBASE_PROJECT_ID;

    // Send to each token (FCM V1 sends one at a time)
    const results = await Promise.all(
      tokens.slice(0, 20).map(async (token) => {
        const r = await fetch(
          `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: {
                token,
                notification: { title, body },
                android: { priority: "high" },
                apns: { payload: { aps: { sound: "default" } } },
              },
            }),
          }
        );
        return r.ok;
      })
    );

    return res.status(200).json({ ok: true, sent: results.filter(Boolean).length });
  } catch (e) {
    console.error("Push error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
