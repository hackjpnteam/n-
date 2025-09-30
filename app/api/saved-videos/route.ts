import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToMongoDB from '@/lib/mongodb';
import SavedVideo from '@/models/SavedVideo';
import Video from '@/models/Video';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connectToMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const savedVideos = await SavedVideo.find({ user: user._id })
      .populate({
        path: 'video',
        select: 'title description thumbnailUrl instructor createdAt stats',
        populate: {
          path: 'instructor',
          select: 'name title avatarUrl'
        }
      })
      .sort({ savedAt: -1 })
      .lean();

    const formattedVideos = savedVideos.map(sv => ({
      ...sv.video,
      id: sv.video._id.toString(),
      savedAt: sv.savedAt
    }));

    return NextResponse.json({
      savedVideos: formattedVideos
    });
  } catch (error) {
    console.error('Error fetching saved videos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const existingSavedVideo = await SavedVideo.findOne({ 
      user: user._id, 
      video: videoId 
    });
    
    if (existingSavedVideo) {
      return NextResponse.json(
        { error: 'Video already saved' },
        { status: 409 }
      );
    }

    const savedVideo = await SavedVideo.create({
      user: user._id,
      video: videoId,
      savedAt: new Date()
    });

    return NextResponse.json({
      message: 'Video saved successfully',
      savedVideo: {
        id: (savedVideo._id as any).toString(),
        videoId: videoId,
        savedAt: savedVideo.savedAt
      }
    });
  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const result = await SavedVideo.deleteOne({ 
      user: user._id, 
      video: videoId 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Saved video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Video removed from saved list'
    });
  } catch (error) {
    console.error('Error removing saved video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}