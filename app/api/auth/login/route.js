import { NextResponse } from "next/server";
import { connectDB, findUser } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { trackLoginAttempt, validatePassword, addSecurityHeaders } from "@/lib/security";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Debug logging to file
    const fs = require('fs');
    const path = require('path');
    const logFile = path.join(process.cwd(), 'temp-auth-debug.log');
    const log = (msg) => {
      try {
        fs.appendFileSync(logFile, `${new Date().toISOString()} - [LOGIN] ${msg}\n`);
      } catch (e) { }
    };

    log(`=== LOGIN ATTEMPT: ${email} ===`);
    log(`Password length: ${password?.length || 0}`);

    if (!email || !password) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Email and password are required." }, { status: 400 })
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limiting and login attempts
    const initialCheck = trackLoginAttempt(normalizedEmail, undefined);

    if (initialCheck.lockoutUntil > Date.now()) {
      const remainingTime = Math.ceil((initialCheck.lockoutUntil - Date.now()) / 60000);
      return addSecurityHeaders(
        NextResponse.json({
          error: `Account temporarily locked. Try again in ${remainingTime} minutes.`
        }, { status: 429 })
      );
    }

    const user = await findUser(normalizedEmail);

    if (!user) {
      trackLoginAttempt(normalizedEmail, false);
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

    // Check for Google OAuth accounts
    if (user.password && user.password.startsWith("googl")) {
      return addSecurityHeaders(
        NextResponse.json({
          error: "This account was created with Google. Please use the 'Continue with Google' button.",
        }, { status: 401 })
      );
    }

    // Standard hashed password check
    if (!user.password || !user.password.startsWith("$2")) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Account security error. Please reset your password." }, { status: 401 })
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    log(`Bcrypt match result: ${isMatch}`);

    if (!isMatch) {
      log(`❌ Password mismatch for user: ${normalizedEmail}`);
      log(`Bcrypt version check: ${user.password.substring(0, 7)}`);
      trackLoginAttempt(normalizedEmail, false);
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
    console.error("Login error occurred:", err);
    return addSecurityHeaders(
      NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    );
  }
}
