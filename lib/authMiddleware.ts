import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from './auth';

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = await getUserFromSession(token);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );
  }

  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request);
  
  if (user instanceof NextResponse) {
    return user; // Return the error response
  }
  
  if (user!.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  return user;
}