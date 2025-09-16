import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Instructor from '@/models/Instructor';
import { requireAdmin } from '@/lib/authMiddleware';


export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const instructor = await Instructor.findById(params.id);
    
    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }
    
    // Map avatarUrl to avatar for UI consistency
    const instructorData: any = instructor.toObject();
    instructorData.avatar = instructorData.avatarUrl;
    
    return NextResponse.json(instructorData);
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
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();
    const updates = await request.json();
    
    console.log('📝 Updating instructor with data:', updates);
    
    // Map avatar field to avatarUrl for MongoDB consistency
    if (updates.avatar !== undefined) {
      updates.avatarUrl = updates.avatar;
      delete updates.avatar;
    }
    
    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;
    
    const instructor = await Instructor.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Instructor updated successfully:', {
      id: instructor._id,
      name: instructor.name,
      avatarUrl: instructor.avatarUrl
    });

    return NextResponse.json({
      message: '講師情報を更新しました',
      instructor
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
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();
    const instructor = await Instructor.findByIdAndDelete(params.id);
    
    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: '講師を削除しました'
    });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return NextResponse.json(
      { error: 'Failed to delete instructor' },
      { status: 500 }
    );
  }
}