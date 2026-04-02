import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUser, createUser } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } = process.env;
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Google OAuth is not configured' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://aqua-tai.vercel.app' 
      : 'http://localhost:3000';

    if (error) {
      return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
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
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange_failed`);
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Check if user exists in database
    let existingUser = await findUser(userData.email);
    
    if (!existingUser) {
      // Create new user
      existingUser = await createUser({
        name: userData.name,
        email: userData.email,
        password: 'google_oauth_user', // Placeholder password
        role: 'client',
        emailVerified: userData.verified_email || true,
        avatar: userData.picture
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: existingUser._id, 
        email: existingUser.email, 
        role: existingUser.role 
      },
      JWT_SECRET || 'aquatai_fallback_secret',
      { expiresIn: '7d' }
    );

    // Create response with token
    const response = NextResponse.redirect(`${baseUrl}/`);
    
    // Prepare user data for localStorage
    const userDataForStorage = {
      id: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role
    };
    
    // Set secure cookies
    response.cookies.set('aquatai_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    response.cookies.set('aquatai_user', JSON.stringify(userDataForStorage), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Also set localStorage via redirect URL parameters for immediate detection
    const userDataParam = encodeURIComponent(JSON.stringify(userDataForStorage));
    const tokenParam = encodeURIComponent(token);
    const redirectUrlWithAuth = `${baseUrl}/?auth_success=true&user=${userDataParam}&token=${tokenParam}`;

    return NextResponse.redirect(redirectUrlWithAuth);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://aqua-tai.vercel.app' 
      : 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/login?error=callback_failed`);
  }
}
