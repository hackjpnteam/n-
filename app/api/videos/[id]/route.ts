import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import { auth } from '@/auth';
import { verifyAuthSimple } from '@/lib/auth-simple';
import Video from '@/models/Video';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try simple auth first for better compatibility
    const authResult = await verifyAuthSimple(request);
    
    if (!authResult.success) {
      // Fallback to NextAuth session
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
    }

    await connectToMongoDB();
    
    try {
      // Try to get from MongoDB first
      const video = await Video.findById(params.id).lean();
      
      if (video) {
        console.log(`✅ Found video ${params.id} in MongoDB`);
        return NextResponse.json(video);
      }
    } catch (dbError) {
      console.log('💡 Video not found in MongoDB, trying mock data:', dbError);
    }
    
    // Fallback to mock data
    const { mockVideos } = await import('@/lib/mockData');
    const video = mockVideos.find(v => v._id === params.id);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}