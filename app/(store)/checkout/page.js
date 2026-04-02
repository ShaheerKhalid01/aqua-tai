"use client";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, dispatch } = useCart();
  const { addOrder } = useOrders();
  const { state: authState } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize form with user data if available
  const [form, setForm] = useState({
    name: authState.clientUser?.name || "",
    email: authState.clientUser?.email || "",
    phone: "",
    address: "",
    city: "",
    payment: "cod"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!authState.clientUser) {
      alert("Please sign in to place an order.");
      return;
    }

    setLoading(true);
    try {
      const order = await addOrder({
        customer: form.name, email: form.email, phone: form.phone,
        address: form.address, city: form.city, payment: form.payment,
        total, items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
        userId: authState.clientUser?.id || null,
      });
      dispatch({ type: "CLEAR_CART" });
      setOrderId(order.orderId || order.id);
      setPlaced(true);
    } catch (err) {
      alert("Failed to place order: " + err.message);
    } finally { setLoading(false); }
  };

  if (placed) return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 16px" }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontSize: 36, fontWeight: 900, fontFamily: "Georgia, serif", color: "#00b4ff", marginBottom: 12 }}>Order Placed!</h2>
      <div style={{ background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 12, padding: "12px 28px", marginBottom: 16, display: "inline-block" }}>
        <span style={{ color: "#00b4ff", fontSize: 13 }}>Order ID: </span>
        <span style={{ color: "#00b4ff", fontWeight: 800, fontSize: 16 }}>{orderId}</span>
      </div>
      <p style={{ color: "#00b4ff", fontSize: 18, marginBottom: 8 }}>Thank you, {form.name}!</p>
      <p style={{ color: "#00b4ff", marginBottom: 32 }}>We'll contact you at {form.phone} to confirm delivery.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/orders" style={{ background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>📦 View My Orders</Link>
        <Link href="/" style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Continue Shopping</Link>
      </div>
    </div>
  );

  // Show authentication status
  if (!authState.clientUser) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #040d1a 0%, #0a2540 60%, #0d3060 100%)", padding: "40px 16px" }}>
        <div style={{ textAlign: "center", background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.18)", borderRadius: 20, padding: 40, maxWidth: 400 }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🔐</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#00b4ff", marginBottom: 12 }}>Sign In Required</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            Please sign in to your account to place orders and track your purchases.
          </p>
          <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
            <Link href="/login" style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", padding: "14px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center" }}>
              Sign In →
            </Link>
            <Link href="/register" style={{ background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", padding: "14px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center" }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", marginTop: 6 };
  const labelStyle = { color: "#00b4ff", fontSize: 13, display: "block", marginTop: 16 };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(135deg, #0a2540, #0d3060)", padding: "40px 0", borderBottom: "1px solid rgba(0,180,255,0.15)", marginBottom: 40 }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 style={{ fontSize: 40, fontWeight: 900, fontFamily: "Georgia, serif", color: "#00b4ff" }}>Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}>
            <div>
              <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 16, padding: 28, marginBottom: 24 }}>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: "#00b4ff", marginBottom: 4 }}>Delivery Information</h2>

                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} required placeholder="+92 300 0000000" />
                  </div>
                </div>

                {/* Address — plain text */}
                <label style={labelStyle}>Address *</label>
                <input style={inputStyle} name="address" value={form.address} onChange={handleChange} required placeholder="Street, area, landmark..." />

                {/* City — plain text */}
                <label style={labelStyle}>City *</label>
                <input style={inputStyle} name="city" value={form.city} onChange={handleChange} required placeholder="e.g. Rahim Yar Khan" />
              </div>

              <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 16, padding: 28 }}>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: "#00b4ff", marginBottom: 20 }}>Payment Method</h2>
                {[
                  ["cod", "💵", "Cash on Delivery", "Pay when your order arrives"],
                  ["bank", "🏦", "Bank Transfer", "Transfer to our account and share receipt"]
                ].map(([val, icon, title, desc]) => (
                  <label key={val} style={{ display: "flex", gap: 16, padding: "16px", background: form.payment === val ? "rgba(0,180,255,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${form.payment === val ? "rgba(0,180,255,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, cursor: "pointer", marginBottom: 12 }}>
                    <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={handleChange} style={{ marginTop: 4 }} />
                    <span style={{ fontSize: 24 }}>{icon}</span>
                    <div><div style={{ fontWeight: 700, marginBottom: 2, color: "#00b4ff" }}>{title}</div><div style={{ color: "#64748b", fontSize: 13 }}>{desc}</div></div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 16, padding: 28, position: "sticky", top: 90 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#00b4ff", marginBottom: 20 }}>Your Order</h2>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                    <span style={{ color: "#00b4ff" }}>{item.name} × {item.qty}</span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "20px 0 16px", paddingTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontSize: 14, marginBottom: 8 }}><span>Delivery</span><span>Free</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 900, color: "#00b4ff" }}><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", background: loading ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", border: "none", padding: "16px 0", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", marginTop: 8 }}>
                  {loading ? "Placing Order..." : "Place Order ✓"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}