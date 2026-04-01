import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/mongodb';

export async function GET() {
  try {
    // Get all users from database
    const users = await getAllUsers();
    
    // Transform user data for display
    const transformedUsers = users.map(user => ({
      id: user._id,
      name: user.name || 'Unknown',
      email: user.email,
      city: user.city || '—',
      orders: user.orders || 0,
      spent: user.spent || 0,
      lastOrder: user.lastOrder || '—',
      emailVerified: user.emailVerified || false,
      role: user.role || 'client',
      createdAt: user.createdAt || '—'
    }));
    
    return NextResponse.json({
      success: true,
      users: transformedUsers
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
