"use client";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

function CartContent() {
  const { items, total, dispatch } = useCart();

  if (items.length === 0) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 700, marginBottom: 10, color: "#1a1a2e" }}>Your cart is empty</h2>
      <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>Add some products to get started.</p>
      <Link href="/shop" style={{ background: "#0057a8", color: "#fff", padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Browse Products</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(135deg, #003d7a, #0057a8)", padding: "28px 0", borderBottom: "1px solid #e8f0fe", marginBottom: 20 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#fff" }}>Shopping Cart</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, fontSize: 14 }}>{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="cart-layout">
          {/* Items */}
          <div>
            {items.map((item) => (
              <div key={item.id} style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }} className="cart-item">
                <div style={{ width: 72, height: 72, background: "linear-gradient(135deg, #e8f4ff, #cce5ff)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0, overflow: "hidden" }}>
                  {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "💧"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 4, color: "#1a1a2e", fontSize: 14 }}>{item.name}</h3>
                  <p style={{ color: "#0057a8", fontWeight: 700, fontSize: 16 }}>{formatPrice(item.price)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#f7f9fc", border: "1px solid #e8f0fe", borderRadius: 8, overflow: "hidden" }}>
                  <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty - 1 } })} style={{ width: 34, height: 34, background: "#fff", border: "1px solid #e8f0fe", color: "#1a1a2e", fontSize: 16, cursor: "pointer", fontWeight: 700 }}>−</button>
                  <span style={{ width: 34, textAlign: "center", color: "#1a1a2e", fontWeight: 700, fontSize: 14 }}>{item.qty}</span>
                  <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty + 1 } })} style={{ width: 34, height: 34, background: "#fff", border: "1px solid #e8f0fe", color: "#1a1a2e", fontSize: 16, cursor: "pointer", fontWeight: 700 }}>+</button>
                </div>
                <div style={{ textAlign: "right", minWidth: 80 }}>
                  <p style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: 6, fontSize: 14 }}>{formatPrice(item.price * item.qty)}</p>
                  <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 14, padding: 20 }} className="cart-summary">
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Order Summary</h2>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>{item.name} × {item.qty}</span>
                  <span style={{ color: "#1a1a2e", fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e8f0fe", margin: "16px 0", paddingTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748b" }}>
                  <span>Subtotal</span><span>{formatPrice(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#10b981" }}>
                  <span>Delivery</span><span>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 900, color: "#0057a8", marginTop: 12 }}>
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" style={{ display: "block", background: "#0057a8", color: "#fff", padding: "14px 0", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center", marginTop: 8 }}>
                Proceed to Checkout →
              </Link>
              <button onClick={() => dispatch({ type: "CLEAR_CART" })} style={{ width: "100%", marginTop: 10, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", padding: "10px 0", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 40 }}>⏳</div></div>}>
      <CartContent />
    </Suspense>
  );
}