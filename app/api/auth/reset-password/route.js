import { NextResponse } from "next/server";
import { findUser, updateUser } from "@/lib/mongodb";
import { verifyResetToken, clearResetToken } from "@/lib/email";
import { addSecurityHeaders } from "@/lib/security";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, token, newPassword } = await req.json();
    
    if (!email || !token || !newPassword) {
      return addSecurityHeaders(
        NextResponse.json({ error: "All fields are required" }, { status: 400 })
      );
    }

    // Verify reset token
    if (!verifyResetToken(email, token)) {
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
    clearResetToken(email);

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
