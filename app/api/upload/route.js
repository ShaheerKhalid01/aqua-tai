import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  try {
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "aquatai_fallback_secret");
    return decoded.role === "admin";
  } catch { return false; }
}

export async function POST(req) {
  if (!verifyAdmin(req))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const cloudName   = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey      = process.env.CLOUDINARY_API_KEY;
    const apiSecret   = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret)
      return NextResponse.json({ error: "Cloudinary credentials missing." }, { status: 500 });

    const formData = await req.formData();
    const file = formData.get("image");
    if (!file)
      return NextResponse.json({ error: "No image provided." }, { status: 400 });

    // Convert to base64
    const bytes  = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    // Build signed request
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder    = "aquatai/products";

    // Signature: sign "folder=...&timestamp=..." with api_secret
    const signStr  = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha256").update(signStr).digest("hex");

    const payload = new FormData();
    payload.append("file",      base64);
    payload.append("timestamp", timestamp);
    payload.append("api_key",   apiKey);
    payload.append("signature", signature);
    payload.append("folder",    folder);

    const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: payload,
    });

    const data = await res.json();

    if (data.error)
      return NextResponse.json({ error: "Upload failed: " + data.error.message }, { status: 500 });

    return NextResponse.json({ url: data.secure_url, public_id: data.public_id });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed: " + err.message }, { status: 500 });
  }
}