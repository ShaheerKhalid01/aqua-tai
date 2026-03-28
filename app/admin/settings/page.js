"use client";
import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({ storeName:"AQUA R.O Filter", tagline:"Pure Water Solutions", email:"aquarowaterfilter@gmail.com", phone:"0304-2604217", address:"Jamia Tul Farooq Road, OPP. Abbasi PSO Pump, Old Adda Khanpur, Rahim Yar Khan", currency:"PKR", freeShippingThreshold:5000, taxRate:0 });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };
  const inputStyle = { width:"100%", background:"#f8fafc", border:"2px solid #e2e8f0", borderRadius:8, padding:"11px 14px", color:"#1a1a2e", fontSize:14, outline:"none", marginTop:6, transition:"border 0.2s" };
  const labelStyle = { color:"#475569", fontSize:13, fontWeight:600, display:"block", marginTop:16 };

  const Section = ({ title, icon, children }) => (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8f0fe", padding:28, marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f1f5f9" }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <h2 style={{ fontWeight:800, fontSize:17, color:"#1a1a2e" }}>{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ padding:32, maxWidth:700 }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:900, color:"#1a1a2e", marginBottom:6 }}>Settings</h1>
        <p style={{ color:"#64748b", fontSize:14 }}>Configure your store settings.</p>
      </div>

      <Section title="Store Information" icon="🏪">
        {[["storeName","Store Name"],["tagline","Tagline"]].map(([k,l])=>(
          <div key={k}>
            <label style={labelStyle}>{l}</label>
            <input style={inputStyle} value={settings[k]} onChange={e=>setSettings({...settings,[k]:e.target.value})}
              onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />
          </div>
        ))}
      </Section>

      <Section title="Contact Details" icon="📞">
        {[["email","Email"],["phone","Phone"],["address","Address"]].map(([k,l])=>(
          <div key={k}>
            <label style={labelStyle}>{l}</label>
            <input style={inputStyle} value={settings[k]} onChange={e=>setSettings({...settings,[k]:e.target.value})}
              onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />
          </div>
        ))}
      </Section>

      <Section title="Store Policies" icon="📋">
        <label style={labelStyle}>Free Shipping Threshold (PKR)</label>
        <input type="number" style={inputStyle} value={settings.freeShippingThreshold} onChange={e=>setSettings({...settings,freeShippingThreshold:+e.target.value})}
          onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />
        <label style={labelStyle}>Tax Rate (%)</label>
        <input type="number" style={inputStyle} value={settings.taxRate} onChange={e=>setSettings({...settings,taxRate:+e.target.value})}
          onFocus={e=>e.target.style.border="2px solid #0057a8"} onBlur={e=>e.target.style.border="2px solid #e2e8f0"} />
      </Section>

      <button onClick={handleSave}
        style={{ background:saved?"#16a34a":"#0057a8", color:"#fff", border:"none", padding:"14px 40px", borderRadius:10, fontWeight:700, fontSize:16, cursor:"pointer", transition:"background 0.3s" }}>
        {saved ? "✓ Saved Successfully!" : "Save Settings"}
      </button>
    </div>
  );
}