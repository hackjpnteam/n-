import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import WatchHistory from '@/models/WatchHistory';
import Video from '@/models/Video';
import { cookies } from 'next/headers';
import { getUserFromSession } from '@/lib/auth';


export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get user from session
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserFromSession(token.value);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get watch history for user
    const history = await WatchHistory.find({ user: user.email })
      .populate({
        path: 'video',
        populate: {
          path: 'instructor'
        }
      })
      .sort({ watchedAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching watch history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watch history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Get user from session
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserFromSession(token.value);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { videoId, progress, completed } = await request.json();

    // Validate video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Update or create watch history
    const watchHistory = await WatchHistory.findOneAndUpdate(
      { user: user.email, video: videoId },
      {
        watchedAt: new Date(),
        progress: progress || 0,
        completed: completed || false
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ watchHistory });
  } catch (error) {
    console.error('Error updating watch history:', error);
    return NextResponse.json(
      { error: 'Failed to update watch history' },
      { status: 500 }
    );
  }
}