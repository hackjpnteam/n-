import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Load users from file system
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      return Object.values(data);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
}

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const currentUser = await getUserFromSession(authToken);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Load all users from the file system
    const users = loadUsers();
    console.log('Loaded users:', users.length);
    
    // Get actual avatar files from uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    let availableAvatars = ['/default-avatar.png'];
    
    try {
      if (fs.existsSync(uploadsDir)) {
        const avatarFiles = fs.readdirSync(uploadsDir).filter(file => 
          file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
        );
        availableAvatars = avatarFiles.map(file => `/uploads/avatars/${file}`).concat(['/default-avatar.png']);
        console.log('Available avatar files:', availableAvatars);
      }
    } catch (error) {
      console.error('Error reading avatar directory:', error);
    }

    // Transform user data to member format with mock learning data
    const members = users.map((user: any, index: number) => {
      const profile = user.profile || {};
      // If user doesn't have an avatar or the avatar doesn't exist, assign a working one
      if (!profile.avatarUrl) {
        profile.avatarUrl = availableAvatars[index % availableAvatars.length];
      } else {
        // Check if the current avatar file exists
        const avatarPath = path.join(process.cwd(), 'public', profile.avatarUrl);
        if (!fs.existsSync(avatarPath)) {
          console.log(`Avatar file not found: ${profile.avatarUrl}, assigning new one`);
          profile.avatarUrl = availableAvatars[index % availableAvatars.length];
        }
      }

      const member = {
        id: user.id,
        name: user.name,
        email: user.email,
        profile,
        joinedAt: user.createdAt,
        lastAccess: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
        completedVideos: Math.floor(Math.random() * 6) + 1,
        totalVideos: 6,
        completionRate: Math.floor(Math.random() * 100),
        quizAverage: Math.floor(Math.random() * 40) + 60,
        totalWatchTime: Math.floor(Math.random() * 300) + 50,
        status: Math.random() > 0.2 ? 'active' : 'inactive'
      };
      
      console.log(`Member ${index}:`, member.name, 'Avatar:', member.profile.avatarUrl);
      return member;
    });

    // Sort by completion rate for ranking
    members.sort((a, b) => b.completionRate - a.completionRate);

    return NextResponse.json({
      members,
      total: members.length
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}