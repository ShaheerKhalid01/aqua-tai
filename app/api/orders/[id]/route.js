import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

function verifyToken(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(auth.slice(7), process.env.JWT_SECRET);
  } catch { return null; }
}

// PATCH /api/orders/:id — update order status (admin only)
export async function PATCH(req, { params }) {
  const decoded = verifyToken(req);
  if (!decoded || decoded.role !== "admin")
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { status } = await req.json();
    const { id } = await params;

    const result = await db.collection("orders").findOneAndUpdate(
      { orderId: id },
      { $set: { status } },
      { returnDocument: "after" }
    );

    if (!result)
      return NextResponse.json({ error: "Order not found." }, { status: 404 });

    return NextResponse.json({ message: "Status updated.", order: result });
  } catch (err) {
    console.error("Update order error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}