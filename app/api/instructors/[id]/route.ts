import { NextRequest, NextResponse } from 'next/server';
import { mockInstructors, mockVideos } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructor = mockInstructors.find(i => i._id === params.id);
    
    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }

    const videos = mockVideos.filter(v => v.instructor._id === params.id);

    const videoCount = videos.length;
    const totalViews = videos.reduce((sum, video) => sum + (video.stats?.views || 0), 0);
    const avgRating = videos.reduce((sum, video) => {
      if (video.stats?.avgWatchRate) {
        return sum + video.stats.avgWatchRate;
      }
      return sum;
    }, 0) / (videoCount || 1);

    return NextResponse.json({
      instructor,
      videos,
      stats: {
        videoCount,
        totalViews,
        avgRating: Math.round(avgRating * 10) / 10
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