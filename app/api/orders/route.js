import { NextResponse } from "next/server";
import { connectDB, getOrders, createOrder, updateOrder, deleteOrder } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

function verifyToken(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(auth.slice(7), process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// GET /api/orders — admin only
export async function GET(req) {
  const decoded = verifyToken(req);
  if (!decoded || decoded.role !== "admin")
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    await connectDB();
    const orders = await getOrders();
    // Normalize — add id field
    const normalized = orders.map((o) => ({ ...o, id: o.orderId }));
    return NextResponse.json({ orders: normalized });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// POST /api/orders — place a new order (client)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { customer, email, phone, address, city, payment, total, items, userId } = body;

    if (!customer || !email || !total || !items?.length)
      return NextResponse.json({ error: "Missing required order fields." }, { status: 400 });

    const orderId = "ORD-" + String(Date.now()).slice(-6);
    const today = new Date().toISOString().slice(0, 10);

    const order = await createOrder({
      orderId,
      customer,
      email,
      phone: phone || "",
      address: address || "",
      city: city || "",
      payment: payment || "cod",
      total,
      items,
      status: "Pending",
      date: today,
      userId: userId || null,
    });

    console.log("Order saved:", orderId);
    return NextResponse.json({ message: "Order placed successfully.", order: { ...order, id: orderId } }, { status: 201 });

  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}

// DELETE /api/orders — admin only
export async function DELETE(req) {
  console.log('=== DELETE ORDER API CALLED ===');
  
  const decoded = verifyToken(req);
  if (!decoded || decoded.role !== "admin") {
    console.log('❌ Unauthorized access attempt');
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');
    
    console.log('Order ID to delete:', orderId);
    
    if (!orderId) {
      console.log('❌ No order ID provided');
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const deletedOrder = await deleteOrder(orderId);
    if (!deletedOrder) {
      console.log('❌ Order not found:', orderId);
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    console.log('✅ Order deleted successfully:', orderId);
    return NextResponse.json({ message: "Order deleted successfully.", order: deletedOrder });

  } catch (err) {
    console.error('❌ Delete order error:', err);
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}