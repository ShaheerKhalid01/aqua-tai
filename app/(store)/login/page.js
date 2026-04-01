"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Google OAuth callback
  useEffect(() => {
    // Check URL parameters for Google OAuth callback
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const googleAuthSuccess = urlParams.get('google_auth_success');
      const googleAuthError = urlParams.get('error');
      const email = urlParams.get('email');

      if (googleAuthSuccess === 'true' && email) {
        setSuccess(`Successfully signed in with Google! Welcome ${email}`);
        // In a real app, you would handle the token here
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else if (googleAuthError) {
        setError(`Google sign-in failed: ${googleAuthError.replace(/_/g, ' ')}`);
      }
    }
  }, [router]);
  
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #040d1a 0%, #0a2540 60%, #0d3060 100%)", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.18)", borderRadius: 20, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "Georgia, serif" }}>AQUA R.O Filter</div>
            <div style={{ color: "#00b4ff", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Pure Water Solutions</div>
          </Link>
        </div>

        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6, fontFamily: "Georgia, serif", color: "#00b4ff", textAlign: "center" }}>
          Welcome Back
        </h2>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24, textAlign: "center" }}>
          Sign in to your AQUA R.O Filter account.
        </p>

        {success && (
          <div style={{ 
            background: "rgba(34, 197, 94, 0.1)", 
            border: "1px solid rgba(34, 197, 94, 0.3)", 
            borderRadius: 8, 
            padding: "12px 16px", 
            marginBottom: 16, 
            color: "#22c55e", 
            fontSize: 13, 
            textAlign: "center" 
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            border: "1px solid rgba(239, 68, 68, 0.3)", 
            borderRadius: 8, 
            padding: "12px 16px", 
            marginBottom: 16, 
            color: "#ef4444", 
            fontSize: 13, 
            textAlign: "center" 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const email = formData.get('email');
          const password = formData.get('password');
          
          setLoading(true);
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          }).then(res => res.json()).then(data => {
            if (data.token) {
              localStorage.setItem('aquatai_token', data.token);
              localStorage.setItem('aquatai_user', JSON.stringify(data.user));
              window.location.href = '/';
            } else {
              setError(data.error || 'Login failed');
            }
          }).catch(() => {
            setError('Login failed');
          }).finally(() => setLoading(false));
        }}>
          <div style={{ marginBottom: 16 }}>
            <input 
              name="email"
              style={{ 
                width: "100%", 
                background: "rgba(255,255,255,0.05)", 
                border: "1px solid rgba(0,180,255,0.2)", 
                borderRadius: 10, 
                padding: "12px 16px", 
                color: "#fff", 
                fontSize: 14, 
                outline: "none" 
              }} 
              type="email" 
              placeholder="you@example.com" 
              required
            />
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <input 
              name="password"
              style={{ 
                width: "100%", 
                background: "rgba(255,255,255,0.05)", 
                border: "1px solid rgba(0,180,255,0.2)", 
                borderRadius: 10, 
                padding: "12px 16px", 
                color: "#fff", 
                fontSize: 14, 
                outline: "none" 
              }} 
              type="password" 
              placeholder="••••••" 
              required
            />
          </div>

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
              marginBottom: 16 
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <span style={{ color: "#64748b", fontSize: 12 }}>OR</span>
        </div>
        
        <button 
          type="button"
          onClick={async () => {
            setLoading(true);
            setError('');
            try {
              console.log('Attempting Google sign-in...');
              const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });
              
              console.log('Response status:', response.status);
              console.log('Response headers:', response.headers.get('content-type'));
              
              // Check if response is valid JSON before parsing
              const contentType = response.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                console.error('Invalid content type:', contentType);
                throw new Error('Google sign-in service unavailable');
              }
              
              const data = await response.json();
              console.log('Response data:', data);
              
              if (response.ok && data.url) {
                // Redirect to Google OAuth
                console.log('Redirecting to Google OAuth URL:', data.url);
                window.location.href = data.url;
              } else {
                // Fallback to manual Google sign-in process
                setError(data.error || 'Google sign-in is being set up. Please try again in a few minutes or use email login.');
              }
            } catch (error) {
              console.error('Google sign-in error:', error);
              setError('Google sign-in temporarily unavailable. Please use email login.');
            } finally {
              setLoading(false);
            }
          }}
          style={{ 
            width: "100%", 
            background: "#fff", 
            color: "#333", 
            border: "1px solid #e5e7eb", 
            padding: "12px 0", 
            borderRadius: 11, 
            fontWeight: 600, 
            fontSize: 14, 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: 10 
          }}
        >
          <span style={{ fontSize: 16 }}>🔗</span>
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginBottom: 12 }}>
          Don't have an account? <Link href="/login" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600 }}>Register</Link>
        </p>

        <div style={{ textAlign: "center" }}>
          <Link href="/forgot-password" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
