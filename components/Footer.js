"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img src="/logo.jpeg" alt="Aqua R.O Water Filter" style={{ width: 42, height: 42, objectFit: "contain", borderRadius: 8 }} />
              <div>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>Aqua R.O Water Filter</div>
                <div style={{ color: "#94a3b8", fontSize: 10, letterSpacing: 2 }}>PURE WATER SOLUTIONS</div>
              </div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Rahim Yar Khan's trusted water filtration specialists since 2010. Delivering pure water to homes and businesses across Pakistan.
            </p>
            <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
              💬 Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 18, letterSpacing: 1 }}>Quick Links</h4>
            {[["Home", "/"], ["Shop", "/shop"], ["My Orders", "/orders"], ["Login", "/login"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ display: "block", color: "#94a3b8", fontSize: 14, marginBottom: 10, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#38bdf8"}
                onMouseLeave={e => e.target.style.color = "#94a3b8"}>
                {l}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 18, letterSpacing: 1 }}>Categories</h4>
            {["Reverse Osmosis System", "Domestic Water Filter", "Cartridges & Accessories", "Whole House Water Softener", "Commercial Water Plants"].map(c => (
              <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`}
                style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 10, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#38bdf8"}
                onMouseLeave={e => e.target.style.color = "#94a3b8"}>
                {c}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 18, letterSpacing: 1 }}>Contact</h4>
            <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 10, lineHeight: 1.6 }}>
              📍 Jamia Tul Farooq Road,<br />Old Adda Khanpur,<br />Rahim Yar Khan
            </div>
            <a href="tel:03042604217" style={{ display: "block", color: "#94a3b8", fontSize: 14, marginBottom: 8, textDecoration: "none" }}>📞 0304-2604217</a>
            <a href="tel:0682098583" style={{ display: "block", color: "#94a3b8", fontSize: 14, marginBottom: 8, textDecoration: "none" }}>☎️ 068-2098583</a>
            <a href="mailto:aquarowaterfilter@gmail.com" style={{ display: "block", color: "#94a3b8", fontSize: 13, textDecoration: "none" }}>✉️ aquarowaterfilter@gmail.com</a>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "#475569", fontSize: 13 }}>© {new Date().getFullYear()} Aqua R.O Water Filter. All rights reserved.</p>
          <p style={{ color: "#475569", fontSize: 13 }}>🇵🇰 Made with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}