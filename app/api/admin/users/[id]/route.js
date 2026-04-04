import { NextResponse } from 'next/server';
import { deleteUser } from '@/lib/mongodb';

export async function DELETE(request, { params }) {
  try {
    // Extract ID from URL parameters
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    console.log('Delete request received');
    console.log('Full URL:', request.url);
    console.log('Path segments:', pathSegments);
    console.log('Extracted ID:', id);
    console.log('Params:', params);
    
    if (!id || id === '[id]') {
      console.log('Invalid ID detected');
      return NextResponse.json(
        { error: 'User ID is required', receivedId: id },
        { status: 400 }
      );
    }
    
    // Use the proper deleteUser function from the database
    const deleted = await deleteUser(id);
    console.log('Delete result:', deleted);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'User not found', searchedId: id },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer', details: error.message },
      { status: 500 }
    );
  }
}
