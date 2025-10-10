/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

const getApiBaseUrl = () => {
  // In production (Vercel), use your VM server URL
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.4chaos.com/api';
  }
  
  // In development, use localhost
  return 'http://localhost:8080/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    VERIFY: '/verify',
    USER: '/user',
    REFRESH: '/refresh',
  }
} as const;

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};
