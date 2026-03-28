"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

const navItems = [
  { href: "/admin",            label: "Dashboard",  icon: "📊", color: "#0057a8" },
  { href: "/admin/products",   label: "Products",   icon: "📦", color: "#047857" },
  { href: "/admin/orders",     label: "Orders",     icon: "🛍️", color: "#7c3aed" },
  { href: "/admin/customers",  label: "Customers",  icon: "👥", color: "#b45309" },
  { href: "/admin/settings",   label: "Settings",   icon: "⚙️", color: "#64748b" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoginPage && !state.adminLoggedIn) router.replace("/admin/login");
  }, [state.adminLoggedIn, isLoginPage, hydrated]);

  if (isLoginPage) return <>{children}</>;

  if (!hydrated) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f9fc" }}>
      <div style={{ textAlign: "center" }}>
        <img src="/logo.jpeg" alt="" style={{ width: 60, height: 60, objectFit: "contain", marginBottom: 12 }} />
        <div style={{ color: "#94a3b8", fontSize: 14 }}>Loading...</div>
      </div>
    </div>
  );

  if (!state.adminLoggedIn) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f9fc" }}>
      <div style={{ color: "#94a3b8" }}>Redirecting...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fc", display: "flex", flexDirection: "column" }}>
      <AdminNavbar />
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 240, background: "#fff", borderRight: "2px solid #e8f0fe", flexShrink: 0, position: "sticky", top: 64, height: "calc(100vh - 64px)", overflowY: "auto" }}>
          <div style={{ padding: "20px 14px" }}>
            {/* Admin info */}
            <div style={{ background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: "#0057a8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>A</div>
                <div>
                  <div style={{ color: "#0057a8", fontWeight: 700, fontSize: 13 }}>Administrator</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>Aqua RO Water Filter</div>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, padding: "0 4px" }}>Main Menu</div>
              {navItems.map(item => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, marginBottom: 4, textDecoration: "none", background: active ? item.color : "transparent", color: active ? "#fff" : "#334155", fontWeight: active ? 700 : 500, fontSize: 14, transition: "all 0.2s", border: active ? "none" : "1px solid transparent" }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#f0f7ff"; e.currentTarget.style.color = item.color; }}}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#334155"; }}}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    {item.label}
                    {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />}
                  </Link>
                );
              })}
            </div>

            {/* Bottom */}
            <div style={{ borderTop: "1px solid #e8f0fe", paddingTop: 16, marginTop: 8 }}>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ color: "#047857", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>📞 Support</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>0304-2604217</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>068-2098583</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}