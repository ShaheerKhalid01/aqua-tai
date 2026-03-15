import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "aquatai_fallback_secret";

function verifyToken(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try { return jwt.verify(auth.slice(7), JWT_SECRET); }
  catch { return null; }
}

// PATCH /api/orders/:id — update status
// Admin: can set any status
// Client: can only set "Cancelled" on their own Pending/Processing orders
export async function PATCH(req, { params }) {
  const decoded = verifyToken(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { status } = await req.json();
    const { id } = await params;

    const order = await db.collection("orders").findOne({ orderId: id });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    // Client cancellation rules
    if (decoded.role !== "admin") {
      // Client can only cancel their own orders
      if (order.email !== decoded.email)
        return NextResponse.json({ error: "You can only cancel your own orders." }, { status: 403 });

      // Client can only cancel Pending or Processing orders
      if (!["Pending", "Processing"].includes(order.status))
        return NextResponse.json({ error: `Cannot cancel an order that is already "${order.status}".` }, { status: 400 });

      // Client can only set status to Cancelled
      if (status !== "Cancelled")
        return NextResponse.json({ error: "Clients can only cancel orders." }, { status: 403 });
    }

    const result = await db.collection("orders").findOneAndUpdate(
      { orderId: id },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return NextResponse.json({ message: "Order updated.", order: result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/orders/:id — get single order (client by email or admin)
export async function GET(req, { params }) {
  const decoded = verifyToken(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { id } = await params;
    const order = await db.collection("orders").findOne({ orderId: id });

    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    // Client can only see their own order
    if (decoded.role !== "admin" && order.email !== decoded.email)
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });

    return NextResponse.json({ order: { ...order, id: order.orderId } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}