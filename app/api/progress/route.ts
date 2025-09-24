import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuthSimple } from '@/lib/auth-admin-simple';

// Mock progress storage
const progressData: Map<string, { userId: string; videoId: string; status: string; watchedAt: Date }> = new Map();


export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuthSimple(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: authResult.status || 401 }
      );
    }
    
    const user = authResult.user;

    const videoId = request.nextUrl.searchParams.get('videoId');
    
    if (videoId) {
      // Get specific video progress
      const progressKey = `${user._id}-${videoId}`;
      const progress = progressData.get(progressKey);
      
      return NextResponse.json({
        videoId,
        status: progress?.status || 'not_started',
        watchedAt: progress?.watchedAt || null
      });
    } else {
      // Get all user progress
      const userProgress = Array.from(progressData.values())
        .filter(p => p.userId === user._id);
      
      return NextResponse.json({
        progress: userProgress
      });
    }
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuthSimple(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: authResult.status || 401 }
      );
    }
    
    const user = authResult.user;

    const body = await request.json();
    const { videoId, status } = body;

    if (!videoId || !status) {
      return NextResponse.json(
        { error: 'videoIdとstatusが必要です' },
        { status: 400 }
      );
    }

    const progressKey = `${user._id}-${videoId}`;
    progressData.set(progressKey, {
      userId: user._id,
      videoId,
      status,
      watchedAt: new Date()
    });

    return NextResponse.json({
      message: '進捗を記録しました',
      progress: {
        videoId,
        status,
        watchedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}