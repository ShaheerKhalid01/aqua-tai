"use client";
import { useEffect } from "react";
import { products } from "@/data/products";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const statusColors = { Delivered: "#10b981", Processing: "#f59e0b", Shipped: "#3b82f6", Pending: "#ef4444" };

export default function AdminDashboard() {
  const { orders, loading, loadOrders } = useOrders();

  // Load fresh orders from DB on mount
  useEffect(() => { loadOrders(); }, []);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 20).length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: "💰", color: "#00b4ff" },
    { label: "Total Orders", value: totalOrders, icon: "🛍️", color: "#10b981" },
    { label: "Pending Orders", value: pendingOrders, icon: "⏳", color: "#f59e0b" },
    { label: "Low Stock Items", value: lowStock, icon: "⚠️", color: "#ef4444" },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: "Georgia, serif", color: "#fff" }}>Dashboard</h1>
        <p style={{ color: "#64748b", marginTop: 6 }}>Welcome back! Here's what's happening with AquaTai today.</p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b", fontSize: 14 }}>
          ⏳ Loading orders...
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.12)", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent Orders */}
        <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.12)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 18 }}>Recent Orders</h2>
            <Link href="/admin/orders" style={{ color: "#00b4ff", fontSize: 13, textDecoration: "none" }}>View All →</Link>
          </div>
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{order.id}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{order.customer}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#00b4ff", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{formatPrice(order.total)}</div>
                <span style={{ background: `${statusColors[order.status]}22`, color: statusColors[order.status], padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.12)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 18 }}>Products Overview</h2>
            <Link href="/admin/products" style={{ color: "#00b4ff", fontSize: 13, textDecoration: "none" }}>Manage →</Link>
          </div>
          {products.slice(0, 5).map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>💧</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 1 }}>{p.name}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>{p.category} · ★{p.rating}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#00b4ff", fontWeight: 700, fontSize: 14 }}>{formatPrice(p.price)}</div>
                <div style={{ color: p.stock < 20 ? "#f59e0b" : "#10b981", fontSize: 11 }}>Stock: {p.stock}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}