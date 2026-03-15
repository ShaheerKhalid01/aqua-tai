"use client";
import { orders } from "@/data/orders";
import { formatPrice } from "@/lib/utils";

const customers = orders.map((o) => ({ name: o.customer, email: o.email, orders: 1, spent: o.total, lastOrder: o.date }));

export default function AdminCustomers() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: "Georgia, serif" }}>Customers</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>{customers.length} registered customers</p>
      </div>
      <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.12)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,180,255,0.15)" }}>
              {["Customer", "Email", "Orders", "Total Spent", "Last Order"].map((h) => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#00b4ff", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #00b4ff, #0066cc)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {c.name[0]}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", color: "#94a3b8", fontSize: 14 }}>{c.email}</td>
                <td style={{ padding: "16px 20px", color: "#fff", fontSize: 14, fontWeight: 600 }}>{c.orders}</td>
                <td style={{ padding: "16px 20px", color: "#00b4ff", fontWeight: 700 }}>{formatPrice(c.spent)}</td>
                <td style={{ padding: "16px 20px", color: "#64748b", fontSize: 13 }}>{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
