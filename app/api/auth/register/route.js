import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();

    // Query raw collection — no model caching
    const db = mongoose.connection.db;
    const existing = await db.collection("users").findOne({ email: normalizedEmail });

    if (existing)
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Registering:", normalizedEmail);
    console.log("Hash created:", hashedPassword.startsWith("$2") ? "YES" : "NO");

    const result = await db.collection("users").insertOne({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "client",
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { id: result.insertedId, email: normalizedEmail, name: name.trim(), role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Account created successfully.",
      token,
      user: { id: result.insertedId, name: name.trim(), email: normalizedEmail, role: "client" },
    }, { status: 201 });

  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}