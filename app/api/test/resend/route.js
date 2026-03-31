import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    return NextResponse.json({
      message: "Resend verification test endpoint",
      email: email,
      success: true
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
