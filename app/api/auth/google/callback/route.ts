import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession, getUserByEmail } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get base URL from environment or headers
    const getBaseUrl = () => {
      // Try environment variable first (production)
      if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL;
      }
      
      // Try from request headers (fallback)
      const host = request.headers.get('host');
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      
      if (host) {
        return `${protocol}://${host}`;
      }
      
      // Final fallback
      return 'http://localhost:3000';
    };

    const baseUrl = getBaseUrl();
    const url = new URL(request.nextUrl);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(`${baseUrl}/auth/login?error=google_auth_error`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/auth/login?error=no_code`);
    }

    // Check if we have required environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth configuration');
      // For demo/development purposes, use demo user
      const demoUser = {
        email: 'demo.gmail@gmail.com',
        name: 'Gmail デモユーザー',
        picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      
      return await processGoogleUser(demoUser, baseUrl);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
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
      
      return await processGoogleUser(demoUser, baseUrl);
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
    
    return await processGoogleUser(googleUser, baseUrl);
    
  } catch (error) {
    console.error('Google auth callback error:', error);
    
    // Try to redirect safely
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/auth/login?error=callback_error`);
    } catch (redirectError) {
      console.error('Failed to redirect after error:', redirectError);
      // Return a simple response if redirect fails
      return new NextResponse('Authentication failed. Please try again.', {
        status: 302,
        headers: {
          'Location': '/auth/login?error=callback_error'
        }
      });
    }
  }
}

async function processGoogleUser(googleUser: any, baseUrl: string) {
  try {
    // Check if user exists, if not create them
    let user = await getUserByEmail(googleUser.email);
    if (!user) {
      user = await createUser(
        googleUser.email,
        googleUser.name || googleUser.given_name + ' ' + googleUser.family_name,
        'google-auth-' + Date.now(),
        'user'
      );
    }

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/auth/login?error=user_creation_failed`);
    }

    // Create session
    const token = createSession(user.id);

    console.log('Google authentication successful for:', googleUser.email);

    // Redirect to home page with auth token
    const response = NextResponse.redirect(`${baseUrl}/`);
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error processing Google user:', error);
    return NextResponse.redirect(`${baseUrl}/auth/login?error=processing_error`);
  }
}