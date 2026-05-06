"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNotifications } from '@/components/Notifications';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const { success, error } = useNotifications();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const router = useRouter();

  // Check if user is already logged in and redirect to home
  useEffect(() => {
    if (auth.state.clientUser) {
      console.log('User already logged in, redirecting to home...');
      router.replace('/');
      return;
    }
  }, [auth.state.clientUser, router]);

  useEffect(() => {
    const googleError = searchParams.get('error');
    if (googleError) {
      switch (googleError) {
        case 'google_auth_failed':
          error('Google sign-in was cancelled or failed');
          break;
        case 'no_code':
          error('Google sign-in failed - no authorization code received');
          break;
        case 'token_exchange_failed':
          error('Google sign-in failed - could not exchange authorization code');
          break;
        case 'callback_failed':
          error('Google sign-in failed - server error occurred');
          break;
        default:
          error('Google sign-in failed');
      }
    }
  }, [searchParams, error]);

  const handleSubmit = (e) => {
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
        success('Login successful! Welcome back!');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        error(data.error || 'Login failed');
      }
    }).catch(() => {
      error('Login failed. Please try again.');
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f5f8ff 0%, #e8f0fe 100%)", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#fff", border: "1px solid #e8f0fe", borderRadius: 20, padding: "32px 24px", boxShadow: "0 8px 32px rgba(0,87,168,0.08)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/logo.jpeg" alt="Aqua R.O" style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 12, margin: "0 auto 12px" }} />
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4, color: "#1a1a2e" }}>
            Welcome Back
          </h2>
          <p style={{ color: "#64748b", fontSize: 13 }}>
            Sign in to your AQUA R.O Filter account.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#0057a8", fontSize: 13, fontWeight: 600 }}>Email</label>
            <input
              type="email"
              name="email"
              required
              style={{ width: "100%", background: "#f7f9fc", border: "1px solid #e8f0fe", borderRadius: 10, padding: "12px 16px", color: "#1a1a2e", fontSize: 15, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, color: "#0057a8", fontSize: 13, fontWeight: 600 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                style={{ width: "100%", background: "#f7f9fc", border: "1px solid #e8f0fe", borderRadius: 10, padding: "12px 16px", color: "#1a1a2e", fontSize: 15, outline: "none" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#0057a8",
              color: "#fff",
              border: "none",
              padding: "13px 0",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              marginTop: 4
            }}
          >
            Sign In →
          </button>

          <div style={{ textAlign: "center", fontSize: 13, color: "#64748b" }}>
            Don't have an account? <a href="/register" style={{ color: "#0057a8", textDecoration: "none", fontWeight: 600 }}>Register</a>
          </div>
        </form>

        <div style={{ textAlign: "center", margin: "20px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#e8f0fe" }} />
          <span style={{ color: "#94a3b8", fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#e8f0fe" }} />
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
                error(data.error || 'Google sign-in temporarily unavailable');
              }
            } catch (error) {
              console.error('Google sign-in error:', error);
              error('Google sign-in temporarily unavailable');
            }
          }}
          style={{
            width: "100%",
            background: "#fff",
            color: "#333",
            border: "1px solid #e8f0fe",
            padding: "12px 0",
            borderRadius: 10,
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
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/forgot-password" style={{ color: "#0057a8", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#0057a8" }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
