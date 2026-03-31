import { NextResponse } from "next/server";
import { connectDB, findUser } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { trackLoginAttempt, validatePassword, addSecurityHeaders } from "@/lib/security";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Input validation
    if (!email || !password) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Email and password are required." }, { status: 400 })
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limiting and login attempts
    const loginAttempt = trackLoginAttempt(normalizedEmail, false);
    
    if (loginAttempt.lockoutUntil > Date.now()) {
      const remainingTime = Math.ceil((loginAttempt.lockoutUntil - Date.now()) / 60000);
      return addSecurityHeaders(
        NextResponse.json({ 
          error: `Account temporarily locked. Try again in ${remainingTime} minutes.` 
        }, { status: 429 })
      );
    }

    const user = await findUser(normalizedEmail);

    if (!user) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return addSecurityHeaders(
        NextResponse.json({ 
          error: "Please verify your email before logging in. Check your inbox for the verification link.",
          requiresVerification: true
        }, { status: 401 })
      );
    }

    // If password is not hashed (old localStorage data), reject clearly
    if (!user.password?.startsWith("$2")) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Account corrupted. Please register again." }, { status: 401 })
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
      );
    }

    // Track successful login
    trackLoginAttempt(normalizedEmail, true);

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role || "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return addSecurityHeaders(
      NextResponse.json({
        message: "Logged in successfully.",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role || "client", emailVerified: user.emailVerified },
      })
    );

  } catch (err) {
    // Don't log sensitive authentication data
    console.error("Login error occurred");
    return addSecurityHeaders(
      NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    );
  }
}