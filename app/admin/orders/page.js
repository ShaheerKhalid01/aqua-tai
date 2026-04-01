"use client";
import { useState, useEffect } from "react";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/lib/utils";

const statusColors = {
  Delivered:  { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Processing: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Shipped:    { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Pending:    { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  Cancelled:  { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" },
};
const allStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { orders, loading, loadOrders, changeStatus, deleteOrder } = useOrders();
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  useEffect(() => { loadOrders(); }, []);

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);
  const countOf = s => s === "All" ? orders.length : orders.filter(o => o.status === s).length;

  const updateStatus = (id, status) => {
    changeStatus(id, status);
    if (selectedOrder?.orderId === id || selectedOrder?.id === id)
      setSelectedOrder({ ...selectedOrder, status });
  };

  const handleSelectOrder = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };
  
  const handleSelectAll = () => {
    if (selectedOrders.size === filtered.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filtered.map(o => o.orderId || o.id)));
    }
  };
  
  const deleteSelectedOrders = async () => {
    if (selectedOrders.size === 0) {
      alert('No orders selected');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedOrders.size} order(s)? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const deletePromises = Array.from(selectedOrders).map(orderId =>
        deleteOrder(orderId)
      );
      
      await Promise.all(deletePromises);
      alert(`Successfully deleted ${selectedOrders.size} order(s)`);
      setSelectedOrders(new Set());
      await loadOrders();
    } catch (error) {
      console.error('Error deleting orders:', error);
      alert('Failed to delete some orders. Please try again.');
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>Orders</h1>
          {selectedOrders.size > 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ color:"#64748b", fontSize:14 }}>
                {selectedOrders.size} selected
              </span>
              <button
                onClick={deleteSelectedOrders}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#ef4444';
                }}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["All", ...allStatuses].map(s => {
          const sc = statusColors[s];
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: "7px 16px", borderRadius: 20, border: active ? "none" : "1px solid #e2e8f0", background: active ? (sc ? sc.color : "#0057a8") : "#fff", color: active ? "#fff" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, display: "flex", alignItems: "center", gap: 6 }}>
              {s}
              <span style={{ background: active ? "rgba(255,255,255,0.25)" : "#f1f5f9", color: active ? "#fff" : "#64748b", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{countOf(s)}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8f0fe", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "#94a3b8" }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p>No orders found.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "14px 20px", textAlign: "center", color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #e8f0fe", width: "60px" }}>
                  <input
                    type="checkbox"
                    checked={selectedOrders.size === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                {["Order ID", "Customer", "Date", "Items", "Total", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #e8f0fe" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const sc = statusColors[order.status] || statusColors.Pending;
                const oid = order.orderId || order.id;
                return (
                  <tr key={oid} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(oid)}
                        onChange={() => handleSelectOrder(oid)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ color: "#0057a8", fontWeight: 700, fontSize: 13 }}>{oid}</span>
                      {i === 0 && <span style={{ marginLeft: 6, background: "#f0fdf4", color: "#16a34a", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, border: "1px solid #bbf7d0" }}>NEW</span>}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>{order.customer}</div>
                      <div style={{ color: "#94a3b8", fontSize: 11 }}>{order.email}</div>
                      {order.city && <div style={{ color: "#94a3b8", fontSize: 11 }}>📍 {order.city}</div>}
                    </td>
                    <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 12 }}>{order.date}</td>
                    <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 13 }}>{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "#1a1a2e", fontSize: 14 }}>{formatPrice(order.total)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{order.status}</span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button onClick={() => setSelectedOrder(order)}
                          style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#0057a8", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>View</button>
                        <select value={order.status} onChange={e => updateStatus(oid, e.target.value)}
                          style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#334155", padding: "5px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11, outline: "none" }}>
                          {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                          <button onClick={() => updateStatus(oid, "Cancelled")}
                            style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontWeight: 900, fontSize: 20, color: "#1a1a2e", marginBottom: 4 }}>Order {selectedOrder.orderId || selectedOrder.id}</h2>
                <span style={{ background: statusColors[selectedOrder.status]?.bg, color: statusColors[selectedOrder.status]?.color, border: `1px solid ${statusColors[selectedOrder.status]?.border}`, padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", width: 36, height: 36, borderRadius: 8, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 20, border: "1px solid #e8f0fe" }}>
              <div style={{ color: "#0057a8", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Customer Info</div>
              {[["👤 Name", selectedOrder.customer], ["✉️ Email", selectedOrder.email], ["📞 Phone", selectedOrder.phone || "—"], ["📍 City", selectedOrder.city || "—"], ["📅 Date", selectedOrder.date], ["💳 Payment", selectedOrder.payment === "cod" ? "Cash on Delivery" : "Bank Transfer"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: "#64748b" }}>{l}</span>
                  <span style={{ color: "#1a1a2e", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ color: "#0057a8", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Order Items</div>
            {selectedOrder.items?.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{item.name}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>Qty: {item.qty}</div>
                </div>
                <span style={{ color: "#0057a8", fontWeight: 700 }}>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, padding: "14px 0", borderTop: "2px solid #e8f0fe", fontSize: 18, fontWeight: 900, color: "#0057a8" }}>
              <span>Total</span><span>{formatPrice(selectedOrder.total)}</span>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ color: "#64748b", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>Update Status</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {allStatuses.map(s => {
                  const sc = statusColors[s];
                  const active = selectedOrder.status === s;
                  return (
                    <button key={s} onClick={() => updateStatus(selectedOrder.orderId || selectedOrder.id, s)}
                      style={{ padding: "7px 14px", borderRadius: 8, border: active ? "none" : `1px solid ${sc?.border || "#e2e8f0"}`, background: active ? sc?.color || "#0057a8" : sc?.bg || "#f8fafc", color: active ? "#fff" : sc?.color || "#64748b", cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 500 }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}