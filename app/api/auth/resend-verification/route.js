import { NextResponse } from "next/server";
import { findUser, updateUser } from "@/lib/mongodb";
import { createEmailVerificationToken, sendVerificationEmail } from "@/lib/email-verification";
import { addSecurityHeaders } from "@/lib/security";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Email is required" }, { status: 400 })
      );
    }

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

  } catch (error) {
    console.error("Resend verification error:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Failed to resend verification email" }, { status: 500 })
    );
  }
}
