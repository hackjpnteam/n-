import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToMongoDB from '@/lib/mongodb';
import CompletedVideo from '@/models/CompletedVideo';
import Video from '@/models/Video';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🎬 API: Getting completed videos...');
    const session = await auth();
    
    if (!session || !session.user?.email) {
      console.log('🎬 API: No session or email');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('🎬 API: User email:', session.user.email);
    
    await connectToMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    console.log('🎬 API: User found:', user ? { id: user._id, email: user.email } : 'Not found');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const completedVideos = await CompletedVideo.find({ user: user._id })
      .populate({
        path: 'video',
        select: 'title description thumbnailUrl instructor createdAt stats',
        populate: {
          path: 'instructor',
          select: 'name title avatarUrl'
        }
      })
      .sort({ completedAt: -1 })
      .lean();

    console.log('🎬 API: Found completed videos count:', completedVideos.length);
    console.log('🎬 API: Raw completed videos:', completedVideos.map(cv => ({
      videoId: cv.video?._id,
      videoTitle: cv.video?.title,
      completedAt: cv.completedAt
    })));

    const formattedVideos = completedVideos.map(cv => ({
      id: cv.video._id.toString(),
      ...cv.video,
      completedAt: cv.completedAt
    }));

    console.log('🎬 API: Formatted videos:', formattedVideos.length);

    return NextResponse.json({
      success: true,
      videos: formattedVideos
    });
  } catch (error) {
    console.error('🎬 API: Error fetching completed videos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎬 API POST: Marking video as completed...');
    const session = await auth();
    
    if (!session || !session.user?.email) {
      console.log('🎬 API POST: No session or email');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('🎬 API POST: User email:', session.user.email);
    
    const { videoId } = await request.json();
    console.log('🎬 API POST: Video ID:', videoId);

    if (!videoId) {
      console.log('🎬 API POST: No video ID provided');
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    console.log('🎬 API POST: User found:', user ? { id: user._id, email: user.email } : 'Not found');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const video = await Video.findById(videoId);
    console.log('🎬 API POST: Video found:', video ? { id: video._id, title: video.title } : 'Not found');
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const existingCompletedVideo = await CompletedVideo.findOne({ 
      user: user._id, 
      video: videoId 
    });
    
    console.log('🎬 API POST: Existing completed video:', existingCompletedVideo ? 'Found' : 'Not found');
    
    if (existingCompletedVideo) {
      console.log('🎬 API POST: Video already completed, returning existing');
      return NextResponse.json(
        { message: 'Video already marked as completed' },
        { status: 200 }
      );
    }

    const completedVideo = await CompletedVideo.create({
      user: user._id,
      video: videoId,
      completedAt: new Date()
    });

    console.log('🎬 API POST: Created completed video:', completedVideo._id);

    return NextResponse.json({
      message: 'Video marked as completed',
      completedVideo: {
        id: completedVideo._id.toString(),
        videoId: videoId,
        completedAt: completedVideo.completedAt
      }
    });
  } catch (error) {
    console.error('🎬 API POST: Error marking video as completed:', error);
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

    const result = await CompletedVideo.deleteOne({ 
      user: user._id, 
      video: videoId 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Completed video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Video removed from completed list'
    });
  } catch (error) {
    console.error('Error removing completed video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}