import { apiRequest, tokenManager, API_ENDPOINTS, LoginResponse, RegisterResponse, User, ApiResponse } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username?: string;
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

  static async updateProfile(userData: UpdateUserData): Promise<ApiResponse<User>> {
    return await apiRequest<User>(API_ENDPOINTS.USER.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  static async deleteAccount(): Promise<ApiResponse> {
    const response = await apiRequest(API_ENDPOINTS.USER.DELETE, {
      method: 'DELETE',
    });

    if (response.success) {
      tokenManager.removeToken();
    }

    return response;
  }

  static async verifyToken(): Promise<ApiResponse<User>> {
    return await apiRequest<User>(API_ENDPOINTS.AUTH.VERIFY, {
      method: 'GET',
    });
  }

  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiRequest<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
    });

    if (response.success && response.data?.token) {
      tokenManager.setToken(response.data.token);
    }

    return response;
  }

  static isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  static getToken(): string | null {
    return tokenManager.getToken();
  }

  static clearAuth(): void {
    tokenManager.removeToken();
  }
}

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
