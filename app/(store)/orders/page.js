"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchMyOrders, cancelOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusColors = {
  Pending: { bg: "rgba(239,68,68,0.08)", color: "#ef4444" },
  Processing: { bg: "rgba(245,158,11,0.08)", color: "#f59e0b" },
  Shipped: { bg: "rgba(59,130,246,0.08)", color: "#3b82f6" },
  Delivered: { bg: "rgba(16,185,129,0.08)", color: "#10b981" },
  Cancelled: { bg: "rgba(100,116,139,0.08)", color: "#64748b" },
};

const canCancel = (status) => ["Pending", "Processing"].includes(status);

export default function MyOrdersPage() {
  const { state } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [mounted, setMounted] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // 1. Fetch from API
      const data = await fetchMyOrders();
      const apiOrders = data.orders || [];

      // 2. Fetch from localStorage (fallback/local orders)
      let localOrders = [];
      try {
        const saved = localStorage.getItem("aquatai_orders");
        if (saved) {
          const parsed = JSON.parse(saved);
          localOrders = parsed.filter(o =>
            o.email?.toLowerCase().trim() === state.clientUser?.email?.toLowerCase().trim()
          );
        }
      } catch (e) {
        console.error("Local orders load error:", e);
      }

      // 3. Merge avoiding duplicates (prefer API data)
      const merged = [...apiOrders];
      localOrders.forEach(lo => {
        if (!merged.some(ao => ao.orderId === lo.orderId || ao.id === lo.orderId)) {
          merged.push(lo);
        }
      });

      // 4. Sort by date
      merged.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

      setOrders(merged);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (!state.clientUser) {
      const stored = localStorage.getItem("aquatai_user");
      if (!stored) {
        router.push("/login");
      }
      return;
    }
    loadOrders();
  }, [state.clientUser]);

  if (!mounted) return null;

  const handleCancel = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(orderId);
    try {
      await cancelOrder(orderId);
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: "Cancelled" } : o));
    } catch (err) {
      alert("Could not cancel: " + err.message);
    } finally { setCancelling(null); }
  };

  if (!state.clientUser) return null;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #003d7a, #0057a8)", padding: "32px 0 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Account</div>
          <h1 style={{ fontSize: "clamp(26px,5vw,38px)", fontWeight: 900, color: "#fff", marginBottom: 6 }}>My Orders</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Welcome, {state.clientUser.name}</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <p>Loading your orders...</p>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 14 }}>
            ⚠ {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>📦</div>
            <p style={{ fontSize: 17, marginBottom: 6 }}>No orders yet.</p>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Start shopping to see your orders here.</p>
            <Link href="/shop" style={{ background: "#0057a8", color: "#fff", padding: "12px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              Browse Products
            </Link>
          </div>
        )}

        {orders.map(order => {
          const sc = statusColors[order.status] || statusColors.Pending;
          const expanded = expandedOrder === order.orderId;

          return (
            <div key={order.orderId} style={{ background: "#fff", border: "1px solid #e8f0fe", borderRadius: 14, marginBottom: 12, overflow: "hidden" }}>
              {/* Order Header */}
              <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "#0057a8", fontWeight: 700, fontSize: 14 }}>{order.orderId}</div>
                    <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>📅 {order.date}</div>
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {order.status}
                  </span>
                  <div style={{ color: "#0057a8", fontWeight: 800, fontSize: 16 }}>{formatPrice(order.total)}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setExpandedOrder(expanded ? null : order.orderId)}
                    style={{ background: "#f5f8ff", border: "1px solid #e8f0fe", color: "#0057a8", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    {expanded ? "Hide" : "Details"}
                  </button>

                  {canCancel(order.status) && (
                    <button onClick={() => handleCancel(order.orderId)} disabled={cancelling === order.orderId}
                      style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", padding: "6px 14px", borderRadius: 8, cursor: cancelling === order.orderId ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600, opacity: cancelling === order.orderId ? 0.6 : 1 }}>
                      {cancelling === order.orderId ? "..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>

              {/* Cancellation note */}
              {order.status === "Cancelled" && (
                <div style={{ margin: "0 16px 12px", background: "rgba(100,116,139,0.05)", border: "1px solid rgba(100,116,139,0.1)", borderRadius: 8, padding: "8px 12px", color: "#64748b", fontSize: 12 }}>
                  🚫 This order has been cancelled.
                </div>
              )}

              {!canCancel(order.status) && order.status !== "Cancelled" && order.status !== "Delivered" && (
                <div style={{ margin: "0 16px 12px", background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 8, padding: "8px 12px", color: "#3b82f6", fontSize: 12 }}>
                  ℹ Order is already {order.status.toLowerCase()} — cancellation is no longer possible.
                </div>
              )}

              {/* Expanded Details */}
              {expanded && (
                <div style={{ borderTop: "1px solid #e8f0fe", padding: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                    <div>
                      <div style={{ color: "#0057a8", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Delivery Info</div>
                      {[["📍 Address", order.address], ["🏙 City", order.city], ["📞 Phone", order.phone], ["💳 Payment", order.payment === "cod" ? "Cash on Delivery" : "Bank Transfer"]].map(([label, val]) => (
                        val && <div key={label} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13 }}>
                          <span style={{ color: "#64748b", minWidth: 80 }}>{label}</span>
                          <span style={{ color: "#1a1a2e" }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ color: "#0057a8", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Order Items</div>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                          <span style={{ color: "#1a1a2e" }}>{item.name} <span style={{ color: "#94a3b8" }}>× {item.qty}</span></span>
                          <span style={{ color: "#0057a8", fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontWeight: 800, color: "#0057a8", fontSize: 15 }}>
                        <span>Total</span><span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}