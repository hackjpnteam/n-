// Simple authentication system to replace NextAuth v5
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface SessionToken {
  userId: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    // Dynamic import to avoid Edge Runtime issues
    const mongoose = await import('mongoose');
    const { default: UserModel } = await import('../models/User');

    // Connect to MongoDB
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const user = await UserModel.findOne({ 
      email: email.toLowerCase() 
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return {
      id: (user as any)._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function createSessionToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // 7 days
  });
}

export function verifySessionToken(token: string): SessionToken | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionToken;
    return payload;
  } catch (error) {
    return null;
  }
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set('session-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function getSessionCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get('session-token')?.value;
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete('session-token');
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getSessionCookie();
  if (!token) {
    return null;
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return null;
  }

  return {
    id: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}