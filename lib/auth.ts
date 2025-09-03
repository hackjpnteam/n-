import crypto from 'crypto';

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate session token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Mock user storage (in production, use database)
interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

// In-memory storage for demo
const users: Map<string, User> = new Map();
const sessions: Map<string, string> = new Map(); // token -> userId

export function createUser(email: string, name: string, password: string, role: 'user' | 'admin' = 'user'): User | null {
  if (getUserByEmail(email)) {
    return null; // User already exists
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash: hashPassword(password),
    role,
    createdAt: new Date()
  };

  users.set(user.id, user);
  return user;
}

export function getUserByEmail(email: string): User | null {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

export function getUserById(id: string): User | null {
  return users.get(id) || null;
}

export function createSession(userId: string): string {
  const token = generateToken();
  sessions.set(token, userId);
  return token;
}

export function getUserFromSession(token: string): User | null {
  const userId = sessions.get(token);
  if (!userId) return null;
  return getUserById(userId);
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

// Initialize with demo users
function initDemoUsers() {
  if (users.size === 0) {
    createUser('demo@example.com', 'デモユーザー', 'password123');
    createUser('admin@example.com', '管理者', 'admin123', 'admin');
    createUser('tomura@hackjpn.com', '管理者 Tomura', 'admin123', 'admin');
    console.log('Demo users initialized');
  }
}

// Initialize demo users
initDemoUsers();