import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Video from '@/models/Video';

export const dynamic = 'force-dynamic';

// POST /api/videos/[id]/complete - Increment completion count
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB();
    
    const videoId = params.id;
    console.log(`🎯 [COMPLETE] Incrementing completion count for video: ${videoId}`);
    
    // Update video completion count atomically
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { 
        $inc: { 'stats.completions': 1 },
        $setOnInsert: { 'stats.views': 0, 'stats.likes': 0 }
      },
      { 
        new: true, 
        upsert: false,
        runValidators: false
      }
    );
    
    if (!updatedVideo) {
      console.error(`❌ [COMPLETE] Video not found: ${videoId}`);
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ [COMPLETE] Updated completion count: ${updatedVideo.stats?.completions || 0}`);
    
    return NextResponse.json({
      success: true,
      completions: updatedVideo.stats?.completions || 0
    });
  } catch (error) {
    console.error('❌ [COMPLETE] Error updating completion count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}