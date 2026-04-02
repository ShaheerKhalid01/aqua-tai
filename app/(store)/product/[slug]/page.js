"use client";
import { use, useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const { products, loadProducts } = useProducts();
  const { dispatch } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("features");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { if (products.length === 0) loadProducts(); }, []);

  const product = products.find(p => p.slug === slug);

  if (products.length > 0 && !product)
    return (
      <div style={{ padding: 80, textAlign: "center", color: "#64748b" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
        <p style={{ fontSize: 18 }}>Product not found.</p>
        <Link href="/shop" style={{ color: "#00b4ff" }}>← Back to Shop</Link>
      </div>
    );

  if (!product)
    return <div style={{ padding: 80, textAlign: "center", color: "#64748b" }}>Loading...</div>;

  const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);
  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      dispatch({ type: "ADD_ITEM", payload: { id: product._id, name: product.name, price: product.price, slug: product.slug, image: product.images?.[0] } });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32, fontSize: 13, color: "#64748b" }}>
          <Link href="/" style={{ color: "#00b4ff", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: "#00b4ff", textDecoration: "none" }}>Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 60 }}>
          {/* Images */}
          <div>
            <div style={{ background: "linear-gradient(135deg, #0a2540, #1a3a6c)", borderRadius: 20, height: 420, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,180,255,0.2)", overflow: "hidden", position: "relative", marginBottom: 12 }}>
              {product.images?.[activeImg]
                ? <img src={product.images[activeImg]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ fontSize: 120 }}>💧</div>}
              {product.badge && <span style={{ position: "absolute", top: 20, left: 20, background: "#f59e0b", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{product.badge}</span>}
              {discount > 0 && <span style={{ position: "absolute", top: 20, right: 20, background: "#10b981", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>-{discount}%</span>}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 70, height: 70, borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `2px solid ${activeImg === i ? "#00b4ff" : "transparent"}`, opacity: activeImg === i ? 1 : 0.6 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ color: "#00b4ff", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{product.category}</div>
            <h1 style={{ fontSize: 34, fontWeight: 900, fontFamily: "Georgia, serif", lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>
            {product.rating > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ color: "#f59e0b" }}>{"★".repeat(Math.floor(product.rating))}</span>
                <span style={{ color: "#94a3b8", fontSize: 14 }}>{product.rating} · {product.reviews} reviews</span>
              </div>
            )}
            <p style={{ color: "#94a3b8", lineHeight: 1.8, marginBottom: 24, fontSize: 15 }}>{product.description}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 28 }}>
              <span style={{ fontSize: 38, fontWeight: 900, color: "#00b4ff" }}>{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: 20, color: "#64748b", textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, overflow: "hidden" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 42, height: 42, background: "#1a1a2e", border: "1px solid #0d2545", color: "#fff", fontSize: 20, cursor: "pointer", fontWeight: 700 }}>−</button>
                <span style={{ width: 42, textAlign: "center", color: "#1a1a2e", fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ width: 42, height: 42, background: "#1a1a2e", border: "1px solid #0d2545", color: "#fff", fontSize: 20, cursor: "pointer", fontWeight: 700 }}>+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0}
                style={{ flex: 1, background: added ? "#10b981" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all 0.3s" }}>
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "#64748b" }}>
              <span style={{ color: product.stock === 0 ? "#ef4444" : "#10b981" }}>{product.stock === 0 ? "❌ Out of Stock" : `✅ In Stock (${product.stock})`}</span>
              <span>🚚 Free Delivery</span>
              <span>🔧 Free Installation</span>
              <span>🔄 30-Day Returns</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {(product.features?.length > 0 || product.specifications) && (
          <>
            <div style={{ borderBottom: "1px solid rgba(0,180,255,0.15)", marginBottom: 32, display: "flex" }}>
              {["features", "specifications"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: "12px 28px", background: "none", border: "none", borderBottom: activeTab === tab ? "2px solid #00b4ff" : "2px solid transparent", color: activeTab === tab ? "#00b4ff" : "#64748b", fontWeight: activeTab === tab ? 700 : 400, fontSize: 15, cursor: "pointer", textTransform: "capitalize", marginBottom: -1 }}>
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "features" && product.features?.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 60 }}>
                {product.features.map((f, i) => (
                  <div key={i} style={{ background: "rgba(0,180,255,0.05)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "#10b981" }}>✓</span>
                    <span style={{ color: "#1a1a2e", fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "specifications" && product.specifications && (
              <div style={{ background: "rgba(0,180,255,0.03)", border: "1px solid rgba(0,180,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 60 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 40px" }}>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(0,180,255,0.05)" }}>
                      <span style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>{key}</span>
                      <span style={{ color: "#1a1a2e", fontSize: 14 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, fontFamily: "Georgia, serif", marginBottom: 24 }}>Related Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}