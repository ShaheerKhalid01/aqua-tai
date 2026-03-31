import { NextResponse } from "next/server";
import { verifyResetToken, clearResetToken } from "@/lib/email";
import { addSecurityHeaders } from "@/lib/security";
import { findUser, updateUser } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, token, newPassword } = await req.json();
    
    console.log('=== PASSWORD RESET API ===');
    console.log('Email:', email);
    console.log('Token:', token);
    console.log('New password length:', newPassword?.length || 0);
    
    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Verify reset token
    if (!verifyResetToken(email, token)) {
      console.log('❌ Token verification failed');
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    // Find user
    const user = await findUser(email);
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate new password
    if (newPassword.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 14);
    console.log('✅ Password hashed successfully');

    // Update user password
    await updateUser(email, { password: hashedPassword });
    console.log('✅ User password updated in database');

    // Clear reset token
    clearResetToken(email, token);
    console.log('✅ Reset token cleared');

    return NextResponse.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("❌ Password reset error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
