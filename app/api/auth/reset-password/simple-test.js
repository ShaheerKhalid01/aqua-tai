import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    return NextResponse.json({ message: "Test route working" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
