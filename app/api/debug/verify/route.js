import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email-verification";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    console.log("=== VERIFICATION DEBUG ===");
    console.log("Email:", email);
    console.log("Token:", token);
    
    // Check if token exists
    const isValidToken = verifyEmailToken(email, token);
    console.log("Token valid:", isValidToken);
    
    return NextResponse.json({
      email,
      token,
      isValidToken,
      message: isValidToken ? "Token is valid" : "Token is invalid"
    });
    
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
