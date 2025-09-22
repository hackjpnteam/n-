import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth-simple';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value;

    if (!sessionToken) {
      return NextResponse.json(null);
    }

    const payload = verifySessionToken(sessionToken);
    
    if (!payload) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(null);
  }
}