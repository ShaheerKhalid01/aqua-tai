"use client";
import { useState, useEffect } from "react";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/lib/utils";

const statusColors = { Delivered: "#10b981", Processing: "#f59e0b", Shipped: "#3b82f6", Pending: "#ef4444", Cancelled: "#64748b" };
const allStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { orders, loading, loadOrders, changeStatus } = useOrders();
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load fresh from DB when admin opens this page
  useEffect(() => { loadOrders(); }, []);

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const countOf = (s) => s === "All" ? orders.length : orders.filter((o) => o.status === s).length;

  const updateStatus = (id, status) => {
    changeStatus(id, status);
    if (selectedOrder?.orderId === id || selectedOrder?.id === id)
      setSelectedOrder({ ...selectedOrder, status });
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: "Georgia, serif" }}>Orders</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>{orders.length} total orders</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {["All", ...allStatuses].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "8px 18px", borderRadius: 20, border: filter === s ? "none" : "1px solid rgba(0,180,255,0.2)", background: filter === s ? "linear-gradient(135deg, #00b4ff, #0066cc)" : "transparent", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: filter === s ? 700 : 400, display: "flex", alignItems: "center", gap: 6 }}>
            {s}
            <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "0 6px", fontSize: 11 }}>{countOf(s)}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16 }}>No orders found{filter !== "All" ? ` with status "${filter}"` : ""}.</p>
        </div>
      ) : (
        <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.12)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,180,255,0.15)" }}>
                {["Order ID", "Customer", "Date", "Items", "Total", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#00b4ff", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ color: "#00b4ff", fontWeight: 700, fontSize: 13 }}>{order.id}</span>
                    {i === 0 && orders[0]?.id === order.id && (
                      <span style={{ marginLeft: 6, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>NEW</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{order.customer}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{order.email}</div>
                    {order.city && <div style={{ color: "#475569", fontSize: 11 }}>📍 {order.city}</div>}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#94a3b8", fontSize: 13 }}>{order.date}</td>
                  <td style={{ padding: "14px 20px", color: "#94a3b8", fontSize: 13 }}>{order.items.length} item{order.items.length > 1 ? "s" : ""}</td>
                  <td style={{ padding: "14px 20px", color: "#fff", fontWeight: 700 }}>{formatPrice(order.total)}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ background: `${statusColors[order.status]}22`, color: statusColors[order.status], padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button onClick={() => setSelectedOrder(order)}
                        style={{ background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.2)", color: "#00b4ff", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                        View
                      </button>
                      <select value={order.status} onChange={(e) => updateStatus(order.id || order.orderId, e.target.value)}
                        style={{ background: "#0a1e35", border: "1px solid rgba(0,180,255,0.2)", color: "#fff", padding: "5px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11, outline: "none" }}>
                        {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {order.status !== "Cancelled" && order.status !== "Delivered" && (
                        <button onClick={() => updateStatus(order.id || order.orderId, "Cancelled")}
                          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#0d2545", border: "1px solid rgba(0,180,255,0.25)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>Order {selectedOrder.id}</h2>
                <span style={{ background: `${statusColors[selectedOrder.status]}22`, color: statusColors[selectedOrder.status], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", width: 32, height: 32, borderRadius: 8, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ×
              </button>
            </div>

            {/* Customer info */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ color: "#00b4ff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Customer Info</div>
              {[["👤 Customer", selectedOrder.customer], ["✉️ Email", selectedOrder.email], ["📞 Phone", selectedOrder.phone || "—"], ["📍 City", selectedOrder.city || "—"], ["📅 Date", selectedOrder.date], ["💳 Payment", selectedOrder.payment === "cod" ? "Cash on Delivery" : "Bank Transfer"]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: "#64748b" }}>{label}</span>
                  <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Items */}
            <div style={{ color: "#00b4ff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Order Items</div>
            {selectedOrder.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>💧</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>Qty: {item.qty}</div>
                  </div>
                </div>
                <span style={{ color: "#00b4ff", fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, padding: "14px 0", borderTop: "1px solid rgba(0,180,255,0.15)", fontSize: 20, fontWeight: 900, color: "#00b4ff" }}>
              <span>Total</span><span>{formatPrice(selectedOrder.total)}</span>
            </div>

            {/* Update status from modal */}
            <div style={{ marginTop: 20 }}>
              <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>Update Status</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {allStatuses.map((s) => (
                  <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                    style={{ padding: "7px 14px", borderRadius: 8, border: selectedOrder.status === s ? "none" : "1px solid rgba(255,255,255,0.1)", background: selectedOrder.status === s ? `${statusColors[s]}33` : "transparent", color: selectedOrder.status === s ? statusColors[s] : "#64748b", cursor: "pointer", fontSize: 12, fontWeight: selectedOrder.status === s ? 700 : 400 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}