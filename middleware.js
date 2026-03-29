import { NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/lib/security';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Add security headers to all responses
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
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
