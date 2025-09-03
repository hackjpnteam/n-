import { NextRequest, NextResponse } from 'next/server';
import { mockInstructors } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const tagsParam = searchParams.get('tags');
    const selectedTags = tagsParam ? tagsParam.split(',') : [];

    let filteredInstructors = mockInstructors;
    
    if (search) {
      filteredInstructors = filteredInstructors.filter(instructor =>
        instructor.name.toLowerCase().includes(search.toLowerCase()) ||
        instructor.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (selectedTags.length > 0) {
      filteredInstructors = filteredInstructors.filter(instructor =>
        selectedTags.every(tag => instructor.tags.includes(tag))
      );
    }

    if (sort === 'popular') {
      filteredInstructors = [...filteredInstructors].sort((a, b) => 
        Math.random() - 0.5
      );
    }

    const total = filteredInstructors.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInstructors = filteredInstructors.slice(startIndex, endIndex);

    const instructorsWithStats = paginatedInstructors.map(instructor => ({
      ...instructor,
      videoCount: Math.floor(Math.random() * 5) + 1,
      totalViews: Math.floor(Math.random() * 10000) + 500
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
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}