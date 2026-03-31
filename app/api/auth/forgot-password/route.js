import { NextResponse } from "next/server";
import { findUser } from "@/lib/mongodb";
import { sendPasswordResetEmail, createPasswordResetToken } from "@/lib/email";
import { addSecurityHeaders } from "@/lib/security";
import { rateLimit } from "@/lib/security";

export async function POST(req) {
  // Apply rate limiting
  const identifier = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(identifier, 3, 15 * 60 * 1000)) { // 3 attempts per 15 minutes
    return addSecurityHeaders(
      NextResponse.json({ error: "Too many reset requests. Please try again later." }, { status: 429 })
    );
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Email is required" }, { status: 400 })
      );
    }

    // Check if user exists
    const user = await findUser(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return addSecurityHeaders(
        NextResponse.json({ message: "If an account exists, a reset link has been sent" })
      );
    }

    // Generate reset token
    const resetToken = createPasswordResetToken(email);

    // Send reset email (with fallback)
    const emailSent = await sendPasswordResetEmail(email, resetToken);
    
    if (!emailSent) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Failed to send reset email. Please try again." }, { status: 500 })
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
          ? "Password reset link generated (Development Mode: Check console for reset link)"
          : "Password reset link sent to your email",
        developmentMode: isUsingFallback
      })
    );

  } catch (error) {
    console.error("Password reset request error:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Failed to process reset request" }, { status: 500 })
    );
  }
}
