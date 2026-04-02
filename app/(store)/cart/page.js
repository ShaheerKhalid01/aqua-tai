"use client";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

function CartContent() {
  const { items, total, dispatch } = useCart();

  if (items.length === 0) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Your cart is empty</h2>
      <p style={{ color: "#64748b", marginBottom: 28 }}>Add some products to get started.</p>
      <Link href="/shop" style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Browse Products</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(135deg, #0a2540, #0d3060)", padding: "40px 0", borderBottom: "1px solid rgba(0,180,255,0.15)", marginBottom: 40 }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 style={{ fontSize: 40, fontWeight: 900, fontFamily: "Georgia, serif", color: "#00b4ff" }}>Shopping Cart</h1>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
          {/* Items */}
          <div>
            {items.map((item) => (
              <div key={item.id} style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 16, padding: 24, marginBottom: 16, display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, #0a2540, #1a3a6c)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>💧</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 6, color: "#00b4ff" }}>{item.name}</h3>
                  <p style={{ color: "#00b4ff", fontWeight: 700, fontSize: 18 }}>{formatPrice(item.price)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 0, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, overflow: "hidden" }}>
                  <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty - 1 } })} style={{ width: 38, height: 38, background: "#1a1a2e", border: "1px solid #0d2545", color: "#fff", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>−</button>
                  <span style={{ width: 38, textAlign: "center", color: "#fff", fontWeight: 700 }}>{item.qty}</span>
                  <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty + 1 } })} style={{ width: 38, height: 38, background: "#1a1a2e", border: "1px solid #0d2545", color: "#fff", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>+</button>
                </div>
                <div style={{ textAlign: "right", minWidth: 90 }}>
                  <p style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>{formatPrice(item.price * item.qty)}</p>
                  <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 16, padding: 28, position: "sticky", top: 90 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#00b4ff", marginBottom: 24 }}>Order Summary</h2>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: "#00b4ff" }}>{item.name} × {item.qty}</span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "20px 0", paddingTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: "#94a3b8" }}>
                  <span>Subtotal</span><span>{formatPrice(total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, color: "#10b981" }}>
                  <span>Delivery</span><span>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 900, color: "#00b4ff", marginTop: 16 }}>
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" style={{ display: "block", background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", padding: "16px 0", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16, textAlign: "center", marginTop: 8 }}>
                Proceed to Checkout →
              </Link>
              <button onClick={() => dispatch({ type: "CLEAR_CART" })} style={{ width: "100%", marginTop: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "10px 0", borderRadius: 10, cursor: "pointer", fontSize: 14 }}>
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