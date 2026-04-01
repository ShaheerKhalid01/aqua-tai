import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/mongodb';

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
    
    // Get all users
    const users = await getAllUsers();
    console.log('Total users found:', users.length);
    console.log('User IDs:', users.map(u => ({ _id: u._id, email: u.email })));
    
    // Find the user to delete (check both _id and id fields)
    const userIndex = users.findIndex(user => user._id === id || user.id === id);
    console.log('User found at index:', userIndex);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found', searchedId: id },
        { status: 404 }
      );
    }
    
    // Remove the user from the array
    const deletedUser = users[userIndex];
    console.log('Deleting user:', deletedUser.email);
    users.splice(userIndex, 1);
    
    // Update the database (this is a simplified approach for file-based storage)
    // In a real MongoDB setup, you'd use a proper delete function
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    
    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      dbData.users = users;
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      console.log('Database updated successfully');
    } catch (error) {
      console.error('Error updating database:', error);
      return NextResponse.json(
        { error: 'Failed to update database' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully',
      deletedUser: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      }
    });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
