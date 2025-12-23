'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser } from '@/lib/api';

interface User {
  id: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authenticated: false,
  refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const result = await getCurrentUser();
      if (result.authenticated && result.user) {
        setUser(result.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshAuth = async () => {
    setLoading(true);
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, authenticated: !!user, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
