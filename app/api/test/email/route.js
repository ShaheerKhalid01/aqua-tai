import { NextResponse } from "next/server";
import { sendVerificationEmail, createEmailVerificationToken } from "@/lib/email-verification";

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    
    console.log("=== EMAIL TEST START ===");
    console.log("Email to:", email);
    console.log("Name:", name);
    
    // Check environment variables
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
    
    // Generate token
    const token = createEmailVerificationToken(email);
    console.log("Generated token:", token);
    
    // Send email
    console.log("Sending email...");
    const result = await sendVerificationEmail(email, token, name);
    console.log("Email result:", result);
    console.log("=== EMAIL TEST END ===");
    
    return NextResponse.json({
      success: result,
      message: result ? "Email sent successfully" : "Email failed to send",
      email: email,
      token: token
    });
    
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
