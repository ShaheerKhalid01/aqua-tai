"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");
    
    if (!tokenParam || !emailParam) {
      setError("Invalid reset link. Please request a new password reset.");
      setIsTokenValid(false);
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { 
    width: "100%", 
    background: "rgba(255,255,255,0.05)", 
    border: "1px solid rgba(0,180,255,0.2)", 
    borderRadius: 10, 
    padding: "12px 16px", 
    color: "#fff", 
    fontSize: 14, 
    outline: "none", 
    marginTop: 6,
    transition: "border 0.2s" 
  };

  const focusIn = (e) => e.target.style.border = "1px solid rgba(0,180,255,0.5)";
  const focusOut = (e) => e.target.style.border = "1px solid rgba(0,180,255,0.2)";

  if (!isTokenValid) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #040d1a 0%, #0a2540 60%, #0d3060 100%)", padding: "40px 16px" }}>
        <div style={{ textAlign: "center", background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.18)", borderRadius: 20, padding: 40, maxWidth: 400 }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>❌</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#ef4444", marginBottom: 12 }}>Invalid Reset Link</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            {error}
          </p>
          <Link 
            href="/forgot-password" 
            style={{ background: "linear-gradient(135deg, #00b4ff, #0066cc)", color: "#fff", padding: "14px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15, display: "inline-block" }}
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

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
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔐</div>
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, fontFamily: "Georgia, serif", color: "#00b4ff" }}>
              Reset Password
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>
              Enter your new password below.
            </p>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              ⚠ {error}
            </div>
          )}

          {message && (
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              ✓ {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={{ color: "#00b4ff", fontSize: 13 }}>New Password</label>
            <input 
              style={inputStyle} 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              placeholder="Enter new password (min. 6 characters)"
              onFocus={focusIn} 
              onBlur={focusOut} 
            />

            <label style={{ color: "#00b4ff", fontSize: 13, display: "block", marginTop: 14 }}>Confirm New Password</label>
            <input 
              style={inputStyle} 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Confirm new password"
              onFocus={focusIn} 
              onBlur={focusOut} 
            />

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: "100%", 
                background: loading ? "rgba(0,180,255,0.4)" : "linear-gradient(135deg,#00b4ff,#0066cc)", 
                color: "#fff", 
                border: "none", 
                padding: "13px 0", 
                borderRadius: 11, 
                fontWeight: 700, 
                fontSize: 15, 
                cursor: loading ? "not-allowed" : "pointer", 
                marginTop: 22,
                transition: "background 0.2s" 
              }}
            >
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link 
              href="/login" 
              style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600, fontSize: 13 }}
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
