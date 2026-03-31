import { NextResponse } from "next/server";
import { connectDB, findUser } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { rateLimit, addSecurityHeaders } from "@/lib/security";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Rate limiting check
    const clientIP = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    
    if (!rateLimit(clientIP, 3, 15 * 60 * 1000)) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Too many admin login attempts. Please try again later." }, { status: 429 })
      );
    }

    const body = await req.json();
    const { id, password } = body;

    // Use server-side environment variables (not public)
    const validId = process.env.ADMIN_ID || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "change_this_immediately";
    const jwtSecret = process.env.JWT_SECRET;

    if (!id || !password) {
      return addSecurityHeaders(
        NextResponse.json({ error: "ID and password are required." }, { status: 400 })
      );
    }

    if (id !== validId) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 })
      );
    }

    // Check if password is a hash (starts with $2b$) or plain text
    let isPasswordValid;
    if (validPassword.startsWith('$2b$')) {
      // Hashed password - use bcrypt comparison
      isPasswordValid = await bcrypt.compare(password, validPassword);
    } else {
      // Plain text password - direct comparison
      isPasswordValid = password === validPassword;
    }
    
    if (!isPasswordValid) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 })
      );
    }

    const token = jwt.sign(
      { role: "admin", id: "admin" },
      jwtSecret,
      { expiresIn: "8h" }
    );

    return addSecurityHeaders(
      NextResponse.json({ message: "Admin login successful.", token })
    );

  } catch (err) {
    console.error("Admin login error occurred");
    return addSecurityHeaders(
      NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    );
  }
}