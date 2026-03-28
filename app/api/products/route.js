import { NextResponse } from "next/server";
import { connectDB, getProducts, createProduct } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  try {
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "aquatai_fallback_secret");
    console.log("Verified admin token:", decoded);
    return decoded.role === "admin";
  } catch { 
    console.error("Error verifying admin token");
    return false; 
  }
}

// GET /api/products — public, get all active products
export async function GET() {
  try {
    console.log("=== PRODUCTS API DEBUG ===");
    await connectDB();
    console.log("Connected to database");
    const products = await getProducts();
    console.log("Products retrieved:", products.length);
    console.log("Products:", products);
    return NextResponse.json({ products });
  } catch (err) {
    console.error("Products API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/products — admin only, create product
export async function POST(req) {
  if (!verifyAdmin(req))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();

    // Debug logging
    console.log("API received body.stock:", body.stock, "Type:", typeof body.stock);

    // Auto-generate slug from name
    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const product = await createProduct({
      ...body,
      slug,
      price: Number(body.price),
      originalPrice: Number(body.originalPrice),
      stock: parseInt(body.stock, 10) || 0,
      active: true,
      rating: 0,
      reviews: 0,
    });

    // Debug logging
    console.log("Created product stock:", product.stock, "Type:", typeof product.stock);

    return NextResponse.json({ message: "Product created.", product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}