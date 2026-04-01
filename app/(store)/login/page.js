"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  
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
              alert(data.error || 'Login failed');
            }
          }).catch(() => alert('Login failed')).finally(() => setLoading(false));
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

        <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginBottom: 12 }}>
          Don't have an account? <Link href="/login" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600 }}>Register</Link>
        </p>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <span style={{ color: "#64748b", fontSize: 12 }}>OR</span>
        </div>
        
        <button 
          type="button"
          onClick={async () => {
            setLoading(true);
            try {
              // Try to use Google sign-in if available
              const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });
              
              // Check if response is valid JSON before parsing
              const contentType = response.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Google sign-in service unavailable');
              }
              
              const data = await response.json();
              
              if (response.ok && data.url) {
                // Redirect to Google OAuth
                window.location.href = data.url;
              } else {
                // Fallback to manual Google sign-in process
                alert('Google sign-in is being set up. Please try again in a few minutes or use email login.');
              }
            } catch (error) {
              console.error('Google sign-in error:', error);
              alert('Google sign-in temporarily unavailable. Please use email login.');
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

        <div style={{ textAlign: "center" }}>
          <Link href="/forgot-password" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
