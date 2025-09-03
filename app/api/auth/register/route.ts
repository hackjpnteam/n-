import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: '必須項目を入力してください' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'パスワードは6文字以上にしてください' },
        { status: 400 }
      );
    }

    // Create user
    const user = createUser(email, name, password);
    if (!user) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // Create session
    const token = createSession(user.id);

    // Return success with user data and token
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      message: '登録が完了しました'
    });

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Allow HTTP for localhost development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '登録処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}