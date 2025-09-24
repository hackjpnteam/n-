import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/auth-admin';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: authResult.status || 500 }
      );
    }

    // Get all users from MongoDB
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    console.log('Loaded users from MongoDB:', users.length);

    return NextResponse.json({
      members: users.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        status: 'active',
        createdAt: user.createdAt,
        lastAccess: user.lastAccess || user.createdAt,
        profile: user.profile || {},
        completedVideos: 0,
        totalVideos: 10,
        completionRate: Math.floor(Math.random() * 100),
        quizAverage: Math.floor(Math.random() * 100),
        totalWatchTime: Math.floor(Math.random() * 500)
      })),
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}