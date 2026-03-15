import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  try {
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "aquatai_fallback_secret");
    return decoded.role === "admin";
  } catch { return false; }
}

// GET /api/products/:id — get single product by id or slug
export async function GET(req, { params }) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { id } = await params;

    let product;
    // Try ObjectId first, then slug
    try {
      product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    } catch {
      product = await db.collection("products").findOne({ slug: id });
    }

    if (!product)
      return NextResponse.json({ error: "Product not found." }, { status: 404 });

    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/products/:id — admin update product
export async function PUT(req, { params }) {
  if (!verifyAdmin(req))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { id } = await params;
    const body = await req.json();

    const update = {
      ...body,
      price: Number(body.price),
      originalPrice: Number(body.originalPrice),
      stock: Number(body.stock),
      updatedAt: new Date(),
    };
    delete update._id;

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result)
      return NextResponse.json({ error: "Product not found." }, { status: 404 });

    return NextResponse.json({ message: "Product updated.", product: result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/products/:id — admin soft delete
export async function DELETE(req, { params }) {
  if (!verifyAdmin(req))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { id } = await params;

    await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { active: false, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Product deleted." });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}