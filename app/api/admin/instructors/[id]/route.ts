import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import { verifyAdminAuthSimple } from '@/lib/auth-admin-simple';
import Instructor from '@/models/Instructor';


export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDB();
    
    // Try to get from MongoDB first
    const instructor = await Instructor.findById(params.id).lean();
    
    if (instructor) {
      console.log(`✅ Found instructor ${params.id} in MongoDB`);
      
      // Format for frontend compatibility
      const formattedInstructor = {
        _id: instructor._id.toString(),
        name: instructor.name,
        title: instructor.title || '',
        bio: instructor.bio || '',
        avatar: instructor.avatarUrl || '',
        avatarUrl: instructor.avatarUrl || '',
        expertise: instructor.tags || [],
        tags: instructor.tags || []
      };
      
      return NextResponse.json(formattedInstructor);
    } else {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching instructor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const authResult = await verifyAdminAuthSimple(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: authResult.status || 500 }
      );
    }
    
    const currentUser = authResult.user;

    const updates = await request.json();
    console.log('Updating instructor with data:', JSON.stringify(updates, null, 2));
    
    // Prepare update data for MongoDB
    const updateData: any = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.title) updateData.title = updates.title;
    if (updates.bio) updateData.bio = updates.bio;
    if (updates.avatar || updates.avatarUrl) {
      updateData.avatarUrl = updates.avatar || updates.avatarUrl;
    }
    if (updates.expertise && Array.isArray(updates.expertise)) {
      updateData.tags = updates.expertise;
    }
    
    // Update instructor in MongoDB
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedInstructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Instructor ${params.id} updated in MongoDB`);
    
    // Format response for frontend compatibility
    const formattedInstructor = {
      _id: updatedInstructor._id.toString(),
      name: updatedInstructor.name,
      title: updatedInstructor.title || '',
      bio: updatedInstructor.bio || '',
      avatar: updatedInstructor.avatarUrl || '',
      avatarUrl: updatedInstructor.avatarUrl || '',
      expertise: updatedInstructor.tags || [],
      tags: updatedInstructor.tags || [],
      updatedAt: new Date()
    };
    
    return NextResponse.json({
      message: 'ゲスト情報を更新しました',
      instructor: formattedInstructor
    });
  } catch (error) {
    console.error('Error updating instructor:', error);
    return NextResponse.json(
      { error: 'Failed to update instructor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const authResult = await verifyAdminAuthSimple(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: authResult.status || 500 }
      );
    }
    
    const currentUser = authResult.user;

    // Delete instructor from MongoDB
    const deletedInstructor = await Instructor.findByIdAndDelete(params.id);
    
    if (!deletedInstructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Instructor ${params.id} deleted from MongoDB by admin ${currentUser._id}`);
    
    return NextResponse.json({
      message: 'ゲストを削除しました'
    });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return NextResponse.json(
      { error: 'Failed to delete instructor' },
      { status: 500 }
    );
  }
}