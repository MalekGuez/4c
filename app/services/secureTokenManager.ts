/**
 * Secure Token Manager - Migrates from localStorage to HttpOnly cookies
 * This provides better security against XSS attacks
 */

import { getApiUrl } from '../config/api';

export interface TokenResponse {
  success: boolean;
  token?: string;
  error?: string;
}

// Configuration
const REQUEST_TIMEOUT = 10000;
const MAX_RETRIES = 2;

/**
 * Helper function to make requests with timeout and retry
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retries > 0 && (error instanceof Error && error.name === 'AbortError')) {
      console.warn(`Request timeout, retrying... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithTimeout(url, options, retries - 1);
    }
    
    throw error;
  }
}

export class SecureTokenManager {
  /**
   * Login and set HttpOnly cookie via API
   */
  static async login(credentials: { email: string; password: string }): Promise<TokenResponse> {
    try {
      const response = await fetchWithTimeout(getApiUrl('LOGIN'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout. Please try again.' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Register and set HttpOnly cookie via API
   */
  static async register(credentials: { email: string; password: string }): Promise<TokenResponse> {
    try {
      const response = await fetchWithTimeout(getApiUrl('REGISTER'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout. Please try again.' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Logout and clear HttpOnly cookie
   */
  static async logout(): Promise<void> {
    try {
      await fetch(getApiUrl('LOGOUT'), {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Check if user is authenticated by making a request to verify endpoint
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const response = await fetch(getApiUrl('VERIFY'), {
        method: 'GET',
        credentials: 'include',
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user data (token is handled server-side)
   */
  static async getUserData(): Promise<any> {
    try {
      const response = await fetch(getApiUrl('USER'), {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh token (handled server-side)
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(getApiUrl('REFRESH'), {
        method: 'POST',
        credentials: 'include',
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Enhanced API request function that uses cookies 
 * Automatically handles token refresh on 401 errors
 */
export const secureApiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<{ success: boolean; data?: T; error?: string }> => {
  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetchWithTimeout(`/api${endpoint}`, config);
    const data = await response.json();

    if (response.status === 401 && !isRetry) {
      console.log('Token expired, attempting refresh...');
      const refreshed = await SecureTokenManager.refreshToken();
      
      if (refreshed) {
        return secureApiRequest<T>(endpoint, options, true);
      } else {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return {
          success: false,
          error: 'Session expired. Please login again.',
        };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'An error occurred',
        data: data
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('API request error:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please try again.'
        };
      }
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: 'Network error occurred'
    };
  }
};
