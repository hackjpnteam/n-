import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import fs from 'fs';
import path from 'path';

// API to get all members for community feature

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
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
    const currentUser = getUserFromSession(authToken);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    let members = [];

    try {
      // Try MongoDB first (production environment)
      await connectDB();
      const users = await User.find({
        'profile.company': { $exists: true, $ne: '', $regex: /.+/ }
      })
      .select('name email role createdAt profile')
      .lean();
      
      members = users.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        profile: {
          company: user.profile?.company || '',
          position: user.profile?.position || '',
          companyUrl: user.profile?.companyUrl || '',
          bio: user.profile?.bio || '',
          avatarUrl: user.profile?.avatarUrl || ''
        }
      }));
      
      console.log(`✅ Loaded ${members.length} members from MongoDB`);
    } catch (dbError) {
      console.log('📂 MongoDB unavailable, falling back to file system');
      
      // Fallback to file system (development environment)
      try {
        const dataDir = path.join(process.cwd(), 'data');
        const usersFile = path.join(dataDir, 'users.json');
        
        if (fs.existsSync(usersFile)) {
          const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
          
          // Filter and format members data (exclude passwords and sensitive info)
          // Only include members with company name filled
          members = Object.values(usersData)
            .filter((user: any) => user.profile?.company && user.profile.company.trim() !== '')
            .map((user: any) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
              profile: {
                company: user.profile?.company || '',
                position: user.profile?.position || '',
                companyUrl: user.profile?.companyUrl || '',
                bio: user.profile?.bio || '',
                avatarUrl: user.profile?.avatarUrl || ''
              }
            }));
          
          console.log(`✅ Loaded ${members.length} members from file system`);
        } else {
          console.log('📄 No user data file found');
        }
      } catch (fsError) {
        console.error('❌ File system access failed:', fsError);
        // Return demo members for demonstration
        members = [
          {
            id: 'demo-1',
            name: 'デモユーザー',
            email: 'demo@example.com',
            role: 'user',
            createdAt: new Date().toISOString(),
            profile: {
              company: 'サンプル株式会社',
              position: 'エンジニア',
              companyUrl: 'https://example.com',
              bio: 'デモ用のプロフィールです。',
              avatarUrl: ''
            }
          }
        ];
        console.log('🎭 Using demo member data');
      }
    }

    // Sort by creation date (newest first)
    members.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ 
      members,
      currentUserId: currentUser.id 
    });

  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}