import { NextResponse } from 'next/server';
import { addSecurityHeaders } from '@/lib/security';

// Global middleware to add security headers to all API responses
export function middleware(request) {
  const response = NextResponse.next();
  
  // Add security headers to all responses
  const headers = addSecurityHeaders(response);
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    const httpsUrl = `https://${request.headers.get('host')}${request.nextUrl.pathname}`;
    return NextResponse.redirect(httpsUrl);
  }
  
  return response;
}

// Apply to all API routes
export const config = {
  matcher: '/api/:path*',
};
