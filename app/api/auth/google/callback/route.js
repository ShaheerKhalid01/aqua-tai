import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Google OAuth is not configured' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NODE_ENV === 'production' 
          ? 'https://your-app-domain.com/login?error=google_auth_failed' 
          : 'http://localhost:3000/login?error=google_auth_failed'}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NODE_ENV === 'production' 
          ? 'https://your-app-domain.com/login?error=no_code' 
          : 'http://localhost:3000/login?error=no_code'}`
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/api/auth/google/callback',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.redirect(
        `${process.env.NODE_ENV === 'production' 
          ? 'https://your-app-domain.com/login?error=token_exchange_failed' 
          : 'http://localhost:3000/login?error=token_exchange_failed'}`
      );
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create or update user record
    // 3. Create JWT token for your app
    // 4. Redirect back to your app with the token

    // For now, we'll create a simple response
    const userInfo = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      verified: userData.verified_email
    };

    // Redirect to login page with user info (in production, you'd set cookies/tokens)
    const redirectUrl = `${process.env.NODE_ENV === 'production' 
      ? 'https://your-app-domain.com/login?google_auth_success=true&email=' + encodeURIComponent(userData.email)
      : 'http://localhost:3000/login?google_auth_success=true&email=' + encodeURIComponent(userData.email)}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NODE_ENV === 'production' 
        ? 'https://your-app-domain.com/login?error=callback_failed' 
        : 'http://localhost:3000/login?error=callback_failed'}`
    );
  }
}
