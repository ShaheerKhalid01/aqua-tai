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
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: "clamp(26px,5vw,36px)", fontWeight: 900, color: "#0057a8", marginBottom: 10 }}>Order Placed!</h2>
      <div style={{ background: "#f5f8ff", border: "1px solid #e8f0fe", borderRadius: 12, padding: "10px 24px", marginBottom: 14, display: "inline-block" }}>
        <span style={{ color: "#64748b", fontSize: 13 }}>Order ID: </span>
        <span style={{ color: "#0057a8", fontWeight: 800, fontSize: 16 }}>{orderId}</span>
      </div>
      <p style={{ color: "#1a1a2e", fontSize: 16, marginBottom: 6 }}>Thank you, {form.name}!</p>
      <p style={{ color: "#64748b", marginBottom: 28, fontSize: 14 }}>We'll contact you at {form.phone} to confirm delivery.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/orders" style={{ background: "#f5f8ff", border: "1px solid #e8f0fe", color: "#0057a8", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>📦 View My Orders</Link>
        <Link href="/" style={{ background: "#0057a8", color: "#fff", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Continue Shopping</Link>
      </div>
    </div>
  );

  // Show authentication status
  if (!authState.clientUser) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f9fc", padding: "40px 16px" }}>
        <div style={{ textAlign: "center", background: "#fff", border: "1px solid #e8f0fe", borderRadius: 20, padding: "36px 28px", maxWidth: 400, width: "100%" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0057a8", marginBottom: 10 }}>Sign In Required</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            Please sign in to your account to place orders and track your purchases.
          </p>
          <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
            <Link href="/login" style={{ background: "#0057a8", color: "#fff", padding: "13px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center" }}>
              Sign In →
            </Link>
            <Link href="/register" style={{ background: "#f5f8ff", border: "1px solid #e8f0fe", color: "#0057a8", padding: "13px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center" }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = { width: "100%", background: "#fff", border: "1px solid #e8f0fe", borderRadius: 10, padding: "12px 16px", color: "#1a1a2e", fontSize: 14, outline: "none", marginTop: 6 };
  const labelStyle = { color: "#0057a8", fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(135deg, #003d7a, #0057a8)", padding: "28px 0", borderBottom: "1px solid #e8f0fe", marginBottom: 20 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 900, color: "#fff" }}>Checkout</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="checkout-layout">
            <div>
              <div style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 14, padding: 20, marginBottom: 16 }}>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e", marginBottom: 4 }}>Delivery Information</h2>

                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }} className="form-row">
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

              <div style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 14, padding: 20 }}>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e", marginBottom: 16 }}>Payment Method</h2>
                {[
                  ["cod", "💵", "Cash on Delivery", "Pay when your order arrives"],
                  ["bank", "🏦", "Bank Transfer", "Transfer to our account and share receipt"]
                ].map(([val, icon, title, desc]) => (
                  <label key={val} style={{ display: "flex", gap: 14, padding: "14px", background: form.payment === val ? "#f5f8ff" : "#fafafa", border: `1px solid ${form.payment === val ? "#0057a8" : "#e8f0fe"}`, borderRadius: 10, cursor: "pointer", marginBottom: 10 }}>
                    <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={handleChange} style={{ marginTop: 4, accentColor: "#0057a8" }} />
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div><div style={{ fontWeight: 700, marginBottom: 2, color: "#1a1a2e" }}>{title}</div><div style={{ color: "#64748b", fontSize: 13 }}>{desc}</div></div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 14, padding: 20 }} className="checkout-summary">
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>Your Order</h2>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>{item.name} × {item.qty}</span>
                    <span style={{ color: "#1a1a2e", fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #e8f0fe", margin: "16px 0 12px", paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontSize: 14, marginBottom: 6 }}><span>Delivery</span><span>Free</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 900, color: "#0057a8" }}><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", background: loading ? "#94a3b8" : "#0057a8", color: "#fff", border: "none", padding: "14px 0", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 8 }}>
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