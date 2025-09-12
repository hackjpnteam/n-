import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Instructor from '@/models/Instructor';
import { requireAdmin } from '@/lib/authMiddleware';

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();
    const instructorData = await request.json();
    
    const instructor = new Instructor(instructorData);
    await instructor.save();
    
    return NextResponse.json({
      message: '講師を追加しました',
      instructor
    });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { error: 'Failed to create instructor' },
      { status: 500 }
    );
  }
}