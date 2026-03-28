"use client";
import { useEffect } from "react";
import { useOrders } from "@/context/OrdersContext";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const statusColors = {
  Delivered:  { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Processing: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Shipped:    { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Pending:    { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  Cancelled:  { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" },
};

export default function AdminDashboard() {
  const { orders, loadOrders } = useOrders();
  const { products, loadProducts } = useProducts();

  useEffect(() => { loadOrders(); loadProducts(); }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === "Pending").length;
  const lowStock = products.filter(p => p.stock < 10).length;

  const stats = [
    { label: "Total Revenue",   value: formatPrice(totalRevenue), icon: "💰", color: "#0057a8", bg: "#eff6ff", border: "#bfdbfe", sub: "All time" },
    { label: "Total Orders",    value: orders.length,             icon: "🛍️", color: "#047857", bg: "#f0fdf4", border: "#bbf7d0", sub: "All orders" },
    { label: "Pending Orders",  value: pending,                   icon: "⏳", color: "#d97706", bg: "#fffbeb", border: "#fde68a", sub: "Need action" },
    { label: "Total Products",  value: products.length,           icon: "📦", color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff", sub: `${lowStock} low stock` },
  ];

  const recentOrders = orders.slice(0, 6);

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a2e", marginBottom: 6 }}>Dashboard</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Welcome back! Here's what's happening with AQUA R.O Filter today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#fff", border: `1px solid ${s.border}`, borderRadius: 16, padding: 24, borderTop: `4px solid ${s.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ background: s.bg, width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
              <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>{s.sub}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* Recent Orders */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8f0fe", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8f0fe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 800, fontSize: 17, color: "#1a1a2e" }}>Recent Orders</h2>
            <Link href="/admin/orders" style={{ color: "#0057a8", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>View All →</Link>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Order ID", "Customer", "Total", "Status", "Date"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #e8f0fe" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No orders yet</td></tr>
              ) : recentOrders.map((order, i) => {
                const sc = statusColors[order.status] || statusColors.Pending;
                return (
                  <tr key={order.orderId || i} style={{ borderBottom: "1px solid #f1f5f9" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 20px", color: "#0057a8", fontWeight: 700, fontSize: 13 }}>{order.orderId || order.id}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>{order.customer}</div>
                      <div style={{ color: "#94a3b8", fontSize: 11 }}>{order.email}</div>
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "#1a1a2e", fontSize: 14 }}>{formatPrice(order.total)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 12 }}>{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick actions + products */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Quick Actions */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8f0fe", padding: 20 }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: "#1a1a2e", marginBottom: 16 }}>Quick Actions</h3>
            {[
              { label: "Add New Product",   href: "/admin/products", icon: "➕", color: "#0057a8", bg: "#eff6ff" },
              { label: "Manage Orders",     href: "/admin/orders",   icon: "🛍️", color: "#047857", bg: "#f0fdf4" },
              { label: "View Customers",    href: "/admin/customers", icon: "👥", color: "#7c3aed", bg: "#faf5ff" },
              { label: "Store Settings",   href: "/admin/settings",  icon: "⚙️", color: "#64748b", bg: "#f8fafc" },
            ].map(a => (
              <Link key={a.label} href={a.href}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, textDecoration: "none", marginBottom: 8, background: "#f8fafc", border: "1px solid #e8f0fe", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = a.bg; e.currentTarget.style.borderColor = "transparent"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e8f0fe"; }}>
                <div style={{ width: 36, height: 36, background: a.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                <span style={{ color: "#334155", fontWeight: 600, fontSize: 14 }}>{a.label}</span>
                <span style={{ marginLeft: "auto", color: "#94a3b8" }}>→</span>
              </Link>
            ))}
          </div>

          {/* Low stock alert */}
          {lowStock > 0 && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <div style={{ color: "#d97706", fontWeight: 700, fontSize: 14 }}>Low Stock Alert</div>
                  <div style={{ color: "#92400e", fontSize: 12 }}>{lowStock} product{lowStock > 1 ? "s" : ""} running low</div>
                </div>
              </div>
              <Link href="/admin/products" style={{ display: "block", background: "#d97706", color: "#fff", padding: "8px 0", borderRadius: 8, textAlign: "center", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                Manage Products →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}