'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthLogic() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
      if (session?.user) {
        setUser({
          id: session.user.id || '',
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: 'user'
        });
      } else {
        setUser(null);
      }
    }
  }, [session, status]);

  const refreshUser = async () => {
    // NextAuth automatically manages session refresh
    // This is kept for backwards compatibility
    if (session?.user) {
      setUser({
        id: session.user.id || '',
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: 'user'
      });
    }
  };

  const login = async (email: string, password: string) => {
    // NextAuth v5 only supports OAuth providers in this setup
    // Redirect to Google login
    await nextAuthSignIn('google', { callbackUrl: '/mypage' });
  };

  const logout = async () => {
    await nextAuthSignOut({ callbackUrl: '/' });
  };

  return {
    user,
    loading,
    login,
    logout,
    refreshUser
  };
}