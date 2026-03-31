import { NextResponse } from "next/server";
import { connectDB, findUser, createUser, updateUser } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { sendVerificationEmail, createEmailVerificationToken } from "@/lib/email-verification";
import { addSecurityHeaders } from "@/lib/security";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, email, password, resendVerification } = await req.json();

    // Handle resend verification
    if (resendVerification && email) {
      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();

      // Find the user
      const user = await findUser(normalizedEmail);
      if (!user) {
        return addSecurityHeaders(
          NextResponse.json({ error: "User not found" }, { status: 404 })
        );
      }

      // Check if already verified
      if (user.emailVerified) {
        return addSecurityHeaders(
          NextResponse.json({ 
            message: "Email is already verified. You can login.",
            alreadyVerified: true
          })
        );
      }

      // Generate new verification token
      const verificationToken = createEmailVerificationToken(normalizedEmail);

      // Send verification email
      const emailSent = await sendVerificationEmail(normalizedEmail, verificationToken, user.name);

      if (!emailSent) {
        return addSecurityHeaders(
          NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
        );
      }

      return addSecurityHeaders(
        NextResponse.json({
          message: "Verification email sent! Please check your inbox.",
          success: true
        })
      );
    }

    // Basic validation
    if (!name || !email || !password) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        )
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        )
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await findUser(normalizedEmail);
    if (existingUser) {
      if (existingUser.emailVerified) {
        return addSecurityHeaders(
          NextResponse.json(
            { error: "Email already registered and verified" },
            { status: 400 }
          )
        );
      } else {
        return addSecurityHeaders(
          NextResponse.json(
            { error: "Email already registered but not verified. Please check your email for verification link." },
            { status: 400 }
          )
        );
      }
    }

    // Simple password validation matching UI requirements
    if (password.length < 6) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        )
      );
    }

    // Hash password with higher salt rounds
    const hashedPassword = await bcrypt.hash(password, 14);

    // Create user with emailVerified = false
    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "client",
      emailVerified: false,
      createdAt: new Date().toISOString(),
    });

    // Generate verification token
    const verificationToken = createEmailVerificationToken(normalizedEmail);

    // Send verification email
    const emailSent = await sendVerificationEmail(normalizedEmail, verificationToken, name.trim());
    
    if (!emailSent) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Failed to send verification email. Please try again." },
          { status: 500 }
        )
      );
    }

    // Check if we're using fallback (development mode)
    const isUsingFallback = !process.env.EMAIL_USER || 
                           process.env.EMAIL_USER === 'your_gmail_address@gmail.com' ||
                           !process.env.EMAIL_PASS || 
                           process.env.EMAIL_PASS === 'your_gmail_app_password';

    return addSecurityHeaders(
      NextResponse.json({
        message: isUsingFallback 
          ? "Account created! Please verify your email (Development Mode: Check console for verification link)"
          : "Account created! Please check your email to verify your account",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: false
        },
        developmentMode: isUsingFallback,
        requiresVerification: true
      })
    );

  } catch (error) {
    console.error("Registration error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Registration failed. Please try again." },
        { status: 500 }
      )
    );
  }
}