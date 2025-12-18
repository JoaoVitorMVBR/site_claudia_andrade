import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = (redirectTo?: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
      setIsAuthenticated(isLoggedIn);
      
      if (!isLoggedIn && redirectTo) {
        router.push(redirectTo);
      }
      
      setLoading(false);
    }
  }, [router, redirectTo]);

  const login = () => {
    localStorage.setItem('isAdminLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsAuthenticated(false);
    if (redirectTo) router.push(redirectTo);
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
  };
};
