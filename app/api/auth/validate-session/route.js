import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const sessionData = await validateSession(token);
    
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Session invalid or expired' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: sessionData.user
    });
    
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Session validation failed' },
      { status: 500 }
    );
  }
}
