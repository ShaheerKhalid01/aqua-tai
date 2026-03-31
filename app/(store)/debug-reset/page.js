"use client";
import { useSearchParams } from "next/navigation";

export default function DebugResetPage() {
  const searchParams = useSearchParams();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Reset Password Debug Info</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>URL Parameters:</h2>
        <div><strong>Full URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
        <div><strong>Token:</strong> {searchParams.get("token") || 'NOT FOUND'}</div>
        <div><strong>Email:</strong> {searchParams.get("email") || 'NOT FOUND'}</div>
        <div><strong>All Params:</strong> {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}</div>
      </div>

      <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Test Actions:</h2>
        <button 
          onClick={() => window.location.href = '/reset-password/TEST1234567890123456789012?email=fresh@test.com'}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test with Valid Token
        </button>
        
        <button 
          onClick={() => window.location.href = '/reset-password/INVALID?email=test@test.com'}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test with Invalid Token
        </button>
      </div>

      <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
        <h2>📋 Instructions:</h2>
        <ol>
          <li>Check if URL parameters are correctly extracted</li>
          <li>Test with valid token to see if form works</li>
          <li>Test with invalid token to see error handling</li>
          <li>Use browser console to debug issues</li>
        </ol>
      </div>
    </div>
  );
}
