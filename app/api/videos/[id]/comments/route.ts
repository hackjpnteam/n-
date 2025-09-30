import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToMongoDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import User from '@/models/User';
import Video from '@/models/Video';

export const dynamic = 'force-dynamic';

// GET /api/videos/[id]/comments - Get all comments for a video
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;
    
    await connectToMongoDB();
    
    // Verify video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    // Get comments with user details
    const comments = await Comment.find({ video: videoId })
      .populate({
        path: 'user',
        select: 'name email profile.avatarUrl'
      })
      .sort({ createdAt: -1 })
      .lean();
    
    const formattedComments = comments.map(comment => ({
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: {
        id: comment.user._id.toString(),
        name: comment.user.name,
        email: comment.user.email,
        avatarUrl: comment.user.profile?.avatarUrl
      }
    }));
    
    return NextResponse.json({
      success: true,
      comments: formattedComments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/videos/[id]/comments - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const videoId = params.id;
    const { content } = await request.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }
    
    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be 1000 characters or less' },
        { status: 400 }
      );
    }
    
    await connectToMongoDB();
    
    // Verify video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create comment
    const comment = await Comment.create({
      user: user._id,
      video: videoId,
      content: content.trim()
    });
    
    // Populate user data for response
    await comment.populate({
      path: 'user',
      select: 'name email profile.avatarUrl'
    });
    
    const formattedComment = {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: {
        id: comment.user._id.toString(),
        name: comment.user.name,
        email: comment.user.email,
        avatarUrl: comment.user.profile?.avatarUrl
      }
    };
    
    return NextResponse.json({
      success: true,
      comment: formattedComment
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}