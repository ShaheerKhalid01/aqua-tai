"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.users);
      } else {
        console.error('Failed to fetch customers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding:32 }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:900, color:"#1a1a2e", marginBottom:6 }}>Customers</h1>
        <p style={{ color:"#64748b", fontSize:14 }}>{customers.length} registered customers</p>
      </div>
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8f0fe", overflow:"hidden" }}>
        {loading ? (
          <div style={{ padding:"60px 0", textAlign:"center", color:"#94a3b8" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
            <p>Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding:"60px 0", textAlign:"center", color:"#94a3b8" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
            <p>No customers yet.</p>
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Customer","Email","City","Orders","Total Spent","Last Order","Status"].map(h=>(
                  <th key={h} style={{ padding:"14px 20px", textAlign:"left", color:"#64748b", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid #e8f0fe" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"16px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:38, height:38, background:"#0057a8", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15 }}>{customer.name ? customer.name[0] : "U"}</div>
                      <span style={{ fontWeight:600, color:"#1a1a2e", fontSize:14 }}>{customer.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td style={{ padding:"16px 20px", color:"#64748b", fontSize:13 }}>{customer.email}</td>
                  <td style={{ padding:"16px 20px", color:"#64748b", fontSize:13 }}>{customer.city || "—"}</td>
                  <td style={{ padding:"16px 20px" }}><span style={{ background:"#eff6ff", color:"#0057a8", padding:"3px 10px", borderRadius:20, fontSize:13, fontWeight:700 }}>{customer.orders || 0}</span></td>
                  <td style={{ padding:"16px 20px", fontWeight:700, color:"#0057a8", fontSize:14 }}>{formatPrice(customer.spent || 0)}</td>
                  <td style={{ padding:"16px 20px", color:"#94a3b8", fontSize:13 }}>{customer.lastOrder || "—"}</td>
                  <td style={{ padding:"16px 20px" }}>
                    <span style={{ 
                      background: customer.emailVerified ? "#dcfce7" : "#fef3c7", 
                      color: customer.emailVerified ? "#166534" : "#92400e", 
                      padding:"3px 10px", 
                      borderRadius:20, 
                      fontSize:13, 
                      fontWeight:700 
                    }}>
                      {customer.emailVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}