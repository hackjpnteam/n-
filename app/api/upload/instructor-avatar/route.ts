import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getUserFromSession } from '@/lib/auth';


export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get current user from session
    const currentUser = await getUserFromSession(authToken);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('avatar') as unknown as File;
    const instructorId = data.get('instructorId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!instructorId) {
      return NextResponse.json(
        { error: 'Instructor ID required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'instructors');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name) || '.jpg';
    const filename = `instructor-${instructorId}-${timestamp}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    // Return the URL path (relative to public directory)
    const avatarUrl = `/uploads/instructors/${filename}`;

    console.log('✅ Instructor avatar uploaded successfully:', {
      instructorId,
      filename,
      avatarUrl,
      fileSize: file.size,
      fileType: file.type
    });

    return NextResponse.json({
      message: 'Instructor avatar uploaded successfully',
      avatarUrl
    });

  } catch (error) {
    console.error('Error uploading instructor avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}