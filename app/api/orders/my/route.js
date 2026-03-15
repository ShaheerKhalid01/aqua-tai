import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "aquatai_fallback_secret";

// GET /api/orders/my — client fetches their own orders
export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer "))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    await connectDB();
    const db = mongoose.connection.db;

    const orders = await db.collection("orders")
      .find({ email: decoded.email })
      .sort({ createdAt: -1 })
      .toArray();

    const normalized = orders.map(o => ({ ...o, id: o.orderId }));
    return NextResponse.json({ orders: normalized });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}