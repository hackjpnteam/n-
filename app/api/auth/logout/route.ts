import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      deleteSession(token);
    }

    const response = NextResponse.json({
      message: 'ログアウトしました'
    });

    // Clear cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'ログアウト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods explicitly
export async function GET() {
  console.log('❌ GET method not allowed for logout');
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for logout.' },
    { status: 405, headers: { 'Allow': 'POST, OPTIONS' } }
  );
}

export async function PUT() {
  console.log('❌ PUT method not allowed for logout');
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for logout.' },
    { status: 405, headers: { 'Allow': 'POST, OPTIONS' } }
  );
}

export async function PATCH() {
  console.log('❌ PATCH method not allowed for logout');
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for logout.' },
    { status: 405, headers: { 'Allow': 'POST, OPTIONS' } }
  );
}

export async function DELETE() {
  console.log('❌ DELETE method not allowed for logout');
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for logout.' },
    { status: 405, headers: { 'Allow': 'POST, OPTIONS' } }
  );
}

export async function OPTIONS() {
  console.log('✅ OPTIONS preflight request for logout');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}