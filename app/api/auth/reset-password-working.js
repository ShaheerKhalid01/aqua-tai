import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log('=== SIMPLE PASSWORD RESET TEST ===');
    console.log('Request body received');
    
    return NextResponse.json({ 
      message: "Password reset endpoint is working",
      received: true
    });
  } catch (error) {
    console.error("Simple test error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
