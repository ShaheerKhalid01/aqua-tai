import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file)
      return NextResponse.json({ error: "No image provided." }, { status: 400 });

    // Check Cloudinary env vars
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log("Cloudinary cloud_name:", cloudName);
    console.log("Cloudinary api_key:", apiKey ? "set" : "missing");
    console.log("Cloudinary api_secret:", apiSecret ? "set" : "missing");

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary credentials missing in environment variables." }, { status: 500 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload directly via Cloudinary REST API — no SDK needed
    const formPayload = new FormData();
    formPayload.append("file", base64);
    formPayload.append("upload_preset", "ml_default");
    formPayload.append("folder", "aquatai/products");

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formPayload }
    );

    const uploadData = await uploadRes.json();
    console.log("Cloudinary response:", uploadData);

    if (uploadData.error) {
      return NextResponse.json({ error: "Upload failed: " + uploadData.error.message }, { status: 500 });
    }

    return NextResponse.json({ url: uploadData.secure_url, public_id: uploadData.public_id });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed: " + err.message }, { status: 500 });
  }
}