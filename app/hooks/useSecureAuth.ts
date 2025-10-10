import { useState, useEffect, useCallback } from 'react';
import { SecureTokenManager } from '../services/secureTokenManager';

interface User {
  id: string;
  email: string;
  isOnline: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        
        const isAuth = await SecureTokenManager.isAuthenticated();
        
        if (isAuth) {
          const userData = await SecureTokenManager.getUserData();
          setAuthState({
            user: userData?.user || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to check authentication status',
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await SecureTokenManager.login(credentials);
      
      if (result.success) {
        // Get user data after successful login
        const userData = await SecureTokenManager.getUserData();
        setAuthState({
          user: userData?.user || null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, data: userData };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Login failed',
        }));
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await SecureTokenManager.register(credentials);
      
      if (result.success) {
        // Get user data after successful registration
        const userData = await SecureTokenManager.getUserData();
        setAuthState({
          user: userData?.user || null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, data: userData };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Registration failed',
        }));
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await SecureTokenManager.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
  };
};
