import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock attempts data for demonstration
const mockAttempts: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Return empty array for now since we're using mock data
    const attempts = mockAttempts.filter(attempt => attempt.videoId === videoId);

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
}