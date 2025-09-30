import { apiRequest, tokenManager, API_ENDPOINTS, LoginResponse, RegisterResponse, User, ApiResponse } from './api';

// Types for user service
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

export class UserService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await apiRequest<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      tokenManager.setToken(response.data.token);
    }

    return response;
  }

  // Register new user
  static async register(credentials: RegisterCredentials): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiRequest<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      tokenManager.setToken(response.data.token);
    }

    return response;
  }

  // Update user profile
  static async updateProfile(userData: UpdateUserData): Promise<ApiResponse<User>> {
    return await apiRequest<User>(API_ENDPOINTS.USER.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Delete user account
  static async deleteAccount(): Promise<ApiResponse> {
    const response = await apiRequest(API_ENDPOINTS.USER.DELETE, {
      method: 'DELETE',
    });

    // Remove token after successful deletion
    if (response.success) {
      tokenManager.removeToken();
    }

    return response;
  }

  // Verify token validity
  static async verifyToken(): Promise<ApiResponse<User>> {
    return await apiRequest<User>(API_ENDPOINTS.AUTH.VERIFY, {
      method: 'GET',
    });
  }

  // Refresh token
  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiRequest<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
    });

    if (response.success && response.data?.token) {
      tokenManager.setToken(response.data.token);
    }

    return response;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  // Get current token
  static getToken(): string | null {
    return tokenManager.getToken();
  }

  // Clear authentication (logout without API call)
  static clearAuth(): void {
    tokenManager.removeToken();
  }
}

// Export individual functions for convenience
export const {
  login,
  register,
  updateProfile,
  deleteAccount,
  verifyToken,
  refreshToken,
  isAuthenticated,
  getToken,
  clearAuth
} = UserService;
