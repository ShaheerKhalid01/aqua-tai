import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Google OAuth endpoint called');
    
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    
    console.log('Environment variables:', {
      GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID ? 'exists' : 'missing',
      GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET ? 'exists' : 'missing'
    });
    
    if (!GOOGLE_CLIENT_ID) {
      console.error('Google Client ID is missing');
      return NextResponse.json(
        { error: 'Google OAuth is not configured - missing client ID' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Google OAuth configuration
    const redirectUri = `${process.env.NODE_ENV === 'production' 
      ? 'https://your-app-domain.com/api/auth/google/callback' 
      : 'http://localhost:3000/api/auth/google/callback'}`;
    
    console.log('Redirect URI:', redirectUri);
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    const response = NextResponse.json({ url: authUrl.toString() });
    response.headers.set('Content-Type', 'application/json');
    console.log('Google OAuth URL generated:', authUrl.toString());
    
    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google OAuth: ' + error.message },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
