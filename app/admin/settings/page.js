"use client";
import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({ storeName: "AQUA R.O Filter", tagline: "Pure Water Solutions", email: "info@aquatai.pk", phone: "+92 300 1234567", address: "Lahore, Pakistan", currency: "PKR", freeShippingThreshold: 5000, taxRate: 17 });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", marginTop: 6 };

  const Section = ({ title, children }) => (
    <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.12)", borderRadius: 16, padding: 28, marginBottom: 24 }}>
      <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(0,180,255,0.1)" }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ padding: 32, maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: "Georgia, serif" }}>Settings</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>Configure your store settings.</p>
      </div>

      <Section title="Store Information">
        {[["storeName", "Store Name"], ["tagline", "Tagline"]].map(([key, label]) => (
          <div key={key} style={{ marginBottom: 4 }}>
            <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginTop: 14 }}>{label}</label>
            <input style={inputStyle} value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
          </div>
        ))}
      </Section>

      <Section title="Contact Details">
        {[["email", "Email"], ["phone", "Phone"], ["address", "Address"]].map(([key, label]) => (
          <div key={key} style={{ marginBottom: 4 }}>
            <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginTop: 14 }}>{label}</label>
            <input style={inputStyle} value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
          </div>
        ))}
      </Section>

      <Section title="Store Policies">
        <div style={{ marginBottom: 4 }}>
          <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginTop: 14 }}>Free Shipping Threshold (PKR)</label>
          <input type="number" style={inputStyle} value={settings.freeShippingThreshold} onChange={(e) => setSettings({ ...settings, freeShippingThreshold: +e.target.value })} />
        </div>
        <div>
          <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginTop: 14 }}>Tax Rate (%)</label>
          <input type="number" style={inputStyle} value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: +e.target.value })} />
        </div>
      </Section>

      <button onClick={handleSave} style={{ background: saved ? "#10b981" : "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", border: "none", padding: "14px 40px", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all 0.3s" }}>
        {saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}