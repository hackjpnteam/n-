import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Video from '@/models/Video';
import { requireAuth } from '@/lib/authMiddleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Check authentication
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const instructor = searchParams.get('instructor');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (instructor) {
      query.instructor = instructor;
    }

    // Get total count
    const total = await Video.countDocuments(query);

    // Fetch videos with pagination
    const videos = await Video.find(query)
      .populate('instructor')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get unique categories
    const allVideos = await Video.find({}).select('category').lean();
    const categories = Array.from(new Set(allVideos.map((v: any) => v.category).filter(Boolean)));

    return NextResponse.json({
      videos,
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}