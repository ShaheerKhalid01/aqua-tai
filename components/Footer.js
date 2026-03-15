export default function Footer() {
  return (
    <footer style={{ background: "#040d1a", borderTop: "1px solid rgba(0,180,255,0.15)", marginTop: 80 }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>💧</span>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "Georgia, serif" }}>AQUA R.O Filter</span>
            </div>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>Pakistan's most trusted water filtration brand. Delivering pure, safe water to homes and businesses since 2019.</p>
          </div>
          <div>
            <h4 style={{ color: "#00b4ff", fontWeight: 700, marginBottom: 16, fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Quick Links</h4>
            {["Shop All", "Under Sink", "Countertop", "Whole House", "Replacement Filters"].map(l => (
              <div key={l} style={{ color: "#64748b", fontSize: 14, marginBottom: 8, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#00b4ff", fontWeight: 700, marginBottom: 16, fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Support</h4>
            {["Installation Guide", "FAQ", "Warranty", "Contact Us", "Track Order"].map(l => (
              <div key={l} style={{ color: "#64748b", fontSize: 14, marginBottom: 8, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#00b4ff", fontWeight: 700, marginBottom: 16, fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Contact</h4>
            <div style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>📍 Lahore, Pakistan</div>
            <div style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>📞 +92 300 1234567</div>
            <div style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>✉️ info@aquatai.pk</div>
            <div style={{ color: "#64748b", fontSize: 14 }}>🕐 Mon-Sat: 9AM - 6PM</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "#334155", fontSize: 13 }}>© 2024 AQUA R.O Filter. All rights reserved.</p>
          <p style={{ color: "#334155", fontSize: 13 }}>Made with 💧 in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}