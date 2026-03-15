"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "ADD_ITEM",
      payload: { id: product._id || product.id, name: product.name, price: product.price, slug: product.slug, image: product.images?.[0] },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleCardClick = () => router.push(`/product/${product.slug}`);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const badgeColors = { "Best Seller": "#f59e0b", Popular: "#8b5cf6", Premium: "#06b6d4", New: "#10b981", "Top Rated": "#ef4444" };

  return (
    <div onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: `1px solid ${hovered ? "rgba(0,180,255,0.45)" : "rgba(0,180,255,0.15)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.3s", cursor: "pointer", transform: hovered ? "translateY(-5px)" : "translateY(0)", boxShadow: hovered ? "0 20px 40px rgba(0,180,255,0.12)" : "none" }}>

      {/* Image */}
      <div style={{ background: "linear-gradient(135deg, #0a2540, #1a3a6c)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ fontSize: 72 }}>💧</div>}
        {product.badge && (
          <span style={{ position: "absolute", top: 12, left: 12, background: badgeColors[product.badge] || "#00b4ff", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(16,185,129,0.9)", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            -{discount}%
          </span>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: 20 }}>
        <div style={{ color: "#00b4ff", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{product.category}</div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "Georgia, serif", marginBottom: 8, lineHeight: 1.3 }}>{product.name}</div>

        {product.rating > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ color: "#f59e0b", fontSize: 13 }}>{"★".repeat(Math.floor(product.rating))}</span>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>{product.rating} ({product.reviews})</span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ color: "#00b4ff", fontWeight: 800, fontSize: 20 }}>{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span style={{ color: "#64748b", fontSize: 14, textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div style={{ fontSize: 11, color: product.stock < 10 ? "#ef4444" : product.stock < 20 ? "#f59e0b" : "#10b981", marginBottom: 12, fontWeight: 600 }}>
          {product.stock === 0 ? "❌ Out of Stock" : product.stock < 10 ? `⚠ Only ${product.stock} left` : `✓ In Stock`}
        </div>

        <button onClick={handleAdd} disabled={product.stock === 0}
          style={{ width: "100%", background: added ? "#10b981" : product.stock === 0 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: product.stock === 0 ? "#64748b" : "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: product.stock === 0 ? "not-allowed" : "pointer", transition: "background 0.3s" }}>
          {added ? "✓ Added to Cart!" : product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </button>

        <Link href={`/product/${product.slug}`} onClick={e => e.stopPropagation()}
          style={{ display: "block", textAlign: "center", marginTop: 10, color: "#64748b", fontSize: 12, textDecoration: "none" }}
          onMouseEnter={e => e.target.style.color = "#00b4ff"}
          onMouseLeave={e => e.target.style.color = "#64748b"}>
          View Details →
        </Link>
      </div>
    </div>
  );
}