"use client";

import { useState, useEffect, useCallback } from 'react';
import { UserService, User, LoginCredentials, RegisterCredentials, UpdateUserData } from '../services';
import { setGlobalLogoutCallback } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (typeof window !== 'undefined' && UserService.isAuthenticated()) {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          return {
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          };
        } catch (error) {
          localStorage.removeItem('userData');
          UserService.clearAuth();
        }
      }
    }
    
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  });

  useEffect(() => {
    setGlobalLogoutCallback(() => {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired. Please log in again.',
      });
      localStorage.removeItem('userData');
    });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await UserService.login(credentials);
      
      if (response.success && response.data) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, data: response.data };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Login failed',
        }));
        return { success: false, error: response.error || 'Login failed' };
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
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await UserService.register(credentials);
      
      if (response.success && response.data) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, data: response.data };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Registration failed',
        }));
        return { success: false, error: response.error || 'Registration failed' };
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
    // Clear token and user data from localStorage
    UserService.clearAuth();
    localStorage.removeItem('userData');
    
    // Clear auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const updateProfile = useCallback(async (userData: UpdateUserData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await UserService.updateProfile(userData);
      
      if (response.success && response.data) {
        // Update user data in localStorage
        localStorage.setItem('userData', JSON.stringify(response.data));
        setAuthState(prev => ({
          ...prev,
          user: response.data!,
          isLoading: false,
          error: null,
        }));
        return { success: true, data: response.data };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Update failed',
        }));
        return { success: false, error: response.error || 'Update failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
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
    updateProfile,
    clearError,
  };
};
