import { NextResponse } from "next/server";
import { connectDB, findUser, createUser } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { rateLimit, validatePassword, addSecurityHeaders } from "@/lib/security";

export async function POST(req) {
  try {
    // Rate limiting check
    const clientIP = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    
    if (!rateLimit(clientIP, 5, 15 * 60 * 1000)) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 })
      );
    }

    const { name, email, password } = await req.json();

    // Input validation
    if (!name || !email || !password) {
      return addSecurityHeaders(
        NextResponse.json({ error: "All fields are required." }, { status: 400 })
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enhanced password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return addSecurityHeaders(
        NextResponse.json({ 
          error: "Password requirements not met", 
          details: passwordValidation.errors 
        }, { status: 400 })
      );
    }

    const existing = await findUser(normalizedEmail);

    if (existing) {
      return addSecurityHeaders(
        NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
      );
    }

    // Hash password with higher salt rounds
    const hashedPassword = await bcrypt.hash(password, 14);

    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "client",
      createdAt: new Date().toISOString(),
    });

    const token = jwt.sign(
      { id: user._id, email: normalizedEmail, name: name.trim(), role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return addSecurityHeaders(
      NextResponse.json({
        message: "Account created successfully.",
        token,
        user: { id: user._id, name: name.trim(), email: normalizedEmail, role: "client" },
      }, { status: 201 })
    );

  } catch (err) {
    console.error("Registration error occurred");
    return addSecurityHeaders(
      NextResponse.json({ error: "Registration failed" }, { status: 500 })
    );
  }
}