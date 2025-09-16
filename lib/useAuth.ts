'use client';

import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { fetchJSON } = await import('@/lib/fetchJSON');
      const data = await fetchJSON('/api/auth/me');
      
      // Check if user data exists in response
      if (data?.ok && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { fetchJSON } = await import('@/lib/fetchJSON');
      const data = await fetchJSON('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      setUser(data?.user || null);
      // Refresh user data to ensure auth state is properly synced
      await refreshUser();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'ログインに失敗しました');
    }
  };

  const logout = async () => {
    try {
      const { fetchJSON } = await import('@/lib/fetchJSON');
      await fetchJSON('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    refreshUser
  };
}