import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';
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
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const currentUser = getUserFromSession(authToken);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Reload from file to ensure latest data
    savedVideos = loadSavedVideos();
    const userSavedVideos = savedVideos[currentUser.id] || [];

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
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const currentUser = getUserFromSession(authToken);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { videoId, videoData } = await request.json();

    if (!videoId || !videoData) {
      return NextResponse.json(
        { error: 'Video ID and data are required' },
        { status: 400 }
      );
    }

    // Reload from file to ensure latest data
    savedVideos = loadSavedVideos();
    
    if (!savedVideos[currentUser.id]) {
      savedVideos[currentUser.id] = [];
    }

    // Check if video is already saved
    const existingIndex = savedVideos[currentUser.id].findIndex(v => v.id === videoId);
    
    if (existingIndex >= 0) {
      return NextResponse.json(
        { error: 'Video already saved' },
        { status: 409 }
      );
    }

    // Add video to saved list
    savedVideos[currentUser.id].push({
      id: videoId,
      ...videoData,
      savedAt: new Date().toISOString()
    });

    // Save to file
    saveSavedVideos(savedVideos);

    return NextResponse.json({
      message: 'Video saved successfully',
      savedVideos: savedVideos[currentUser.id]
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
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const currentUser = getUserFromSession(authToken);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

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
    
    if (!savedVideos[currentUser.id]) {
      savedVideos[currentUser.id] = [];
    }

    // Remove video from saved list
    savedVideos[currentUser.id] = savedVideos[currentUser.id].filter(v => v.id !== videoId);

    // Save to file
    saveSavedVideos(savedVideos);

    return NextResponse.json({
      message: 'Video removed from saved list',
      savedVideos: savedVideos[currentUser.id]
    });
  } catch (error) {
    console.error('Error removing saved video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}