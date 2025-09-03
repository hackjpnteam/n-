'use client';

import { AuthContext, useAuthLogic } from '@/lib/useAuth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const authValue = useAuthLogic();

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}