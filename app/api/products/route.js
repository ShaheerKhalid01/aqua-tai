import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  try {
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "aquatai_fallback_secret");
    return decoded.role === "admin";
  } catch { return false; }
}

// GET /api/products — public, get all active products
export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const products = await db.collection("products")
      .find({ active: true })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/products — admin only, create product
export async function POST(req) {
  if (!verifyAdmin(req))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const body = await req.json();

    // Auto-generate slug from name
    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    // Check slug uniqueness
    const existing = await db.collection("products").findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = {
      ...body,
      slug: finalSlug,
      price: Number(body.price),
      originalPrice: Number(body.originalPrice),
      stock: Number(body.stock),
      active: true,
      rating: 0,
      reviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(product);
    return NextResponse.json({ message: "Product created.", product: { ...product, _id: result.insertedId } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}