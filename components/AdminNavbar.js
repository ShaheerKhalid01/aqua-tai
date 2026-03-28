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
    <nav style={{ background: "#fff", borderBottom: "2px solid #e8f0fe", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 8px rgba(0,87,168,0.08)" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/logo.jpeg" alt="AQUA R.O Filter" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 8 }} />
        <div>
          <div style={{ color: "#0057a8", fontWeight: 900, fontSize: 16 }}>AQUA R.O Filter</div>
          <div style={{ color: "#94a3b8", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Admin Panel</div>
        </div>
      </div>

      {/* Center badge */}
      <div style={{ background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "6px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
        <span style={{ color: "#0057a8", fontSize: 13, fontWeight: 600 }}>Admin Dashboard</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/" target="_blank"
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "7px 14px", color: "#0057a8", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
          🌐 View Store
        </Link>
        <button onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "7px 14px", color: "#dc2626", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}