"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Get token from URL path (dynamic route parameter)
    const tokenParam = params.token;
    // Get email from query parameters
    const emailParam = searchParams.get("email");
    
    console.log('=== RESET PASSWORD DEBUG ===');
    console.log('Token from path:', tokenParam);
    console.log('Email from query:', emailParam);
    console.log('Full URL:', typeof window !== 'undefined' ? window.location.href : 'N/A');
    
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      console.log('✅ Parameters set successfully');
    } else {
      console.log('❌ Missing token or email parameter');
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams, params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log('=== PASSWORD RESET SUBMISSION ===');
      console.log('Token:', token);
      console.log('Email:', email);
      console.log('New password length:', newPassword.length);
      
      // Call simple password reset API
      const response = await fetch('/api/auth/reset-password-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: token,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setMessage("Password reset successfully! Redirecting to login...");
      console.log('✅ Password reset successful');
      
      // Redirect to login after successful reset
      setTimeout(() => {
        router.push('/login?reset=true');
      }, 2000);
      
    } catch (error) {
      console.error('❌ PASSWORD RESET ERROR:', error);
      console.error('❌ ERROR DETAILS:', {
        message: error.message,
        stack: error.stack,
        token: token,
        email: email,
        passwordLength: newPassword.length
      });
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <img src="/logo.jpeg" alt="Aqua R.O Water Filter" style={{ height: '60px', width: '60px', objectFit: 'contain', borderRadius: '8px' }} />
          <div style={{ marginLeft: '15px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0057a8', marginBottom: '5px' }}>Aqua R.O Water Filter</div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Password Reset</div>
          </div>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1f2937', fontSize: '24px' }}>Reset Password</h2>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
            ✅ {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500', fontSize: '14px' }}>Email Address</label>
            <input
              type="email"
              value={email}
              readOnly
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                fontSize: '14px',
                backgroundColor: '#f8fafc',
                color: '#6b7280',
                outline: 'none',
                transition: 'border 0.2s'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500', fontSize: '14px' }}>New Password (min. 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  backgroundColor: '#f8fafc',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'border 0.2s',
                  paddingRight: '45px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showNewPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500', fontSize: '14px' }}>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  backgroundColor: '#f8fafc',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'border 0.2s',
                  paddingRight: '45px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              backgroundColor: loading ? '#94a3b8' : '#0057a8', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
            Remember your password?{' '}
            <Link href="/login" style={{ color: '#0057a8', textDecoration: 'none', fontWeight: '600' }}>
              Sign In
            </Link>
          </div>
          
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#0057a8', textDecoration: 'none', fontWeight: '600' }}>
              Sign Up
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>
            <span style={{ color: '#0057a8' }}>📞 0304-2604217</span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            <span style={{ color: '#0057a8' }}>✉️ aquarowaterfilter@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
