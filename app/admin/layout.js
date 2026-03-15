"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🛍️" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  // Wait for client hydration before checking auth
  useEffect(() => { setHydrated(true); }, []);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!hydrated) return; // don't redirect until hydrated
    if (!isLoginPage && !state.adminLoggedIn) {
      router.replace("/admin/login");
    }
  }, [state.adminLoggedIn, isLoginPage, hydrated]);

  // Login page — bare, no navbar/sidebar
  if (isLoginPage) return <>{children}</>;

  // Show loading spinner until hydrated to prevent flash
  if (!hydrated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#040d1a" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💧</div>
          <div style={{ color: "#64748b", fontSize: 14 }}>Loading...</div>
        </div>
      </div>
    );
  }

  // Not logged in after hydration — show redirect message
  if (!state.adminLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#040d1a" }}>
        <div style={{ color: "#64748b", fontSize: 14 }}>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#06101e", display: "flex", flexDirection: "column" }}>
      {/* Admin Navbar */}
      <AdminNavbar />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 230, background: "#030a15", borderRight: "1px solid rgba(0,180,255,0.12)", flexShrink: 0, position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto" }}>
          <div style={{ padding: "20px 14px" }}>
            {/* Admin badge */}
            <div style={{ padding: "10px 14px", background: "rgba(0,180,255,0.06)", borderRadius: 10, marginBottom: 20, border: "1px solid rgba(0,180,255,0.1)" }}>
              <div style={{ color: "#00b4ff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Logged in as</div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginTop: 3 }}>
                {process.env.NEXT_PUBLIC_ADMIN_ID || "admin"}
              </div>
            </div>

            {/* Nav items */}
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, marginBottom: 4, textDecoration: "none", background: active ? "linear-gradient(135deg, rgba(0,180,255,0.15), rgba(0,102,204,0.1))" : "transparent", border: active ? "1px solid rgba(0,180,255,0.25)" : "1px solid transparent", color: active ? "#00b4ff" : "#94a3b8", fontWeight: active ? 700 : 400, fontSize: 14, transition: "all 0.2s" }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(0,180,255,0.05)"; e.currentTarget.style.color = "#fff"; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}}>
                  <span style={{ fontSize: 17 }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowX: "hidden" }}>{children}</main>
      </div>
    </div>
  );
}