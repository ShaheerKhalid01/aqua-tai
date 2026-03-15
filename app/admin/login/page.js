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
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", marginTop: 6, transition: "border 0.2s" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #020810 0%, #060f20 60%, #0a1830 100%)", padding: "40px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,180,255,0.04) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #00b4ff, #0066cc)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💧</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "Georgia, serif" }}>AquaTai</div>
              <div style={{ color: "#00b4ff", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Admin Portal</div>
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(145deg, #0a1e35, #070f22)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 20, padding: 36, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,180,255,0.06)", border: "1px solid rgba(0,180,255,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 24 }}>
            <span style={{ fontSize: 20 }}>🔐</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Restricted Access</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>Authorized personnel only</div>
            </div>
          </div>

          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, fontFamily: "Georgia, serif" }}>Admin Sign In</h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>Enter your admin credentials to continue.</p>

          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={{ color: "#94a3b8", fontSize: 13 }}>Admin ID</label>
            <input style={inputStyle} type="text" name="id" value={form.id} onChange={handle} required placeholder="Enter admin ID" autoComplete="off"
              onFocus={e => e.target.style.border = "1px solid rgba(0,180,255,0.5)"}
              onBlur={e => e.target.style.border = "1px solid rgba(0,180,255,0.2)"} />

            <div style={{ marginTop: 16, position: "relative" }}>
              <label style={{ color: "#94a3b8", fontSize: 13 }}>Password</label>
              <input style={inputStyle} type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handle} required placeholder="••••••••"
                onFocus={e => e.target.style.border = "1px solid rgba(0,180,255,0.5)"}
                onBlur={e => e.target.style.border = "1px solid rgba(0,180,255,0.2)"} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 14, bottom: 12, background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", padding: "13px 0", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? "Verifying..." : "Sign In to Admin Panel →"}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ color: "#475569", fontSize: 11, textAlign: "center" }}>
              Credentials are stored in <code style={{ color: "#64748b", background: "rgba(255,255,255,0.05)", padding: "1px 5px", borderRadius: 3 }}>.env.local</code>
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#334155", fontSize: 12, marginTop: 20 }}>
          Not admin?{" "}
          <Link href="/login" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600 }}>Customer Login</Link>
        </p>
      </div>
    </div>
  );
}