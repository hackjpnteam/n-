import { NextResponse } from 'next/server';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // 環境変数の存在確認（値は表示しない）
  const envCheck = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: !!process.env.VERCEL,
  };

  return NextResponse.json({
    status: 'Environment Check',
    env: envCheck,
    timestamp: new Date().toISOString()
  });
}