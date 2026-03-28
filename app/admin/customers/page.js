"use client";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";

export default function AdminCustomers() {
  const { orders, loadOrders } = useOrders();
  useEffect(() => { loadOrders(); }, []);

  const customers = orders.reduce((acc, o) => {
    const key = o.email;
    if (!acc[key]) acc[key] = { name:o.customer, email:o.email, orders:0, spent:0, lastOrder:o.date, city:o.city };
    acc[key].orders++;
    acc[key].spent += o.total || 0;
    return acc;
  }, {});
  const list = Object.values(customers);

  return (
    <div style={{ padding:32 }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:900, color:"#1a1a2e", marginBottom:6 }}>Customers</h1>
        <p style={{ color:"#64748b", fontSize:14 }}>{list.length} registered customers</p>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8f0fe", overflow:"hidden" }}>
        {list.length === 0 ? (
          <div style={{ padding:"60px 0", textAlign:"center", color:"#94a3b8" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
            <p>No customers yet.</p>
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Customer","Email","City","Orders","Total Spent","Last Order"].map(h=>(
                  <th key={h} style={{ padding:"14px 20px", textAlign:"left", color:"#64748b", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid #e8f0fe" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((c,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"16px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:38, height:38, background:"#0057a8", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15 }}>{c.name[0]}</div>
                      <span style={{ fontWeight:600, color:"#1a1a2e", fontSize:14 }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"16px 20px", color:"#64748b", fontSize:13 }}>{c.email}</td>
                  <td style={{ padding:"16px 20px", color:"#64748b", fontSize:13 }}>{c.city || "—"}</td>
                  <td style={{ padding:"16px 20px" }}><span style={{ background:"#eff6ff", color:"#0057a8", padding:"3px 10px", borderRadius:20, fontSize:13, fontWeight:700 }}>{c.orders}</span></td>
                  <td style={{ padding:"16px 20px", fontWeight:700, color:"#0057a8", fontSize:14 }}>{formatPrice(c.spent)}</td>
                  <td style={{ padding:"16px 20px", color:"#94a3b8", fontSize:13 }}>{c.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}