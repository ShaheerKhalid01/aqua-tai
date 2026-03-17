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

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Upload to Imgur — free, no account needed
    const imgurForm = new FormData();
    imgurForm.append("image", base64);
    imgurForm.append("type", "base64");

    const res = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: "Client-ID 546c25a59c58ad7",
      },
      body: imgurForm,
    });

    const data = await res.json();
    console.log("Imgur response:", data);

    if (!data.success)
      return NextResponse.json({ error: "Upload failed: " + (data.data?.error || "Unknown error") }, { status: 500 });

    return NextResponse.json({ url: data.data.link, public_id: data.data.id });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed: " + err.message }, { status: 500 });
  }
}