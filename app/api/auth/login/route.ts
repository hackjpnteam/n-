import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    error: "Use /api/auth/signin instead",
    redirect: "/api/auth/signin"
  }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ 
    error: "Use /api/auth/signin instead",
    redirect: "/api/auth/signin"
  }, { status: 405 });
}