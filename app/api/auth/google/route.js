import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { GOOGLE_CLIENT_ID } = process.env;
    
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { error: 'Google OAuth is not configured' },
        { status: 500 }
      );
    }

    // Google OAuth configuration
    const redirectUri = `${process.env.NODE_ENV === 'production' 
      ? 'https://your-app-domain.com/api/auth/google/callback' 
      : 'http://localhost:3000/api/auth/google/callback'}`;
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    return NextResponse.json({ url: authUrl.toString() });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    );
  }
}
