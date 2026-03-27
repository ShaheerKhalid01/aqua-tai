import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { id, password } = await req.json();

    const validId = process.env.NEXT_PUBLIC_ADMIN_ID;
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (id !== validId || password !== validPassword)
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });

    const token = jwt.sign(
      { role: "admin", id: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return NextResponse.json({ message: "Admin login successful.", token });

  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}