import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, updateUserProfile } from '@/lib/session';


export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('Profile API endpoint reached - GET request');
  try {
    // Get current user from session
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Return user profile (without password hash)
    const { passwordHash, ...userWithoutPassword } = user as any;
    return NextResponse.json({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  console.log('Profile API endpoint reached - PUT request');
  try {
    // Get current user from session
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get profile data from request
    const profileData = await request.json();
    console.log('Received profile data:', profileData);

    // Update user profile
    const updatedUser = await updateUserProfile(user.id, profileData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    console.log('✅ Profile updated in file system');

    // Return updated user (without password hash)
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}