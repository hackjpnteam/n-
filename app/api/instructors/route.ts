import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Instructor from '@/models/Instructor';
import Video from '@/models/Video';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const tagsParam = searchParams.get('tags');
    const selectedTags = tagsParam ? tagsParam.split(',') : [];

    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (selectedTags.length > 0) {
      query.tags = { $all: selectedTags };
    }

    // Get total count
    const total = await Instructor.countDocuments(query);

    // Build sort object
    let sortOption: any = {};
    if (sort === 'createdAt') {
      sortOption.createdAt = -1;
    } else if (sort === 'name') {
      sortOption.name = 1;
    }

    // Fetch instructors with pagination
    const instructors = await Instructor.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get video stats for each instructor
    const instructorsWithStats = await Promise.all(
      instructors.map(async (instructor) => {
        const videoCount = await Video.countDocuments({ instructor: instructor._id });
        const videos = await Video.find({ instructor: instructor._id }).lean();
        const totalViews = videos.reduce((sum, video) => sum + (video.stats?.views || 0), 0);
        
        return {
          ...instructor,
          videoCount,
          totalViews
        };
      })
    );

    return NextResponse.json({
      instructors: instructorsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}