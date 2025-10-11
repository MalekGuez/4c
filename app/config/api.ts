/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.4chaos.com/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://37.187.48.183:8080/api';
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
