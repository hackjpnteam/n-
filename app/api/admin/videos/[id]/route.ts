import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import { auth } from '@/auth';
import User from '@/models/User';
import Video from '@/models/Video';


export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // For now, return mock data (implement actual video storage later)
    const mockVideo = {
      _id: params.id,
      title: 'Sample Video',
      description: 'Sample Description',
      sourceUrl: 'https://example.com/video.mp4',
      instructor: {
        _id: '1',
        name: 'Sample Instructor'
      }
    };
    
    return NextResponse.json(mockVideo);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin role
    await connectToMongoDB();
    const currentUser = await User.findOne({ 
      email: session.user.email?.toLowerCase() 
    });
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    
    // For now, return mock updated data (implement actual video storage later)
    const updatedVideo = {
      _id: params.id,
      ...updates,
      updatedAt: new Date(),
      updatedBy: currentUser._id
    };
    
    return NextResponse.json({
      message: '動画情報を更新しました',
      video: updatedVideo
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin role
    await connectToMongoDB();
    const currentUser = await User.findOne({ 
      email: session.user.email?.toLowerCase() 
    });
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Delete video from MongoDB
    const deletedVideo = await Video.findByIdAndDelete(params.id);
    
    if (!deletedVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Video ${params.id} deleted from MongoDB by admin ${currentUser._id}`);
    
    return NextResponse.json({
      message: '動画を削除しました'
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}