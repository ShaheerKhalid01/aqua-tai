"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, Suspense } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationSent, setShowVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setSuccess("Email verified successfully! You can now login.");
    }
  }, [searchParams]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const login = async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("aquatai_token", data.token);
      localStorage.setItem("aquatai_user", JSON.stringify(data.user));
      return data;
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Registration failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password);
      setSuccess(data.message);
      setVerificationEmail(form.email);
      setShowVerificationSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "User",
          email: verificationEmail,
          password: "temp123",
          resendVerification: true
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.alreadyVerified) {
          setSuccess("Your email is already verified! You can login.");
          setTimeout(() => {
            setShowVerificationSent(false);
            setTab("login");
          }, 2000);
        } else {
          setSuccess(data.message);
        }
      } else {
        setError(data.error || "Failed to resend verification email.");
      }
    } catch (err) {
      setError("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", marginTop: 6, transition: "border 0.2s" };

  if (showVerificationSent) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #040d1a 0%, #0a2540 60%, #0d3060 100%)", padding: "40px 16px" }}>
        <div style={{ width: "100%", maxWidth: 460, background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.18)", borderRadius: 20, padding: 36 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <img src="/logo.jpeg" alt="AQUA R.O Filter" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 10 }} />
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "Georgia, serif" }}>AQUA R.O Filter</div>
                <div style={{ color: "#00b4ff", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Pure Water Solutions</div>
              </div>
            </Link>
          </div>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h2 style={{ color: "#10b981", fontWeight: 800, fontSize: 24, marginBottom: 8, fontFamily: "Georgia, serif" }}>Check Your Email!</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              We've sent a verification link to:<br/>
              <strong style={{ color: "#00b4ff" }}>{verificationEmail}</strong>
            </p>
          </div>

          {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}> {success}</div>}

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button onClick={handleResendVerification} disabled={loading} style={{ background: loading ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", marginRight: 10 }}>
              {loading ? "Sending..." : "Resend Email"}
            </button>
            <button onClick={() => { setShowVerificationSent(false); setTab("login"); setError(""); setSuccess(""); }} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #040d1a 0%, #0a2540 60%, #0d3060 100%)", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 460, background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.18)", borderRadius: 20, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.jpeg" alt="AQUA R.O Filter" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 10 }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "Georgia, serif" }}>AQUA R.O Filter</div>
              <div style={{ color: "#00b4ff", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Pure Water Solutions</div>
            </div>
          </Link>
        </div>

        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {["login", "register"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: tab === t ? "linear-gradient(135deg,#00b4ff,#0066cc)" : "transparent", color: tab === t ? "#fff" : "#64748b", fontWeight: tab === t ? 700 : 400, fontSize: 14, cursor: "pointer" }}>
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

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}> {error}</div>}
        {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}> {success}</div>}

        {tab === "login" ? (
          <form onSubmit={handleSubmit}>
            <label style={{ color: "#00b4ff", fontSize: 13 }}>Email Address</label>
            <input style={inputStyle} type="email" name="email" value={form.email} onChange={handle} required placeholder="you@example.com" />
            <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input style={inputStyle} type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handle} required placeholder="••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}>
                {showPassword ? "👁" : "👁"}
              </button>
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", padding: "13px 0", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 22 }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <label style={{ color: "#00b4ff", fontSize: 13 }}>Full Name</label>
            <input style={inputStyle} type="text" name="name" value={form.name} onChange={handle} required placeholder="Your full name" />
            <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Email Address</label>
            <input style={inputStyle} type="email" name="email" value={form.email} onChange={handle} required placeholder="you@example.com" />
            <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input style={inputStyle} type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handle} required placeholder="Min. 6 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}>
                {showPassword ? "👁" : "👁"}
              </button>
            </div>
            <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input style={inputStyle} type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handle} required placeholder="Re-enter password" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}>
                {showConfirmPassword ? "👁" : "👁"}
              </button>
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg,#00b4ff,#0066cc)", color: "#fff", border: "none", padding: "13px 0", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 22 }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginTop: 20 }}>
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#00b4ff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            {tab === "login" ? "Register" : "Sign In"}
          </button>
        </p>

        {tab === "login" && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Link href="/forgot-password" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
              Forgot Password?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #040d1a 0%, #0a2540 60%, #0d3060 100%)", color: "#fff", fontSize: 16 }}>Loading login page...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
