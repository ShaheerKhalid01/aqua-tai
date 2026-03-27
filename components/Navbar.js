"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { count } = useCart();
  const { state, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); setDropdownOpen(false); router.push("/"); };

  const navLinks = [
    ["Home", "/"],
    ["Shop", "/shop"],
    ...(state.clientUser ? [["My Orders", "/orders"]] : []),
  ];

  return (
    <nav style={{ background: "#fff", borderBottom: "2px solid #e8f0fe", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,87,168,0.08)" }}>
      {/* Top bar */}
      <div style={{ background: "#0057a8", padding: "5px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>📍 Old Adda Khanpur, Rahim Yar Khan</span>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="tel:03042604217" style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, textDecoration: "none" }}>📞 0304-2604217</a>
            <a href="mailto:aquarowaterfilter@gmail.com" style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, textDecoration: "none" }}>✉️ aquarowaterfilter@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.jpeg" alt="AQUA R.O Filter" style={{ width: 46, height: 46, objectFit: "contain", borderRadius: 8 }} />
          <div>
            <div style={{ color: "#0057a8", fontWeight: 900, fontSize: 18, letterSpacing: 0.5, lineHeight: 1.1 }}>AQUA R.O Filter</div>
            <div style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Pure Water Solutions</div>
          </div>
        </Link>

        {/* Nav links — desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {navLinks.map(([label, href]) => (
            <Link key={label} href={href}
              style={{ color: "#334155", textDecoration: "none", fontSize: 14, fontWeight: 600, letterSpacing: 0.3 }}
              onMouseEnter={e => e.target.style.color = "#0057a8"}
              onMouseLeave={e => e.target.style.color = "#334155"}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Cart */}
          <Link href="/cart" style={{ position: "relative", background: "#f5f8ff", border: "1px solid #e8f0fe", borderRadius: 8, padding: "8px 16px", color: "#0057a8", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}>
            🛒 Cart
            {count > 0 && (
              <span style={{ background: "#0057a8", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, position: "absolute", top: -8, right: -8 }}>{count}</span>
            )}
          </Link>

          {/* Auth */}
          {state.clientUser ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ background: "#0057a8", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 24, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>
                  {state.clientUser.name[0].toUpperCase()}
                </div>
                {state.clientUser.name.split(" ")[0]}
              </button>
              {dropdownOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid #e8f0fe", borderRadius: 12, padding: 8, minWidth: 180, zIndex: 100, boxShadow: "0 8px 24px rgba(0,87,168,0.15)" }}>
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9", marginBottom: 4 }}>
                    <div style={{ color: "#1a1a2e", fontWeight: 700, fontSize: 13 }}>{state.clientUser.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: 11 }}>{state.clientUser.email}</div>
                  </div>
                  <Link href="/orders" onClick={() => setDropdownOpen(false)}
                    style={{ display: "block", padding: "8px 12px", color: "#334155", textDecoration: "none", fontSize: 13, borderRadius: 6 }}
                    onMouseEnter={e => e.target.style.background = "#f5f8ff"}
                    onMouseLeave={e => e.target.style.background = "transparent"}>
                    📦 My Orders
                  </Link>
                  <button onClick={handleLogout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13, borderRadius: 6, fontWeight: 600 }}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ background: "#0057a8", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}