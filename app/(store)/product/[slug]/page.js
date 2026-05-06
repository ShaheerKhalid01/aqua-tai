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
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
        <p style={{ fontSize: 18 }}>Product not found.</p>
        <Link href="/shop" style={{ color: "#0057a8" }}>← Back to Shop</Link>
      </div>
    );

  if (!product)
    return <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b" }}>Loading...</div>;

  const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 16px 20px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20, fontSize: 12, color: "#64748b", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#0057a8", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: "#0057a8", textDecoration: "none" }}>Shop</Link>
          <span>/</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 32 }} className="product-grid">
          {/* Images */}
          <div>
            <div style={{ background: "linear-gradient(135deg, #e8f4ff, #cce5ff)", borderRadius: 14, height: 300, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8f0fe", overflow: "hidden", position: "relative", marginBottom: 10 }} className="product-image">
              {product.images?.[activeImg]
                ? <img src={product.images[activeImg]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ fontSize: 100 }}>💧</div>}
              {product.badge && <span style={{ position: "absolute", top: 16, left: 16, background: "#f59e0b", color: "#fff", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{product.badge}</span>}
              {discount > 0 && <span style={{ position: "absolute", top: 16, right: 16, background: "#10b981", color: "#fff", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>-{discount}%</span>}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: `2px solid ${activeImg === i ? "#0057a8" : "#e8f0fe"}`, opacity: activeImg === i ? 1 : 0.6, flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ color: "#0057a8", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{product.category}</div>
            <h1 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 12, color: "#1a1a2e" }} className="product-title">{product.name}</h1>
            {product.rating > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ color: "#f59e0b" }}>{"★".repeat(Math.floor(product.rating))}</span>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>{product.rating} · {product.reviews} reviews</span>
              </div>
            )}
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>{product.description}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: "clamp(26px,5vw,36px)", fontWeight: 900, color: "#0057a8" }} className="product-price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: 18, color: "#94a3b8", textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", background: "#f7f9fc", border: "1px solid #e8f0fe", borderRadius: 10, overflow: "hidden" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 40, height: 40, background: "#fff", border: "1px solid #e8f0fe", color: "#1a1a2e", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>−</button>
                <span style={{ width: 40, textAlign: "center", color: "#1a1a2e", fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ width: 40, height: 40, background: "#fff", border: "1px solid #e8f0fe", color: "#1a1a2e", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0}
                style={{ flex: 1, background: added ? "#10b981" : "#0057a8", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.3s", minWidth: 160 }}>
                {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12, color: "#64748b" }}>
              <span style={{ color: product.stock === 0 ? "#ef4444" : "#10b981", fontWeight: 600 }}>{product.stock === 0 ? "❌ Out of Stock" : `✅ In Stock (${product.stock})`}</span>
              <span>🚚 Free Delivery</span>
              <span>🔧 Free Installation</span>
              <span>🔄 30-Day Returns</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {(product.features?.length > 0 || product.specifications) && (
          <>
            <div style={{ borderBottom: "1px solid #e8f0fe", marginBottom: 24, display: "flex", overflowX: "auto" }}>
              {["features", "specifications"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: "10px 20px", background: "none", border: "none", borderBottom: activeTab === tab ? "2px solid #0057a8" : "2px solid transparent", color: activeTab === tab ? "#0057a8" : "#64748b", fontWeight: activeTab === tab ? 700 : 400, fontSize: 14, cursor: "pointer", textTransform: "capitalize", marginBottom: -1, whiteSpace: "nowrap" }}>
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "features" && product.features?.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 48 }}>
                {product.features.map((f, i) => (
                  <div key={i} style={{ background: "#f5f8ff", border: "1px solid #e8f0fe", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#10b981" }}>✓</span>
                    <span style={{ color: "#1a1a2e", fontSize: 13 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "specifications" && product.specifications && (
              <div style={{ background: "#f7f9fc", border: "1px solid #e8f0fe", borderRadius: 14, padding: 20, marginBottom: 48 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px 20px" }} className="specs-grid">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e8f0fe" }}>
                      <span style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>{key}</span>
                      <span style={{ color: "#1a1a2e", fontSize: 13 }}>{val}</span>
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
            <h2 style={{ fontSize: "clamp(20px,3vw,24px)", fontWeight: 900, marginBottom: 16, color: "#1a1a2e" }}>Related Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="products-grid">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}