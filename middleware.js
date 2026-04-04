import { NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/lib/security';
import { validateSessionEdge } from '@/lib/edge-session';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Add security headers to all responses
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Skip session validation for these routes
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/google', '/api/auth/google/callback', '/admin'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Skip session validation for static files
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/favicon');
  
  if (!isPublicPath && !isStaticFile) {
    // Check for Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      try {
        const sessionData = await validateSessionEdge(token);
        
        if (!sessionData || !sessionData.valid) {
          // Session is invalid or expired
          console.log(`🚫 Invalid session detected: ${token.substring(0, 10)}...`);
          
          // Return 401 with clear auth instruction
          return NextResponse.json(
            { error: 'Session expired. Please log in again.' },
            { status: 401, headers: { 'Clear-Auth': 'true' } }
          );
        }
      } catch (error) {
        console.error('Session validation error:', error);
      }
    }
  }
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    const httpsUrl = `https://${request.headers.get('host')}${request.nextUrl.pathname}`;
    return NextResponse.redirect(httpsUrl);
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
