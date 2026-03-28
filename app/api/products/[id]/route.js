import { NextResponse } from "next/server";
import { connectDB, getProducts, updateProduct, deleteProduct } from "@/lib/mongodb";
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
    const products = await getProducts();
    const { id } = await params;

    const product = products.find(p => p._id === id || p.slug === id);

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
    const { id } = await params;
    const body = await req.json();

    // Debug: Show all available products and their IDs
    const allProducts = await getProducts();
    console.log("Available product IDs:", allProducts.map(p => ({ _id: p._id, name: p.name, stock: p.stock })));
    console.log("Trying to update product with ID:", id);
    console.log("API received body.stock:", body.stock, "Type:", typeof body.stock);
    console.log("API parsed parseInt(body.stock, 10):", parseInt(body.stock, 10));

    const update = {
      ...body,
      price: Number(body.price),
      originalPrice: Number(body.originalPrice),
      stock: parseInt(body.stock, 10) || 0,
    };

    console.log("Final update object stock:", update.stock);

    const product = await updateProduct(id, update);

    if (!product)
      return NextResponse.json({ error: "Product not found." }, { status: 404 });

    return NextResponse.json({ message: "Product updated.", product });
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
    const { id } = await params;

    const success = await deleteProduct(id);

    if (!success)
      return NextResponse.json({ error: "Product not found." }, { status: 404 });

    return NextResponse.json({ message: "Product deleted." });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}