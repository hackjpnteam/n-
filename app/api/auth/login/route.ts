import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, createSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login POST request received');
    console.log('🔍 Request method:', request.method);
    console.log('🔍 Request URL:', request.url);
    
    const body = await request.json().catch((error) => {
      console.error('❌ Failed to parse JSON:', error);
      return null;
    });
    
    if (!body) {
      console.error('❌ Empty or invalid request body');
      return NextResponse.json(
        { error: '無効なリクエストです' },
        { status: 400 }
      );
    }

    const { email, password } = body;
    console.log('🔍 Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.error('❌ Missing email or password');
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }

    // Find user
    console.log('🔍 Looking up user by email...');
    const user = await getUserByEmail(email);
    if (!user) {
      console.error('❌ User not found for email:', email);
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    console.log('✅ User found:', user.name);

    // Verify password
    console.log('🔍 Verifying password...');
    if (!verifyPassword(password, user.passwordHash)) {
      console.error('❌ Password verification failed');
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    console.log('✅ Password verified');

    // Create session
    console.log('🔍 Creating session...');
    const token = createSession(user.id);
    console.log('✅ Session created, token:', token.substring(0, 10) + '...');

    // Return success with user data
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: 'ログインしました'
    });

    // Set cookie
    const isProduction = process.env.NODE_ENV === 'production';
    console.log('🔍 Setting cookie, production mode:', isProduction);
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    console.log('✅ Login successful, cookie set');
    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods explicitly
export async function GET() {
  console.log('❌ GET method not allowed for login');
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for login.' },
    { status: 405, headers: { 'Allow': 'POST, OPTIONS' } }
  );
}

export async function PUT() {
  console.log('❌ PUT method not allowed for login');
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for login.' },
    { status: 405, headers: { 'Allow': 'POST, OPTIONS' } }
  );
}

export async function PATCH() {
  console.log('❌ PATCH method not allowed for login');
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for login.' },
    { status: 405, headers: { 'Allow': 'POST, OPTIONS' } }
  );
}

export async function DELETE() {
  console.log('❌ DELETE method not allowed for login');
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for login.' },
    { status: 405, headers: { 'Allow': 'POST, OPTIONS' } }
  );
}

export async function OPTIONS() {
  console.log('✅ OPTIONS preflight request for login');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}