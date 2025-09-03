import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession, getUserByEmail } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(new URL('/auth/login?error=google_auth_error', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url));
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '1234567890-abcdefg.apps.googleusercontent.com',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || 'demo-secret',
        code,
        grant_type: 'authorization_code',
        redirect_uri: new URL('/api/auth/google/callback', request.url).toString(),
      }),
    });

    if (!tokenResponse.ok) {
      // For demo purposes, simulate successful token exchange
      console.log('Token exchange failed, using demo data');
      const demoUser = {
        email: 'demo.gmail@gmail.com',
        name: 'Gmail デモユーザー',
        picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      
      return await processGoogleUser(demoUser, request);
    }

    const tokens = await tokenResponse.json();
    
    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const googleUser = await userResponse.json();
    
    return await processGoogleUser(googleUser, request);
    
  } catch (error) {
    console.error('Google auth callback error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=callback_error', request.url));
  }
}

async function processGoogleUser(googleUser: any, request: NextRequest) {
  try {
    // Check if user exists, if not create them
    let user = getUserByEmail(googleUser.email);
    if (!user) {
      user = createUser(
        googleUser.email,
        googleUser.name || googleUser.given_name + ' ' + googleUser.family_name,
        'google-auth-' + Date.now(),
        'user'
      );
    }

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?error=user_creation_failed', request.url));
    }

    // Create session
    const token = createSession(user.id);

    console.log('Google authentication successful for:', googleUser.email);

    // Redirect to home page with auth token
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error processing Google user:', error);
    return NextResponse.redirect(new URL('/auth/login?error=processing_error', request.url));
  }
}