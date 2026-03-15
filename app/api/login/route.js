import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();
    console.log("=== LOGIN DEBUG ===");
    console.log("Email:", normalizedEmail);
    console.log("Password length:", password.length);

    // Query directly via mongoose connection — no model caching issues
    const db = mongoose.connection.db;
    const user = await db.collection("users").findOne({ email: normalizedEmail });

    console.log("User found:", user ? "YES" : "NO");

    if (!user)
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

    console.log("Stored hash:", user.password);
    console.log("Hash starts with $2:", user.password?.startsWith("$2"));

    // If password is not hashed (old localStorage data), reject clearly
    if (!user.password?.startsWith("$2")) {
      console.log("ERROR: Password not hashed — delete this user and re-register");
      return NextResponse.json({ error: "Account corrupted. Please register again." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch)
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role || "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Logged in successfully.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role || "client" },
    });

  } catch (err) {
    console.error("Login error full:", err);
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}