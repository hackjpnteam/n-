import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    error: "Use NextAuth signin endpoint instead",
    redirect: "/api/auth/signin/credentials"
  }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ 
    error: "Use NextAuth signin endpoint instead", 
    redirect: "/api/auth/signin/credentials"
  }, { status: 405 });
}