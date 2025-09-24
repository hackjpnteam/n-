import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    
    // Get request headers
    const host = request.headers.get('host');
    const userAgent = request.headers.get('user-agent');
    const origin = request.headers.get('origin');
    
    // Try NextAuth session
    let nextAuthSession = null;
    try {
      nextAuthSession = await auth();
    } catch (authError) {
      console.log('NextAuth failed:', authError);
    }
    
    // Check JWT tokens
    const jwtAnalysis = [];
    const potentialTokens = [
      '__Secure-next-auth.session-token',
      'next-auth.session-token', 
      'simple-auth-token'
    ];
    
    for (const tokenName of potentialTokens) {
      const token = cookieStore.get(tokenName)?.value;
      if (token) {
        try {
          // Try to decode without verification first
          const parts = token.split('.');
          if (parts.length === 3) {
            const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            
            // Try to verify with secret
            let verified = false;
            if (process.env.NEXTAUTH_SECRET) {
              try {
                jwt.verify(token, process.env.NEXTAUTH_SECRET);
                verified = true;
              } catch (verifyError) {
                // Ignore verification error for now
              }
            }
            
            jwtAnalysis.push({
              tokenName,
              header,
              payload: {
                ...payload,
                exp: new Date(payload.exp * 1000).toISOString(),
                iat: new Date(payload.iat * 1000).toISOString(),
                isExpired: payload.exp < Date.now() / 1000,
              },
              verified,
              tokenLength: token.length
            });
          }
        } catch (jwtError) {
          jwtAnalysis.push({
            tokenName,
            error: jwtError.message,
            tokenLength: token.length
          });
        }
      }
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        nextauthUrl: process.env.NEXTAUTH_URL,
        hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
      },
      request: {
        host,
        userAgent: userAgent?.substring(0, 100),
        origin,
        url: request.url,
      },
      cookies: {
        total: allCookies.length,
        names: allCookies.map(c => c.name),
        details: allCookies.map(c => ({
          name: c.name,
          hasValue: !!c.value,
          length: c.value?.length || 0,
          httpOnly: c.httpOnly,
          secure: c.secure,
          sameSite: c.sameSite,
          domain: c.domain,
          path: c.path,
        }))
      },
      nextAuth: {
        hasSession: !!nextAuthSession,
        sessionUser: nextAuthSession?.user ? {
          id: nextAuthSession.user.id,
          email: nextAuthSession.user.email,
          role: nextAuthSession.user.role,
        } : null,
      },
      jwtTokens: jwtAnalysis,
      diagnostics: {
        cookieStoreType: typeof cookieStore,
        cookieStoreKeys: Object.keys(cookieStore),
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}