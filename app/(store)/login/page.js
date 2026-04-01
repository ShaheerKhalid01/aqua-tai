"use client";

import { useState } from 'react';
import { useNotification } from '@/context/NotificationContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { addNotification } = useNotification();
  
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #040d1a 0%, #0a2540 60%, #0d3060 100%)", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "linear-gradient(145deg, #0d2545, #0a1e35)", border: "1px solid rgba(0,180,255,0.18)", borderRadius: 20, padding: 36 }}>
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
          
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          }).then(res => res.json()).then(data => {
            if (data.token) {
              localStorage.setItem('aquatai_token', data.token);
              localStorage.setItem('aquatai_user', JSON.stringify(data.user));
              addNotification('Login successful! Welcome back!', 'success', 3000);
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            } else {
              addNotification(data.error || 'Login failed', 'error', 5000);
            }
          }).catch(() => {
            addNotification('Login failed. Please try again.', 'error', 5000);
          });
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
          
          <div style={{ marginBottom: 24, position: "relative" }}>
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
              Sign In →
            </button>
            <span style={{ color: "#64748b", fontSize: 13 }}>
              Don't have an account? <a href="/register" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600 }}>Register</a>
            </span>
          </div>
        </form>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <span style={{ color: "#64748b", fontSize: 12 }}>OR</span>
        </div>
        
        <button 
          type="button"
          onClick={async () => {
            try {
              const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });
              
              const data = await response.json();
              
              if (response.ok && data.url) {
                window.location.href = data.url;
              } else {
                alert('Google sign-in temporarily unavailable');
              }
            } catch (error) {
              alert('Google sign-in temporarily unavailable');
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: "center" }}>
          <a href="/forgot-password" style={{ color: "#00b4ff", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}
