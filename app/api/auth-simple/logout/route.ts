import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.delete('session-token');
  
  return response;
}