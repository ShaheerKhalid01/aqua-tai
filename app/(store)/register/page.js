"use client";
import { useState } from 'react';
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
          Create Account
        </h2>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24, textAlign: "center" }}>
          Sign up to get started with AQUA R.O Filter.
        </p>

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get('name');
          const email = formData.get('email');
          const password = formData.get('password');
          const confirmPassword = formData.get('confirmPassword');
          
          // Simple validation
          if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
          }
          
          if (name && email && password) {
            // Real registration logic
            fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, password })
            }).then(res => res.json()).then(data => {
              if (data.user) {
                alert(data.message || 'Registration successful! Please check your email for verification.');
                window.location.href = '/login';
              } else {
                alert(data.error || 'Registration failed');
              }
            }).catch((error) => {
              console.error('Registration error:', error);
              alert('Registration failed');
            });
          }
        }}>
          <div style={{ marginBottom: 16 }}>
            <input 
              name="name"
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
              type="text" 
              placeholder="Full Name" 
              required
            />
          </div>
          
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
          
          <div style={{ marginBottom: 16, position: "relative" }}>
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
                outline: "none",
                paddingRight: "45px"
              }} 
              type={showPassword ? "text" : "password"}
              placeholder="••••••" 
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#00b4ff",
                cursor: "pointer",
                fontSize: "14px",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div style={{ marginBottom: 24, position: "relative" }}>
            <input 
              name="confirmPassword"
              style={{ 
                width: "100%", 
                background: "rgba(255,255,255,0.05)", 
                border: "1px solid rgba(0,180,255,0.2)", 
                borderRadius: 10, 
                padding: "12px 16px", 
                color: "#fff", 
                fontSize: 14, 
                outline: "none",
                paddingRight: "45px"
              }} 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password" 
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#00b4ff",
                cursor: "pointer",
                fontSize: "14px",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <button 
              type="submit"
              style={{ 
                flex: 1,
                background: "linear-gradient(135deg,#00b4ff,#0066cc)", 
                color: "#fff", 
                border: "none", 
                padding: "13px 0", 
                borderRadius: 11, 
                fontWeight: 700, 
                fontSize: 15, 
                cursor: "pointer" 
              }}
            >
              Sign Up →
            </button>
            <span style={{ color: "#64748b", fontSize: 13 }}>
              Already have an account? <Link href="/login" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600 }}>Login</Link>
            </span>
          </div>
        </form>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <span style={{ color: "#64748b", fontSize: 12 }}>OR</span>
        </div>
        
        <button 
          type="button"
          onClick={() => {
            alert('Google sign-up would work here');
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: 12, marginBottom: 8 }}>
            By creating an account, you agree to our
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <Link href="/terms" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600, fontSize: 12 }}>
              Terms of Service
            </Link>
            <span style={{ color: "#64748b", fontSize: 12 }}>and</span>
            <Link href="/privacy" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600, fontSize: 12 }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
