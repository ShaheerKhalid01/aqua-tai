import { NextResponse } from "next/server";
import { verifyResetToken, clearResetToken } from "@/lib/email";
import { addSecurityHeaders } from "@/lib/security";
import { findUser, updateUser } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    // Extract token from URL path for Next.js dynamic routes
    const urlPath = req.url.split('?')[0]; // Remove query parameters
    const pathParts = urlPath.split('/');
    const tokenFromPath = pathParts[pathParts.length - 1]; // Get last part as token
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email || !tokenFromPath) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid reset link" }, { status: 400 })
      );
    }

    // Verify reset token
    const isValid = verifyResetToken(email, tokenFromPath);

    if (!isValid) {
      return addSecurityHeaders(
        NextResponse.json({ 
          error: "Invalid or expired reset token",
          valid: false 
        }, { status: 400 })
      );
    }

    return addSecurityHeaders(
      NextResponse.json({ 
        message: "Reset token is valid",
        valid: true,
        email: email,
        token: tokenFromPath
      })
    );

  } catch (error) {
    console.error("Token validation error:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Failed to validate reset token" }, { status: 500 })
    );
  }
}

export async function POST(req) {
  try {
    // Extract token from URL path for Next.js dynamic routes
    const urlPath = req.url.split('?')[0]; // Remove query parameters
    const pathParts = urlPath.split('/');
    const tokenFromPath = pathParts[pathParts.length - 1]; // Get last part as token
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const { newPassword } = await req.json();
    
    if (!email || !tokenFromPath || !newPassword) {
      return addSecurityHeaders(
        NextResponse.json({ error: "All fields are required" }, { status: 400 })
      );
    }

    // Verify reset token
    if (!verifyResetToken(email, tokenFromPath)) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
      );
    }

    // Find user
    const user = await findUser(email);
    if (!user) {
      return addSecurityHeaders(
        NextResponse.json({ error: "User not found" }, { status: 404 })
      );
    }

    // Validate new password
    if (newPassword.length < 6) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 14);

    // Update user password
    await updateUser(email, { password: hashedPassword });

    // Clear reset token
    clearResetToken(email, tokenFromPath);

    return addSecurityHeaders(
      NextResponse.json({ message: "Password reset successfully" })
    );

  } catch (error) {
    console.error("Password reset error:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
    );
  }
}
