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
    dispatch({ type: "ADD_ITEM", payload: { id: product._id || product.id, name: product.name, price: product.price, slug: product.slug, image: product.images?.[0] } });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const badgeColors = { "Best Seller": "#f59e0b", Popular: "#8b5cf6", Premium: "#0057a8", New: "#10b981", "Top Rated": "#ef4444" };

  return (
    <div onClick={() => router.push(`/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "#fff", border: `2px solid ${hovered ? "#0057a8" : "#e8f0fe"}`, borderRadius: 14, overflow: "hidden", transition: "all 0.3s", cursor: "pointer", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? "0 12px 32px rgba(0,87,168,0.15)" : "0 2px 12px rgba(0,0,0,0.04)" }}>

      {/* Image */}
      <div style={{ background: "linear-gradient(135deg, #e8f4ff, #cce5ff)", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ fontSize: 56 }}>💧</div>}
        {product.badge && (
          <span style={{ position: "absolute", top: 8, left: 8, background: badgeColors[product.badge] || "#0057a8", color: "#fff", padding: "2px 8px", borderRadius: 16, fontSize: 10, fontWeight: 700 }}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span style={{ position: "absolute", top: 8, right: 8, background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: 16, fontSize: 10, fontWeight: 700 }}>
            -{discount}%
          </span>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ color: "#0057a8", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{product.category}</div>
        <div style={{ color: "#1a1a2e", fontWeight: 700, fontSize: 13, marginBottom: 6, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{product.name}</div>

        {product.rating > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <span style={{ color: "#f59e0b", fontSize: 11 }}>{"★".repeat(Math.floor(product.rating))}</span>
            <span style={{ color: "#94a3b8", fontSize: 11 }}>({product.reviews})</span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ color: "#0057a8", fontWeight: 900, fontSize: 17 }}>{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span style={{ color: "#94a3b8", fontSize: 12, textDecoration: "line-through" }}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div style={{ fontSize: 10, color: product.stock === 0 ? "#ef4444" : product.stock < 10 ? "#f59e0b" : "#10b981", marginBottom: 10, fontWeight: 600 }}>
          {product.stock === 0 ? "❌ Out of Stock" : product.stock < 10 ? `⚠ Only ${product.stock} left` : "✓ In Stock"}
        </div>

        <button onClick={handleAdd} disabled={product.stock === 0}
          style={{ width: "100%", background: added ? "#10b981" : product.stock === 0 ? "#f1f5f9" : "#0057a8", color: product.stock === 0 ? "#94a3b8" : "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: product.stock === 0 ? "not-allowed" : "pointer", transition: "all 0.3s" }}>
          {added ? "✓ Added!" : product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}