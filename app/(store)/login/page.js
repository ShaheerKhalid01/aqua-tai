"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setSuccess("Account created! Redirecting...");
      setTimeout(() => router.push("/"), 1000);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", marginTop: 6, transition: "border 0.2s" };
  const focusIn = (e) => e.target.style.border = "1px solid rgba(0,180,255,0.5)";
  const focusOut = (e) => e.target.style.border = "1px solid rgba(0,180,255,0.2)";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #040d1a 0%, #0a2540 60%, #0d3060 100%)", padding: "40px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,180,255,0.06) 0%, transparent 70%)", top: -100, right: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,204,0.07) 0%, transparent 70%)", bottom: -100, left: -100, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.jpeg" alt="AQUA R.O Filter" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 10 }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "Georgia, serif" }}>AQUA R.O Filter</div>
              <div style={{ color: "#00b4ff", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Pure Water Solutions</div>
            </div>
          </Link>
        </div>

        <div style={{ background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.18)", borderRadius: 20, padding: 36, boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: tab === t ? "linear-gradient(135deg,#00b4ff,#0066cc)" : "transparent", color: tab === t ? "#fff" : "#64748b", fontWeight: tab === t ? 700 : 400, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, fontFamily: "Georgia, serif", color: "#00b4ff" }}>
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>
            {tab === "login" ? "Sign in to your AQUA R.O Filter account." : "Join AQUA R.O Filter for a better experience."}
          </p>

          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}
          {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>✓ {success}</div>}

          {tab === "login" ? (
            <form onSubmit={handleLogin}>
              <label style={{ color: "#00b4ff", fontSize: 13 }}>Email Address</label>
              <input style={inputStyle} type="email" name="email" value={form.email} onChange={handle} required placeholder="you@example.com" onFocus={focusIn} onBlur={focusOut} />
              <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Password</label>
              <input style={inputStyle} type="password" name="password" value={form.password} onChange={handle} required placeholder="••••••••" onFocus={focusIn} onBlur={focusOut} />
              <button type="submit" disabled={loading}
                style={{ width: "100%", background: loading ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", padding: "13px 0", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 22 }}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <label style={{ color: "#00b4ff", fontSize: 13 }}>Full Name</label>
              <input style={inputStyle} type="text" name="name" value={form.name} onChange={handle} required placeholder="Your full name" onFocus={focusIn} onBlur={focusOut} />
              <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Email Address</label>
              <input style={inputStyle} type="email" name="email" value={form.email} onChange={handle} required placeholder="you@example.com" onFocus={focusIn} onBlur={focusOut} />
              <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Password</label>
              <input style={inputStyle} type="password" name="password" value={form.password} onChange={handle} required placeholder="Min. 6 characters" onFocus={focusIn} onBlur={focusOut} />
              <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Confirm Password</label>
              <input style={inputStyle} type="password" name="confirmPassword" value={form.confirmPassword} onChange={handle} required placeholder="Re-enter password" onFocus={focusIn} onBlur={focusOut} />
              <button type="submit" disabled={loading}
                style={{ width: "100%", background: loading ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", padding: "13px 0", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 22 }}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginTop: 20 }}>
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
              style={{ background: "none", border: "none", color: "#00b4ff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              {tab === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}