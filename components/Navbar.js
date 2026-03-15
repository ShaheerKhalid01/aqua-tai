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

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    <nav style={{ background: "linear-gradient(135deg, #0a2540 0%, #0d3060 100%)", borderBottom: "1px solid rgba(0,180,255,0.2)" }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #00b4ff, #0066cc)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💧</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, fontFamily: "Georgia, serif", letterSpacing: 1 }}>AquaTai</div>
            <div style={{ color: "#00b4ff", fontSize: 9, letterSpacing: 3, textTransform: "uppercase" }}>Pure Water Solutions</div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[["Home", "/"], ["Shop", "/shop"]].map(([label, href]) => (
            <Link key={label} href={href}
              style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = "#00b4ff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.8)"}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link href="/cart" style={{ position: "relative", background: "rgba(0,180,255,0.15)", border: "1px solid rgba(0,180,255,0.3)", borderRadius: 8, padding: "8px 14px", color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
            🛒
            {count > 0 && (
              <span style={{ background: "#00b4ff", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, position: "absolute", top: -6, right: -6 }}>{count}</span>
            )}
            Cart
          </Link>

          {/* Client auth */}
          {state.clientUser ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 24, background: "linear-gradient(135deg,#00b4ff,#0066cc)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>
                  {state.clientUser.name[0].toUpperCase()}
                </div>
                {state.clientUser.name.split(" ")[0]}
                <span style={{ fontSize: 10, color: "#64748b" }}>{dropdownOpen ? "▲" : "▼"}</span>
              </button>

              {dropdownOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#0d2545", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 12, padding: 8, minWidth: 180, zIndex: 100, boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 6 }}>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{state.clientUser.name}</div>
                    <div style={{ color: "#64748b", fontSize: 11 }}>{state.clientUser.email}</div>
                  </div>
                  <button onClick={handleLogout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, color: "#ef4444", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              style={{ background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)", color: "#00b4ff", padding: "8px 16px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Sign In
            </Link>
          )}


        </div>
      </div>
    </nav>
  );
}