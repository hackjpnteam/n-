import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Video from '@/models/Video';
import { requireAdmin } from '@/lib/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();
    const videoData = await request.json();
    
    const video = new Video(videoData);
    await video.save();
    await video.populate('instructor');
    
    return NextResponse.json({
      message: '動画を追加しました',
      video
    });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}