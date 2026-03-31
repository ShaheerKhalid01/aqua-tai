"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { login } = useAuth();
  
  const [status, setStatus] = useState("loading"); // loading, success, error, already-verified
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get('email');
      const token = params.token; // Get token from URL path

      if (!email || !token) {
        setStatus("error");
        setMessage("Invalid verification link. Please request a new verification email.");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email/${token}?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationComplete(true);
          if (data.alreadyVerified) {
            setStatus("already-verified");
            setMessage(data.message);
          } else {
            setStatus("success");
            setMessage(data.message);
            
            // Auto-login if token provided
            if (data.token) {
              try {
                await login(email, ""); // This won't actually login, but we'll handle it differently
                // For now, just redirect to login
                setTimeout(() => {
                  router.push("/login?verified=true");
                }, 2000);
              } catch (error) {
                // If auto-login fails, just redirect to login
                setTimeout(() => {
                  router.push("/login?verified=true");
                }, 2000);
              }
            }
          }
        } else {
          // Only set error if verification is not complete
          if (!verificationComplete) {
            setStatus("error");
            setMessage(data.error || "Email verification failed");
            setTimeout(() => setShowError(true), 500);
          }
        }
      } catch (error) {
        // Only set error if verification is not complete
        if (!verificationComplete) {
          setStatus("error");
          setMessage("An error occurred during verification. Please try again.");
          setTimeout(() => setShowError(true), 500);
        }
      }
    };

    verifyEmail();
  }, [searchParams, router, login]);

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", marginTop: 6, transition: "border 0.2s" };

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
            {status === "loading" && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                <h2 style={{ color: "#00b4ff", fontWeight: 800, fontSize: 24, marginBottom: 8, fontFamily: "Georgia, serif" }}>Verifying Email...</h2>
                <p style={{ color: "#64748b", fontSize: 14 }}>Please wait while we verify your email address.</p>
              </>
            )}
            
            {status === "success" && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h2 style={{ color: "#10b981", fontWeight: 800, fontSize: 24, marginBottom: 8, fontFamily: "Georgia, serif" }}>Email Verified!</h2>
                <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>{message}</p>
                <p style={{ color: "#94a3b8", fontSize: 12 }}>Redirecting to login page...</p>
              </>
            )}
            
            {status === "already-verified" && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>ℹ️</div>
                <h2 style={{ color: "#f59e0b", fontWeight: 800, fontSize: 24, marginBottom: 8, fontFamily: "Georgia, serif" }}>Already Verified</h2>
                <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>{message}</p>
              </>
            )}
            
            {status === "error" && showError && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
                <h2 style={{ color: "#ef4444", fontWeight: 800, fontSize: 24, marginBottom: 8, fontFamily: "Georgia, serif" }}>Verification Failed</h2>
                <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>{message}</p>
              </>
            )}
          </div>

          {(status === "success" || status === "already-verified" || (status === "error" && showError)) && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Link 
                href="/login"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg,#00b4ff,#0066cc)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  transition: "all 0.2s ease"
                }}
              >
                Go to Login
              </Link>
              
              {status === "error" && showError && (
                <div style={{ marginTop: 16 }}>
                  <Link 
                    href="/forgot-password"
                    style={{
                      color: "#00b4ff",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600
                    }}
                  >
                    Request New Verification Email
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
