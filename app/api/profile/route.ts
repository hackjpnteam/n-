import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, updateUserProfile } from '@/lib/session';
import { verifyAuthSimple } from '@/lib/auth-simple';


export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('Profile API endpoint reached - GET request');
  try {
    // Try simple auth first for better compatibility
    const authResult = await verifyAuthSimple(request);
    
    if (!authResult.success) {
      // Fallback to NextAuth session
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
    }

    // Return user profile from simple auth (without password hash)
    const { passwordHash, ...userWithoutPassword } = authResult.user.toObject ? authResult.user.toObject() : authResult.user;
    return NextResponse.json({
      user: {
        id: userWithoutPassword._id?.toString() || userWithoutPassword.id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        createdAt: userWithoutPassword.createdAt,
        profile: userWithoutPassword.profile || {}
      }
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
    // Try simple auth first for better compatibility
    const authResult = await verifyAuthSimple(request);
    let userId: string;
    
    if (!authResult.success) {
      // Fallback to NextAuth session
      const user = await getCurrentUser();
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      userId = user.id;
    } else {
      userId = authResult.user._id?.toString() || authResult.user.id;
    }

    // Get profile data from request
    const profileData = await request.json();
    console.log('Received profile data:', profileData);

    // Update user profile
    const updatedUser = await updateUserProfile(userId, profileData);

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