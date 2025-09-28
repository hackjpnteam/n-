import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import { verifyAdminAuthSimple } from '@/lib/auth-admin-simple';
import Instructor from '@/models/Instructor';

export const dynamic = 'force-dynamic';

// Simple instructor storage in MongoDB
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [INSTRUCTOR-POST] Starting instructor creation...');
    
    // Check admin authentication
    const authResult = await verifyAdminAuthSimple(request);
    console.log('🔍 [INSTRUCTOR-POST] Auth result:', { success: authResult.success, error: authResult.error });
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: authResult.status || 500 }
      );
    }
    
    const currentUser = authResult.user;
    console.log('👤 [INSTRUCTOR-POST] Current user:', { id: currentUser._id, email: currentUser.email });

    const instructorData = await request.json();
    console.log('📝 [INSTRUCTOR-POST] Instructor data received:', instructorData);
    
    // Connect to MongoDB
    console.log('🔌 [INSTRUCTOR-POST] Connecting to MongoDB...');
    await connectToMongoDB();
    console.log('✅ [INSTRUCTOR-POST] MongoDB connected');
    
    // Create new instructor in MongoDB
    const instructor = new Instructor({
      name: instructorData.name,
      title: instructorData.title,
      bio: instructorData.bio,
      avatarUrl: instructorData.avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
      tags: instructorData.tags || [],
      createdBy: currentUser._id.toString()
    });
    
    console.log('💾 [INSTRUCTOR-POST] Saving instructor to MongoDB...');
    const savedInstructor = await instructor.save() as any;
    console.log('✅ [INSTRUCTOR-POST] Instructor saved to MongoDB:', savedInstructor._id);
    
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

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 [INSTRUCTOR-GET] Fetching instructors...');
    
    // Check admin authentication
    const authResult = await verifyAdminAuthSimple(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: authResult.status || 500 }
      );
    }
    
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Fetch all instructors from MongoDB
    const instructors = await Instructor.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`✅ [INSTRUCTOR-GET] Found ${instructors.length} instructors`);
    
    return NextResponse.json({
      instructors: instructors.map((instructor: any) => ({
        _id: instructor._id.toString(),
        name: instructor.name,
        title: instructor.title,
        bio: instructor.bio,
        avatarUrl: instructor.avatarUrl,
        tags: instructor.tags,
        createdAt: instructor.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}