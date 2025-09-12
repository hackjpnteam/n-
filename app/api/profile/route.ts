import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, updateUserProfile } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  console.log('Profile API endpoint reached - PUT request');
  try {
    // Get auth token from cookie
    const authToken = request.cookies.get('auth-token')?.value;
    console.log('Auth token found:', !!authToken);
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from session
    const user = getUserFromSession(authToken);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get profile data from request
    const profileData = await request.json();
    console.log('Received profile data:', profileData);
    const { name, company, position, companyUrl, bio, avatarUrl } = profileData;

    // Update user profile
    const updatedUser = updateUserProfile(user.id, {
      name,
      company,
      position,
      companyUrl,
      bio,
      avatarUrl
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Return updated user (without password hash)
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}