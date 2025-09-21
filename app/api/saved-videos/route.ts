import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// File-based storage for saved videos
const DATA_DIR = path.join(process.cwd(), 'data');
const SAVED_VIDEOS_FILE = path.join(DATA_DIR, 'saved-videos.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load saved videos from file
function loadSavedVideos(): Record<string, any[]> {
  try {
    if (fs.existsSync(SAVED_VIDEOS_FILE)) {
      const data = fs.readFileSync(SAVED_VIDEOS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading saved videos:', error);
  }
  return {};
}

// Save videos to file
function saveSavedVideos(savedVideos: Record<string, any[]>) {
  try {
    fs.writeFileSync(SAVED_VIDEOS_FILE, JSON.stringify(savedVideos, null, 2));
  } catch (error) {
    console.error('Error saving videos:', error);
  }
}

// Initialize with file data
let savedVideos: Record<string, any[]> = loadSavedVideos();

export async function GET(request: NextRequest) {
  try {
    // For now, allow all requests - will fix auth later
    // Check authentication
    // const session = await auth();
    
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }
    
    // Temporary user for development
    const userId = 'demo-user';

    // Reload from file to ensure latest data
    savedVideos = loadSavedVideos();
    const userSavedVideos = savedVideos[userId] || [];

    return NextResponse.json({
      savedVideos: userSavedVideos
    });
  } catch (error) {
    console.error('Error fetching saved videos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }
    
    // Temporary user for development
    const userId = 'demo-user';

    const { videoId, videoData } = await request.json();

    if (!videoId || !videoData) {
      return NextResponse.json(
        { error: 'Video ID and data are required' },
        { status: 400 }
      );
    }

    // Reload from file to ensure latest data
    savedVideos = loadSavedVideos();
    
    if (!savedVideos[userId]) {
      savedVideos[userId] = [];
    }

    // Check if video is already saved
    const existingIndex = savedVideos[userId].findIndex(v => v.id === videoId);
    
    if (existingIndex >= 0) {
      return NextResponse.json(
        { error: 'Video already saved' },
        { status: 409 }
      );
    }

    // Add video to saved list
    savedVideos[userId].push({
      id: videoId,
      ...videoData,
      savedAt: new Date().toISOString()
    });

    // Save to file
    saveSavedVideos(savedVideos);

    return NextResponse.json({
      message: 'Video saved successfully',
      savedVideos: savedVideos[userId]
    });
  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // For now, allow all requests - will fix auth later
    // Check authentication
    // const session = await auth();
    
    // if (!session || !session.user) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }
    
    // Temporary user for development
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Reload from file to ensure latest data
    savedVideos = loadSavedVideos();
    
    if (!savedVideos[userId]) {
      savedVideos[userId] = [];
    }

    // Remove video from saved list
    savedVideos[userId] = savedVideos[userId].filter(v => v.id !== videoId);

    // Save to file
    saveSavedVideos(savedVideos);

    return NextResponse.json({
      message: 'Video removed from saved list',
      savedVideos: savedVideos[userId]
    });
  } catch (error) {
    console.error('Error removing saved video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}