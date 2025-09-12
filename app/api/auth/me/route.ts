import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, getUserByEmail, createSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    // Debug logging
    console.log('Debug - Cookies:', request.cookies.getAll());
    console.log('Debug - Token:', token);
    
    if (!token) {
      // Return empty response without error to avoid console errors
      return NextResponse.json(
        { user: null, message: 'No authentication token' },
        { status: 200 }
      );
    }

    let user = getUserFromSession(token);
    console.log('Debug - User from token:', user);
    
    // If session is lost, return null user instead of auto-recreating demo session
    if (!user && token) {
      // Clear invalid token
      const response = NextResponse.json(
        { user: null, message: 'Invalid or expired session' },
        { status: 200 }
      );
      response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
      return response;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { user: null, error: '認証確認中にエラーが発生しました' },
      { status: 200 }
    );
  }
}