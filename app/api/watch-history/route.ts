import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';


export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    // For now, allow all requests - will fix auth later
    // Check authentication
    // const session = await auth();
    
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    // Temporary user for development
    const userId = 'demo-user';

    // Load watch history from file system
    const watchHistoryPath = path.join(process.cwd(), 'data', 'watch-history.json');
    let watchHistory: any = {};
    
    try {
      if (fs.existsSync(watchHistoryPath)) {
        watchHistory = JSON.parse(fs.readFileSync(watchHistoryPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading watch history:', error);
    }

    // Get user's watch history
    const userHistory = watchHistory[userId] || [];
    
    // Sort by most recent first
    const sortedHistory = userHistory.sort((a: any, b: any) => {
      const dateA = new Date(a.updatedAt || a.timestamp).getTime();
      const dateB = new Date(b.updatedAt || b.timestamp).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ history: sortedHistory.slice(0, 10) });
  } catch (error) {
    console.error('Error fetching watch history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watch history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // For now, allow all requests - will fix auth later
    // Check authentication
    // const session = await auth();
    
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    // Temporary user for development
    const userId = 'demo-user';

    const { videoId, progress, completed } = await request.json();

    // Load watch history from file system
    const watchHistoryPath = path.join(process.cwd(), 'data', 'watch-history.json');
    let watchHistoryData: any = {};
    
    try {
      if (fs.existsSync(watchHistoryPath)) {
        watchHistoryData = JSON.parse(fs.readFileSync(watchHistoryPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading watch history:', error);
    }

    // Initialize user's history array if doesn't exist
    if (!watchHistoryData[userId]) {
      watchHistoryData[userId] = [];
    }

    // Find existing entry for this video
    const userHistory = watchHistoryData[userId];
    const existingIndex = userHistory.findIndex((h: any) => h.videoId === videoId);
    
    const historyEntry = {
      videoId,
      watchedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: progress || 0,
      completed: completed || false
    };

    if (existingIndex >= 0) {
      // Update existing entry
      userHistory[existingIndex] = { ...userHistory[existingIndex], ...historyEntry };
    } else {
      // Add new entry
      userHistory.push(historyEntry);
    }

    // Save updated history
    try {
      // Ensure directory exists
      const dataDir = path.dirname(watchHistoryPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(watchHistoryPath, JSON.stringify(watchHistoryData, null, 2));
    } catch (error) {
      console.error('Error saving watch history:', error);
    }

    return NextResponse.json({ watchHistory: historyEntry });
  } catch (error) {
    console.error('Error updating watch history:', error);
    return NextResponse.json(
      { error: 'Failed to update watch history' },
      { status: 500 }
    );
  }
}