"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const { adminLogout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    adminLogout();
    router.replace("/admin/login");
  };

  return (
    <nav style={{ background: "linear-gradient(135deg, #030a15 0%, #060f22 100%)", borderBottom: "1px solid rgba(0,180,255,0.15)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #00b4ff, #0066cc)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💧</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia, serif", letterSpacing: 0.5 }}>AquaTai</div>
          <div style={{ color: "#00b4ff", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Admin Panel</div>
        </div>
      </div>

      {/* Center — breadcrumb label */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,180,255,0.07)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 8, padding: "5px 14px" }}>
        <span style={{ fontSize: 14 }}>🔐</span>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Admin Dashboard</span>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/" target="_blank"
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 8, padding: "7px 14px", color: "#94a3b8", textDecoration: "none", fontSize: 13 }}>
          🌐 View Store
        </Link>
        <button onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "7px 14px", color: "#ef4444", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}