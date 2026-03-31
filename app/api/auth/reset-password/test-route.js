import { NextResponse } from "next/server";
import { verifyResetToken, clearResetToken } from "@/lib/email";
import { addSecurityHeaders } from "@/lib/security";
import { findUser, updateUser } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const urlPath = req.url.split('?')[0];
    const pathParts = urlPath.split('/');
    const tokenFromPath = pathParts[pathParts.length - 1];
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email || !tokenFromPath) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid reset link" }, { status: 400 })
      );
    }

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
    const { email, token, newPassword } = await req.json();
    
    if (!email || !token || !newPassword) {
      return addSecurityHeaders(
        NextResponse.json({ error: "All fields are required" }, { status: 400 })
      );
    }

    if (!verifyResetToken(email, token)) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
      );
    }

    const user = await findUser(email);
    if (!user) {
      return addSecurityHeaders(
        NextResponse.json({ error: "User not found" }, { status: 404 })
      );
    }

    if (newPassword.length < 6) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 14);
    await updateUser(email, { password: hashedPassword });
    clearResetToken(email, token);

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
