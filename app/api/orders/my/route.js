import { NextResponse } from "next/server";
import { connectDB, getOrders } from "@/lib/mongodb";
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

    const userEmail = decoded.email.toLowerCase().trim();
    const allOrders = await getOrders();
    const orders = allOrders
      .filter(o => o.email && o.email.toLowerCase().trim() === userEmail)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const normalized = orders.map(o => ({ ...o, id: o.orderId }));
    return NextResponse.json({ orders: normalized });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}