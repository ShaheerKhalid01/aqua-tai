"use client";
import { usePathname } from "next/navigation";
import "../globals.css";

export default function StoreLayout({ children }) {
  const pathname = usePathname();
  
  // Pages that should not show navbar
  const hideNavbarPages = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
  const shouldHideNavbar = hideNavbarPages.some(page => pathname.startsWith(page));

  return (
    <>
      {!shouldHideNavbar && (
        <div style={{ background: "linear-gradient(135deg, #0d3060 0%, #0a2540 100%)", padding: "1rem 2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "1.5rem", fontFamily: "Georgia, serif" }}>AQUA R.O Filter</div>
              <div style={{ color: "#00b4ff", fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase" }}>Pure Water Solutions</div>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <a href="/shop" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>Shop</a>
              <a href="/cart" style={{ color: "#fff", textDecoration: "none" }}>🛒 Cart</a>
              <a href="/login" style={{ color: "#fff", textDecoration: "none", fontWeight: "500" }}>👤 Login</a>
            </div>
          </div>
        </div>
      )}
      <main>{children}</main>
      {!shouldHideNavbar && (
        <div style={{ background: "#0a2540", color: "#fff", padding: "2rem", textAlign: "center" }}>
          <p>&copy; 2024 AQUA R.O Filter. All rights reserved.</p>
        </div>
      )}
    </>
  );
}