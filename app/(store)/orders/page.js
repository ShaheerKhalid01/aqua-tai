"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchMyOrders, cancelOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusColors = {
  Pending: { bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
  Processing: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  Shipped: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" },
  Delivered: { bg: "rgba(16,185,129,0.12)", color: "#10b981" },
  Cancelled: { bg: "rgba(100,116,139,0.12)", color: "#64748b" },
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
  }, [state.clientUser, router]);

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
      <div style={{ background: "linear-gradient(135deg, #0a2540, #0d3060)", padding: "50px 0 36px", borderBottom: "1px solid rgba(0,180,255,0.15)" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div style={{ color: "#00b4ff", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Account</div>
          <h1 style={{ fontSize: 38, fontWeight: 900, fontFamily: "Georgia, serif", color: "#00b4ff", marginBottom: 8 }}>My Orders</h1>
          <p style={{ color: "#94a3b8" }}>Welcome, {state.clientUser.name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <p>Loading your orders...</p>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "14px 18px", borderRadius: 10, marginBottom: 20 }}>
            ⚠ {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
            <p style={{ fontSize: 18, marginBottom: 8 }}>No orders yet.</p>
            <p style={{ fontSize: 14, marginBottom: 28 }}>Start shopping to see your orders here.</p>
            <Link href="/shop" style={{ background: "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
              Browse Products
            </Link>
          </div>
        )}

        {orders.map(order => {
          const sc = statusColors[order.status] || statusColors.Pending;
          const expanded = expandedOrder === order.orderId;

          return (
            <div key={order.orderId} style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 16, marginBottom: 16, overflow: "hidden" }}>
              {/* Order Header */}
              <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "#00b4ff", fontWeight: 700, fontSize: 15 }}>{order.orderId}</div>
                    <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>📅 {order.date}</div>
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                    {order.status}
                  </span>
                  <div style={{ color: "#00b4ff", fontWeight: 800, fontSize: 18 }}>{formatPrice(order.total)}</div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button onClick={() => setExpandedOrder(expanded ? null : order.orderId)}
                    style={{ background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", color: "#00b4ff", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    {expanded ? "Hide Details" : "View Details"}
                  </button>

                  {canCancel(order.status) && (
                    <button onClick={() => handleCancel(order.orderId)} disabled={cancelling === order.orderId}
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", padding: "7px 16px", borderRadius: 8, cursor: cancelling === order.orderId ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, opacity: cancelling === order.orderId ? 0.6 : 1 }}>
                      {cancelling === order.orderId ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>

              {/* Cancellation note */}
              {order.status === "Cancelled" && (
                <div style={{ margin: "0 24px 16px", background: "rgba(100,116,139,0.08)", border: "1px solid rgba(100,116,139,0.2)", borderRadius: 8, padding: "10px 14px", color: "#64748b", fontSize: 13 }}>
                  🚫 This order has been cancelled.
                </div>
              )}

              {!canCancel(order.status) && order.status !== "Cancelled" && order.status !== "Delivered" && (
                <div style={{ margin: "0 24px 16px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, padding: "10px 14px", color: "#3b82f6", fontSize: 13 }}>
                  ℹ Order is already {order.status.toLowerCase()} — cancellation is no longer possible.
                </div>
              )}

              {/* Expanded Details */}
              {expanded && (
                <div style={{ borderTop: "1px solid rgba(0,180,255,0.1)", padding: "20px 24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    <div>
                      <div style={{ color: "#00b4ff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Delivery Info</div>
                      {[["📍 Address", order.address], ["🏙 City", order.city], ["📞 Phone", order.phone], ["💳 Payment", order.payment === "cod" ? "Cash on Delivery" : "Bank Transfer"]].map(([label, val]) => (
                        val && <div key={label} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13 }}>
                          <span style={{ color: "#64748b", minWidth: 90 }}>{label}</span>
                          <span style={{ color: "#e2e8f0" }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ color: "#00b4ff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Order Items</div>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <span style={{ color: "#cbd5e1" }}>{item.name} <span style={{ color: "#64748b" }}>× {item.qty}</span></span>
                          <span style={{ color: "#00b4ff", fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: 800, color: "#00b4ff", fontSize: 16 }}>
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