import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Instructor from '@/models/Instructor';
import Video from '@/models/Video';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToMongoDB();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
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

    try {
      // Try to get from MongoDB first
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
          const videoCount = await Video.countDocuments({ 'instructor.name': instructor.name });
          
          return {
            ...instructor,
            avatar: instructor.avatarUrl, // Map avatarUrl to avatar for UI consistency
            videoCount
          };
        })
      );

      console.log(`✅ Found ${instructors.length} instructors in MongoDB`);

      return NextResponse.json({
        instructors: instructorsWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (dbError) {
      console.log('💡 Falling back to mock data due to database error:', dbError);
      
      // Fallback to mock data
      const { mockInstructors } = await import('@/lib/mockData');
      
      // Filter mock data based on search parameters
      let filteredInstructors = mockInstructors;
      
      if (search) {
        filteredInstructors = mockInstructors.filter(instructor =>
          instructor.name.toLowerCase().includes(search.toLowerCase()) ||
          instructor.title.toLowerCase().includes(search.toLowerCase()) ||
          instructor.bio.toLowerCase().includes(search.toLowerCase()) ||
          instructor.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      // Apply sorting
      if (sort === 'name') {
        filteredInstructors.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      // Apply pagination
      const total = filteredInstructors.length;
      const startIndex = (page - 1) * limit;
      const paginatedInstructors = filteredInstructors.slice(startIndex, startIndex + limit);
      
      // Convert to expected format
      const instructorsWithStats = paginatedInstructors.map(instructor => ({
        ...instructor,
        avatar: instructor.avatarUrl,
        videoCount: 0,
        totalViews: 0,
        rating: 4.5,
        totalStudents: 100,
        totalCourses: 5,
        expertise: instructor.tags
      }));

      return NextResponse.json({
        instructors: instructorsWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
  } catch (error) {
    console.error('Error fetching instructors:', error);
    console.log('💡 Falling back to mock data due to database connection error');
    
    // Import mock data as fallback
    const { mockInstructors } = await import('@/lib/mockData');
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Filter mock data based on search
    let filteredInstructors = mockInstructors;
    
    if (search) {
      filteredInstructors = mockInstructors.filter(instructor =>
        instructor.name.toLowerCase().includes(search.toLowerCase()) ||
        instructor.title.toLowerCase().includes(search.toLowerCase()) ||
        instructor.bio.toLowerCase().includes(search.toLowerCase()) ||
        instructor.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply sorting
    if (sort === 'name') {
      filteredInstructors.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Apply pagination
    const total = filteredInstructors.length;
    const startIndex = (page - 1) * limit;
    const paginatedInstructors = filteredInstructors.slice(startIndex, startIndex + limit);
    
    // Convert to expected format
    const instructorsWithStats = paginatedInstructors.map(instructor => ({
      ...instructor,
      avatar: instructor.avatarUrl, // Map avatarUrl to avatar for consistency
      videoCount: 0,
      totalViews: 0,
      rating: 4.5,
      totalStudents: 100,
      totalCourses: 5,
      expertise: instructor.tags
    }));

    return NextResponse.json({
      instructors: instructorsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }
}