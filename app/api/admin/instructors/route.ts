import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import { auth } from '@/auth';
import User from '@/models/User';
import Instructor from '@/models/Instructor';

export const dynamic = 'force-dynamic';

// Simple instructor storage in MongoDB
export async function POST(request: NextRequest) {
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
    }) as any;
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const instructorData = await request.json();
    console.log('Instructor data received:', instructorData);
    
    // Create new instructor in MongoDB
    const instructor = new Instructor({
      name: instructorData.name,
      title: instructorData.title,
      bio: instructorData.bio,
      avatarUrl: instructorData.avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
      tags: instructorData.tags || [],
      createdBy: currentUser._id.toString()
    });
    
    const savedInstructor = await instructor.save() as any;
    console.log('✅ Instructor saved to MongoDB:', savedInstructor._id);
    
    return NextResponse.json({
      message: 'ゲストを追加しました',
      instructor: {
        _id: savedInstructor._id.toString(),
        name: savedInstructor.name,
        title: savedInstructor.title,
        bio: savedInstructor.bio,
        avatarUrl: savedInstructor.avatarUrl,
        tags: savedInstructor.tags,
        createdAt: savedInstructor.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { error: 'Failed to create instructor' },
      { status: 500 }
    );
  }
}