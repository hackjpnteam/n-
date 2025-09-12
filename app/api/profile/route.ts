import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, updateUserProfile } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';


export const dynamic = 'force-dynamic';
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
    const user = await getUserFromSession(authToken);
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

    let updatedUser;

    try {
      // Try MongoDB first (production environment)
      await connectDB();
      
      updatedUser = await User.findByIdAndUpdate(
        user.id,
        {
          name,
          'profile.company': company,
          'profile.position': position,
          'profile.companyUrl': companyUrl,
          'profile.bio': bio,
          'profile.avatarUrl': avatarUrl
        },
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!updatedUser) {
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
        );
      }

      console.log('✅ Profile updated in MongoDB');
      
      // Return updated user from MongoDB
      return NextResponse.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          profile: updatedUser.profile
        }
      });

    } catch (dbError) {
      console.log('📂 MongoDB unavailable, falling back to file system');
      
      // Fallback to file system (development environment)
      updatedUser = updateUserProfile(user.id, {
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

      console.log('✅ Profile updated in file system');

      // Return updated user (without password hash)
      const { passwordHash, ...userWithoutPassword } = updatedUser;
      return NextResponse.json({
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    }

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}