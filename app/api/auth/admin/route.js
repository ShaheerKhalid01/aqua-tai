import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, password } = body;

    const validId = process.env.NEXT_PUBLIC_ADMIN_ID || "admin";
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "aquatai@admin123";
    const jwtSecret = process.env.JWT_SECRET || "aquatai_fallback_secret";

    console.log("=== ADMIN LOGIN ===");
    console.log("Received ID:", id);
    console.log("Expected ID:", validId);
    console.log("ID match:", id === validId);
    console.log("Password match:", password === validPassword);

    if (!id || !password)
      return NextResponse.json({ error: "ID and password are required." }, { status: 400 });

    if (id !== validId || password !== validPassword)
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });

    const token = jwt.sign(
      { role: "admin", id: "admin" },
      jwtSecret,
      { expiresIn: "8h" }
    );

    return NextResponse.json({ message: "Admin login successful.", token });

  } catch (err) {
    console.error("Admin login error:", err.message);
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}