"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#040d1a", borderTop: "1px solid rgba(0,180,255,0.15)", marginTop: 80 }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img src="/logo.jpeg" alt="AQUA R.O Filter" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 8 }} />
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, fontFamily: "Georgia, serif" }}>AQUA R.O Filter</span>
            </div>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
              Rahim Yar Khan's trusted water filtration specialists. Delivering pure, safe water to homes and businesses across Pakistan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#00b4ff", fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Quick Links</h4>
            {[["Home", "/"], ["Shop", "/shop"], ["My Orders", "/orders"], ["Login", "/login"]].map(([label, href]) => (
              <Link key={label} href={href} style={{ display: "block", color: "#64748b", fontSize: 14, marginBottom: 8, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#00b4ff"}
                onMouseLeave={e => e.target.style.color = "#64748b"}>
                {label}
              </Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ color: "#00b4ff", fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>For Complaint</h4>
            <div style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>📞 0304-2604217</div>
            <div style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>☎️ 068-2098583</div>
            <div style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>
              ✉️{" "}
              <a href="mailto:aquarowaterfilter@gmail.com" style={{ color: "#64748b", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#00b4ff"}
                onMouseLeave={e => e.target.style.color = "#64748b"}>
                aquarowaterfilter@gmail.com
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#00b4ff", fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Find Us</h4>
            <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8 }}>
              📍 Jamia Tul Farooq Road,<br />
              OPP. Abbasi PSO Pump,<br />
              Old Adda Khanpur,<br />
              Rahim Yar Khan
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <a href="https://facebook.com/AQUA R.O Water Filters" target="_blank" rel="noreferrer"
                style={{ background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.15)", color: "#00b4ff", padding: "6px 14px", borderRadius: 8, fontSize: 12, textDecoration: "none", fontWeight: 600 }}>
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "#334155", fontSize: 13 }}>© {new Date().getFullYear()} AQUA R.O Filter. All rights reserved.</p>
          <p style={{ color: "#334155", fontSize: 13 }}>Rahim Yar Khan, Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}