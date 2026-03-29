"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await adminLogin(form.id, form.password);
      router.push("/admin");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", color: "#1a1a2e", fontSize: 14, outline: "none", marginTop: 6, transition: "border 0.2s" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/logo.jpeg" alt="AQUA R.O Filter" style={{ width: 70, height: 70, objectFit: "contain", borderRadius: 16, marginBottom: 12, boxShadow: "0 4px 20px rgba(0,87,168,0.15)" }} />
          <div style={{ color: "#0057a8", fontWeight: 900, fontSize: 22 }}>AQUA R.O Filter</div>
          <div style={{ color: "#94a3b8", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>Admin Portal</div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 8px 40px rgba(0,87,168,0.12)", border: "1px solid #e8f0fe" }}>
          {/* Restricted badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 14px", marginBottom: 24 }}>
            <span style={{ fontSize: 20 }}>🔐</span>
            <div>
              <div style={{ color: "#c2410c", fontWeight: 700, fontSize: 13 }}>Restricted Access</div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>Authorized personnel only</div>
            </div>
          </div>

          <h2 style={{ fontWeight: 900, fontSize: 22, color: "#1a1a2e", marginBottom: 6 }}>Admin Sign In</h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>Enter your credentials to access the dashboard.</p>

          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={{ color: "#475569", fontSize: 13, fontWeight: 600 }}>Admin ID</label>
            <input style={inputStyle} type="text" name="id" value={form.id} onChange={handle} required placeholder="Enter admin ID"
              onFocus={e => e.target.style.border = "2px solid #0057a8"}
              onBlur={e => e.target.style.border = "2px solid #e2e8f0"} />

            <div style={{ marginTop: 16, position: "relative" }}>
              <label style={{ color: "#475569", fontSize: 13, fontWeight: 600 }}>Password</label>
              <input style={inputStyle} type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handle} required placeholder="••••••••"
                onFocus={e => e.target.style.border = "2px solid #0057a8"}
                onBlur={e => e.target.style.border = "2px solid #e2e8f0"} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 14, bottom: 12, background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "#93c5fd" : "#0057a8", color: "#fff", border: "none", padding: "13px 0", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 22, transition: "background 0.2s" }}>
              {loading ? "Verifying..." : "Sign In to Admin Panel →"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, marginTop: 20 }}>
            Not admin?{" "}
            <Link href="/login" style={{ color: "#0057a8", textDecoration: "none", fontWeight: 600 }}>Customer Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}