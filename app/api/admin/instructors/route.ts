import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/auth-admin';
import Instructor from '@/models/Instructor';

export const dynamic = 'force-dynamic';

// Simple instructor storage in MongoDB
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: authResult.status || 500 }
      );
    }
    
    const currentUser = authResult.user;

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