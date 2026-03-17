"use client";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── Mapbox Address Autocomplete ──────────────────────────────
function AddressAutocomplete({ value, onChange, onCityChange, placeholder }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef(null);
  const debounceRef = useRef(null);
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = async (text) => {
    if (!text || text.length < 2 || !MAPBOX_TOKEN) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?` +
        `access_token=${MAPBOX_TOKEN}&country=PK&language=en&limit=6&types=place,locality,neighborhood,address,poi`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
      setOpen((data.features || []).length > 0);
    } catch { setSuggestions([]); }
    finally { setLoading(false); }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setHighlighted(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  };

  const handleSelect = (feature) => {
    const fullAddress = feature.place_name;
    setQuery(fullAddress);
    onChange(fullAddress);
    const city = feature.context?.find(c => c.id.startsWith("place") || c.id.startsWith("district"))?.text || feature.text || "";
    if (onCityChange && city) onCityChange(city);
    setSuggestions([]);
    setOpen(false);
    setHighlighted(-1);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && highlighted >= 0) { e.preventDefault(); handleSelect(suggestions[highlighted]); }
    if (e.key === "Escape") setOpen(false);
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${open ? "rgba(0,180,255,0.5)" : "rgba(0,180,255,0.2)"}`,
    borderRadius: open && suggestions.length > 0 ? "10px 10px 0 0" : 10,
    padding: "12px 40px 12px 42px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    marginTop: 6,
    transition: "border 0.2s",
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 14, top: "calc(50% + 3px)", transform: "translateY(-50%)", fontSize: 15, color: "#64748b", pointerEvents: "none" }}>📍</span>
      <input type="text" value={query} onChange={handleInput} onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        placeholder={placeholder || "Search address in Pakistan..."} style={inputStyle} autoComplete="off" />
      {loading && <span style={{ position: "absolute", right: 14, top: "calc(50% + 3px)", transform: "translateY(-50%)", color: "#64748b", fontSize: 12 }}>⏳</span>}
      {!loading && query && (
        <button onClick={() => { setQuery(""); onChange(""); setSuggestions([]); setOpen(false); }}
          style={{ position: "absolute", right: 14, top: "calc(50% + 3px)", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
      )}
      {open && suggestions.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0d2545", border: "1px solid rgba(0,180,255,0.3)", borderTop: "none", borderRadius: "0 0 10px 10px", zIndex: 100, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", overflow: "hidden" }}>
          {suggestions.map((f, i) => {
            const main = f.text || f.place_name.split(",")[0];
            const secondary = f.place_name.replace(main + ", ", "");
            return (
              <div key={f.id} onClick={() => handleSelect(f)}
                style={{ padding: "12px 16px", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "flex-start", gap: 10, background: highlighted === i ? "rgba(0,180,255,0.1)" : "transparent", borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.1s" }}
                onMouseEnter={() => setHighlighted(i)} onMouseLeave={() => setHighlighted(-1)}>
                <span style={{ color: "#00b4ff", fontSize: 14, flexShrink: 0, marginTop: 1 }}>📍</span>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{main}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{secondary}</div>
                </div>
              </div>
            );
          })}
          <div style={{ padding: "7px 16px", fontSize: 11, color: "#475569", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#475569"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Powered by Mapbox · Pakistan addresses
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, dispatch } = useCart();
  const { addOrder } = useOrders();
  const { state: authState } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", payment: "cod" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <h2 style={{ fontSize: 36, fontWeight: 900, fontFamily: "Georgia, serif", marginBottom: 12 }}>Order Placed!</h2>
      <div style={{ background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 12, padding: "12px 28px", marginBottom: 16, display: "inline-block" }}>
        <span style={{ color: "#64748b", fontSize: 13 }}>Order ID: </span>
        <span style={{ color: "#00b4ff", fontWeight: 800, fontSize: 16 }}>{orderId}</span>
      </div>
      <p style={{ color: "#94a3b8", fontSize: 18, marginBottom: 8 }}>Thank you, {form.name}!</p>
      <p style={{ color: "#64748b", marginBottom: 32 }}>We'll contact you at {form.phone} to confirm delivery.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/orders" style={{ background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>📦 View My Orders</Link>
        <Link href="/" style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Continue Shopping</Link>
      </div>
    </div>
  );

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", marginTop: 6 };
  const labelStyle = { color: "#94a3b8", fontSize: 13, display: "block", marginTop: 16 };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(135deg, #0a2540, #0d3060)", padding: "40px 0", borderBottom: "1px solid rgba(0,180,255,0.15)", marginBottom: 40 }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 style={{ fontSize: 40, fontWeight: 900, fontFamily: "Georgia, serif" }}>Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}>
            <div>
              <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 16, padding: 28, marginBottom: 24 }}>
                <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Delivery Information</h2>

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

                {/* Address — Mapbox search */}
                <label style={labelStyle}>Address *</label>
                <AddressAutocomplete
                  value={form.address}
                  onChange={(val) => setForm(f => ({ ...f, address: val }))}
                  onCityChange={(city) => setForm(f => ({ ...f, city }))}
                  placeholder="Search your street, area or city..."
                />
                <input type="text" name="address" value={form.address} onChange={() => {}} required style={{ opacity: 0, height: 0, position: "absolute", pointerEvents: "none" }} />

                {/* City — auto-filled or manual */}
                <label style={labelStyle}>City *</label>
                <input style={inputStyle} name="city" value={form.city}
                  onChange={handleChange} required placeholder="Auto-filled from address or type manually" />
              </div>

              <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 16, padding: 28 }}>
                <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Payment Method</h2>
                {[["cod", "💵", "Cash on Delivery", "Pay when your order arrives"], ["bank", "🏦", "Bank Transfer", "Transfer to our account and share receipt"]].map(([val, icon, title, desc]) => (
                  <label key={val} style={{ display: "flex", gap: 16, padding: "16px", background: form.payment === val ? "rgba(0,180,255,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${form.payment === val ? "rgba(0,180,255,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, cursor: "pointer", marginBottom: 12 }}>
                    <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={handleChange} style={{ marginTop: 4 }} />
                    <span style={{ fontSize: 24 }}>{icon}</span>
                    <div><div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div><div style={{ color: "#64748b", fontSize: 13 }}>{desc}</div></div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 16, padding: 28, position: "sticky", top: 90 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Your Order</h2>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                    <span style={{ color: "#94a3b8" }}>{item.name} × {item.qty}</span>
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