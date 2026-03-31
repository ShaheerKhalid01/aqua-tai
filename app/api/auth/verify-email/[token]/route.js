import { NextResponse } from "next/server";
import { findUser, updateUser } from "@/lib/mongodb";
import { verifyEmailToken, clearEmailVerificationToken, markEmailAsVerified } from "@/lib/email-verification";
import { addSecurityHeaders } from "@/lib/security";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    // Extract token from URL path for Next.js dynamic routes
    const urlPath = req.url.split('?')[0]; // Remove query parameters
    const pathParts = urlPath.split('/');
    const tokenFromPath = pathParts[pathParts.length - 1]; // Get last part as token

    console.log('=== EMAIL VERIFICATION DEBUG ===');
    console.log('Email:', email);
    console.log('Token from path:', tokenFromPath);
    console.log('Full URL:', req.url);

    if (!email || !tokenFromPath) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid verification link" }, { status: 400 })
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Verify the token
    const isValidToken = verifyEmailToken(normalizedEmail, tokenFromPath);
    if (!isValidToken) {
      console.log('❌ Token verification failed');
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid or expired verification link" }, { status: 400 })
      );
    }

    console.log('✅ Token verification successful');

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
          message: "Email already verified. You can now login.",
          alreadyVerified: true
        })
      );
    }

    // Mark email as verified in database
    await updateUser(normalizedEmail, { emailVerified: true });

    // Mark email as verified in memory
    markEmailAsVerified(normalizedEmail);

    // Clear the verification token
    clearEmailVerificationToken(normalizedEmail);

    // Generate login token for convenience
    const loginToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return addSecurityHeaders(
      NextResponse.json({
        message: "Email verified successfully! You can now login to your account.",
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: true
        },
        token: loginToken
      })
    );

  } catch (error) {
    console.error("Email verification error:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Email verification failed" }, { status: 500 })
    );
  }
}
