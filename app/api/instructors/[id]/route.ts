import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Instructor from '@/models/Instructor';
import Video from '@/models/Video';


export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB();
    
    try {
      // Try to get from MongoDB first
      const instructor = await Instructor.findById(params.id).lean();
      
      if (instructor) {
        // Get videos by this instructor
        const videos = await Video.find({ 'instructor.name': instructor.name }).lean();

        const videoCount = videos.length;

        console.log(`✅ Found instructor ${params.id} in MongoDB`);
        
        return NextResponse.json({
          instructor,
          videos,
          stats: {
            videoCount
          }
        });
      }
    } catch (dbError) {
      console.log('💡 Instructor not found in MongoDB, trying mock data:', dbError);
    }
    
    // Fallback to mock data
    const { mockInstructors, mockVideos } = await import('@/lib/mockData');
    const instructor = mockInstructors.find(i => i._id === params.id);
    
    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    // Get videos by this instructor
    const videos = mockVideos.filter(video => video.instructor.name === instructor.name);

    const videoCount = videos.length;

    return NextResponse.json({
      instructor,
      videos,
      stats: {
        videoCount
      }
    });
  } catch (error) {
    console.error('Error fetching instructor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor' },
      { status: 500 }
    );
  }
}