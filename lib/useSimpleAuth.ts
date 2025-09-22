'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useSimpleAuth(requireAdmin: boolean = false) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth-simple/session');
        const sessionData = await response.json();
        
        if (!sessionData || !sessionData.user) {
          // No session, redirect to login
          router.push('/auth/login');
          return;
        }

        // Check admin requirement
        if (requireAdmin && sessionData.user.role !== 'admin') {
          router.push('/'); // Redirect non-admin users to home
          return;
        }

        setUser(sessionData.user);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router, requireAdmin]);

  return { user, loading };
}