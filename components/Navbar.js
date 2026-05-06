"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { categories } from "@/data/products";

export default function Navbar() {
  const { count } = useCart();
  const { state, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesTimeoutRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    };
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleCategoriesEnter = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    categoriesTimeoutRef.current = setTimeout(() => setCategoriesOpen(true), 100);
  };

  const handleCategoriesLeave = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    categoriesTimeoutRef.current = setTimeout(() => setCategoriesOpen(false), 200);
  };

  const handleLogout = () => { logout(); setDropdownOpen(false); setMobileOpen(false); router.push("/"); };

  const productCategories = categories.filter(c => c !== "All");

  const navLinkStyle = { color: "#334155", textDecoration: "none", fontSize: 14, fontWeight: 600, letterSpacing: 0.3 };
  const navLinkHover = { color: "#0057a8" };

  return (
    <>
      {/* ── Top Navbar ── */}
      <nav style={{ background: "#fff", borderBottom: "2px solid #e8f0fe", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,87,168,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", padding: 8, cursor: "pointer", color: "#0057a8", display: "flex", alignItems: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo.jpeg" alt="Aqua R.O Water Filter" style={{ width: 38, height: 38, objectFit: "contain", borderRadius: 8 }} />
            <div className="logo-text" style={{ display: "none" }}>
              <div style={{ color: "#0057a8", fontWeight: 900, fontSize: 16, letterSpacing: 0.5, lineHeight: 1.1 }}>Aqua R.O Water Filter</div>
              <div style={{ color: "#64748b", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Pure Water Solutions</div>
            </div>
          </Link>

          {/* Nav links — desktop */}
          <div className="desktop-nav" style={{ display: "none", alignItems: "center", gap: 24 }}>
            <Link href="/" style={navLinkStyle} onMouseEnter={e => Object.assign(e.target.style, navLinkHover)} onMouseLeave={e => Object.assign(e.target.style, navLinkStyle)}>Home</Link>

            {/* Categories Dropdown */}
            <div style={{ position: "relative" }} onMouseEnter={handleCategoriesEnter} onMouseLeave={handleCategoriesLeave}>
              <Link href="/shop" style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 4 }} onMouseEnter={e => Object.assign(e.target.style, navLinkHover)} onMouseLeave={e => Object.assign(e.target.style, navLinkStyle)}>
                Categories ▾
              </Link>
              {categoriesOpen && (
                <div onMouseEnter={handleCategoriesEnter} onMouseLeave={handleCategoriesLeave} style={{ position: "absolute", left: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid #e8f0fe", borderRadius: 12, padding: 8, minWidth: 220, zIndex: 100, boxShadow: "0 8px 24px rgba(0,87,168,0.15)" }}>
                  {productCategories.map((category) => (
                    <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} onClick={() => setCategoriesOpen(false)}
                      style={{ display: "block", padding: "10px 14px", color: "#334155", textDecoration: "none", fontSize: 13, borderRadius: 6, fontWeight: 500 }}
                      onMouseEnter={e => { e.target.style.background = "#f5f8ff"; e.target.style.color = "#0057a8"; }}
                      onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#334155"; }}>
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {isClient && state.clientUser && (
              <Link href="/orders" style={navLinkStyle} onMouseEnter={e => Object.assign(e.target.style, navLinkHover)} onMouseLeave={e => Object.assign(e.target.style, navLinkStyle)}>My Orders</Link>
            )}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Cart */}
            <Link href="/cart" style={{ position: "relative", background: "#f5f8ff", border: "1px solid #e8f0fe", borderRadius: 8, padding: "8px 12px", color: "#0057a8", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600 }}>
              <span style={{ fontSize: 16 }}>🛒</span>
              <span className="cart-text">Cart</span>
              {count > 0 && (
                <span style={{ background: "#0057a8", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, position: "absolute", top: -6, right: -6 }}>{count}</span>
              )}
            </Link>

            {/* Auth - Desktop */}
            <div className="desktop-nav" style={{ display: "none" }}>
              {isClient && state.clientUser ? (
                <div style={{ position: "relative" }}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ background: "#0057a8", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 22, height: 22, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11 }}>
                      {state.clientUser.name[0].toUpperCase()}
                    </div>
                    <span className="user-name">{state.clientUser.name.split(" ")[0]}</span>
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
                <Link href="/login" style={{ background: "#0057a8", color: "#fff", padding: "8px 16px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Slide-Out Drawer (Mobile Menu) ── */}
      <div className={`drawer-overlay ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`drawer-panel ${mobileOpen ? "open" : ""}`}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.jpeg" alt="Aqua R.O" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8 }} />
            <div>
              <div style={{ color: "#0057a8", fontWeight: 900, fontSize: 14, lineHeight: 1.1 }}>Aqua R.O Water Filter</div>
              <div style={{ color: "#64748b", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" }}>Pure Water Solutions</div>
            </div>
          </div>
          <button className="drawer-close" onClick={() => setMobileOpen(false)}>✕</button>
        </div>

        {/* User Info in drawer */}
        {isClient && state.clientUser && (
          <div style={{ padding: "14px 20px", background: "#f5f8ff", borderBottom: "1px solid #e8f0fe", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, background: "#0057a8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
              {state.clientUser.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ color: "#1a1a2e", fontWeight: 700, fontSize: 14 }}>{state.clientUser.name}</div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>{state.clientUser.email}</div>
            </div>
          </div>
        )}

        {/* Drawer Nav Links */}
        <div>
          <Link href="/" className="drawer-nav-link" onClick={() => setMobileOpen(false)}>
            <span className="link-icon">🏠</span> Home
          </Link>
          <Link href="/shop" className="drawer-nav-link" onClick={() => setMobileOpen(false)}>
            <span className="link-icon">🛍️</span> Shop
          </Link>

          {/* Categories accordion */}
          <div style={{ borderBottom: "1px solid #f1f5f9" }}>
            <button onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "none", border: "none", color: "#334155", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="link-icon" style={{ fontSize: 18, width: 24, textAlign: "center" }}>📂</span>
                Categories
              </span>
              <span style={{ transform: mobileCategoriesOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", fontSize: 12, color: "#94a3b8" }}>▼</span>
            </button>
            <div style={{
              maxHeight: mobileCategoriesOpen ? "400px" : "0",
              overflow: "hidden",
              transition: "max-height 0.3s ease",
              background: "#f7f9fc"
            }}>
              {productCategories.map((category) => (
                <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`}
                  onClick={() => setMobileOpen(false)}
                  style={{ display: "block", padding: "10px 20px 10px 56px", color: "#64748b", textDecoration: "none", fontSize: 14, borderBottom: "1px solid #f1f5f9" }}>
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {isClient && state.clientUser && (
            <Link href="/orders" className="drawer-nav-link" onClick={() => setMobileOpen(false)}>
              <span className="link-icon">📦</span> My Orders
            </Link>
          )}

          <Link href="/cart" className="drawer-nav-link" onClick={() => setMobileOpen(false)}>
            <span className="link-icon">🛒</span> Cart
            {count > 0 && (
              <span style={{ marginLeft: "auto", background: "#0057a8", color: "#fff", borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{count}</span>
            )}
          </Link>
        </div>

        {/* Drawer Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", marginTop: "auto" }}>
          {isClient && state.clientUser ? (
            <button onClick={handleLogout}
              style={{ width: "100%", padding: "12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "#ef4444", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              🚪 Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}
              style={{ display: "block", padding: "12px", background: "#0057a8", borderRadius: 10, color: "#fff", textAlign: "center", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              Sign In
            </Link>
          )}

          <a href="https://wa.me/923294879030" target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10, padding: "10px", background: "#25D366", borderRadius: 10, color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ── Bottom Navigation Bar (Mobile) ── */}
      <div className="bottom-nav">
        <Link href="/" className={pathname === "/" ? "active" : ""}>
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link href="/shop" className={pathname === "/shop" ? "active" : ""}>
          <span className="nav-icon">🛍️</span>
          <span>Shop</span>
        </Link>
        <Link href="/cart" className={pathname === "/cart" ? "active" : ""} style={{ position: "relative" }}>
          <span className="nav-icon">🛒</span>
          <span>Cart</span>
          {count > 0 && <span className="nav-badge">{count}</span>}
        </Link>
        <Link href={isClient && state.clientUser ? "/orders" : "/login"} className={pathname === "/orders" || pathname === "/login" ? "active" : ""}>
          <span className="nav-icon">👤</span>
          <span>{isClient && state.clientUser ? "Account" : "Login"}</span>
        </Link>
      </div>

      <style jsx global>{`
        @media (min-width: 640px) {
          .logo-text {
            display: block !important;
          }
          .cart-text {
            display: inline !important;
          }
        }
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .cart-text, .user-name {
            display: inline !important;
          }
        }
        @media (max-width: 1023px) {
          .cart-text, .user-name {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}