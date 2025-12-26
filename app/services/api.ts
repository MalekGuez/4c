const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.4chaos.com/api';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    isOnline: boolean;
  };
  token: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    isOnline: boolean;
  };
  token: string;
}

export interface User {
  id: string;
  email: string;
  isOnline: boolean;
  verified?: boolean;
}

export interface Manager {
  szID: string;
  szName: string;
  bAuthority: number;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  manager?: Manager;
  error?: string;
}

export interface EscalateTicketRequest {
  newState: number;
}

export interface RespondToTicketRequest {
  message: string;
}

export interface MoonstonesResponse {
  success: boolean;
  moonstones: number;
}

export interface BuyItemRequest {
  itemId: number;
  quantity: number;
  totalPrice: number;
}

export interface BuyItemResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Ticket types
export interface Ticket {
  id: number;
  title: string;
  category: string;
  status: 'opened' | 'closed' | 'pending';
  userId: number;
  operatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  state?: number;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  message: string;
  userId: number | string;
  date: string;
  isStaff?: boolean | number;
  isStaffMessage?: number;
  szUserID?: string;
  szEmail?: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category?: string;
}

export interface CreateTicketResponse {
  success: boolean;
  ticketId?: number;
  message?: string;
  error?: string;
}

export interface AddMessageRequest {
  message: string;
}

export interface TicketResponse {
  success: boolean;
  ticket?: Ticket;
  error?: string;
}

export interface TicketsResponse {
  success: boolean;
  tickets?: Ticket[];
  error?: string;
}


// Token management
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },

  // Clear all auth-related data
  clearAllAuthData: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('adminToken');
    }
  }
};

// Global logout callback - will be set by the auth context
let globalLogoutCallback: (() => void) | null = null;

export const setGlobalLogoutCallback = (callback: () => void) => {
  globalLogoutCallback = callback;
};

// Redirect to home page after logout - but only if not already on home/login/register
const redirectToHome = () => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register') {
      console.log('Redirecting to home page due to token expiry...');
      window.location.href = '/';
    }
  }
};

// Base API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = tokenManager.getToken();
  
  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle 401 Unauthorized - token expired or invalid
    const isAuthEndpoint = endpoint === API_ENDPOINTS.AUTH.LOGIN || 
                          endpoint === API_ENDPOINTS.AUTH.REGISTER ||
                          endpoint === API_ENDPOINTS.ADMIN.LOGIN;
    
    if (response.status === 401) {
      // For auth endpoints, 401 means invalid credentials, not expired session
      if (isAuthEndpoint) {
        return {
          success: false,
          error: data.message || data.error || 'Invalid credentials',
          data: data
        };
      }
      
      // For other endpoints, 401 means session expired
      console.log('⚠️ Token expired or invalid - logging out');
      tokenManager.clearAllAuthData();
      if (globalLogoutCallback) {
        globalLogoutCallback();
      }
      redirectToHome();
      
      return {
        success: false,
        error: 'Session expired. Please log in again.',
        data: data
      };
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
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    REFRESH: '/refresh',
    VERIFY: '/verify',
    RESEND_VERIFICATION: '/resend-verification',
    CHANGE_PASSWORD: '/change-password',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
  },
  TICKETS: {
    LIST: '/tickets',
    GET: '/tickets',
    CREATE: '/tickets',
    ADD_MESSAGE: '/tickets',
    CLOSE: '/tickets',
  },
  MANAGERS: {
    GET: '/managers',
  },
  ADMIN: {
    LOGIN: '/admin/login',
    TICKETS: '/admin/tickets',
    PLAYERS: '/admin/players',
    NEWS: '/admin/news',
    COUPONS: '/admin/coupons',
    ESCALATE_TICKET: '/admin/tickets',
    RESPOND_TICKET: '/admin/tickets',
  },
  MOONSTONES: '/get-ms',
  BUY_ITEM: '/buy-item',
  REDEEM_COUPON: '/redeem-coupon',
  CLASH_GAUNTLET: {
    RANKINGS: '/clash-gauntlet/rankings',
  },
} as const;

// Manager API functions
export const managerService = {
  // Get manager name by ID (for regular users)
  getManagerName: async (managerId: string): Promise<{ success: boolean; name?: string; error?: string }> => {
    const response = await apiRequest<{ success: boolean; name: string }>(`${API_ENDPOINTS.MANAGERS.GET}/${managerId}`);
    if (response.success && response.data) {
      return {
        success: true,
        name: response.data.name
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to get manager name'
    };
  }
};

// Helper function for authenticated admin requests
const adminRequest = async <T>(endpoint: string, options: RequestInit = {}, skipRedirect = false): Promise<ApiResponse<T>> => {
  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminToken) {
    throw new Error('Admin token not found');
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle 401 Unauthorized - admin token expired or invalid
    if (response.status === 401 || response.status === 403) {
      // Only redirect if skipRedirect is false (default behavior for critical requests)
      if (!skipRedirect) {
        console.log('⚠️ Admin token expired or invalid - redirecting to admin login');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminManager');
        
        // Redirect to admin login
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      } else {
        // For non-critical requests, just return error without redirecting
        console.log('⚠️ Admin request failed (non-critical):', endpoint);
      }
      
      return {
        success: false,
        error: 'Admin session expired. Please log in again.',
        data: data
      };
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
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

// Admin API functions
export const adminService = {
  // Admin login
  login: async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await apiRequest<AdminLoginResponse>(API_ENDPOINTS.ADMIN.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    return {
      success: false,
      error: response.error || 'Login failed'
    };
  },

  // Get all tickets for admin
  getAllTickets: async (): Promise<{ success: boolean; tickets?: any[]; error?: string }> => {
    const response = await adminRequest<any>(API_ENDPOINTS.ADMIN.TICKETS);
    if (response.success && response.data) {
      return {
        success: true,
        tickets: response.data.tickets
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch tickets'
    };
  },

  // Get single ticket details
  getTicket: async (ticketId: number): Promise<{ success: boolean; ticket?: any; error?: string }> => {
    const response = await adminRequest<any>(`/admin/tickets/${ticketId}`);
    if (response.success && response.data) {
      return {
        success: true,
        ticket: response.data.ticket
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch ticket'
    };
  },

  // Get players list with pagination
  getPlayers: async (search?: string, offset = 0, limit = 50): Promise<{ success: boolean; players?: any[]; hasMore?: boolean; error?: string }> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    
    const url = `${API_ENDPOINTS.ADMIN.PLAYERS}?${params.toString()}`;
    const response = await adminRequest<any>(url);
    
    if (response.success && response.data) {
      return {
        success: true,
        players: response.data.players,
        hasMore: response.data.hasMore
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch players'
    };
  },

  // Get news for admin
  getNews: async (): Promise<{ success: boolean; news?: any[]; error?: string }> => {
    const response = await adminRequest<any>(API_ENDPOINTS.ADMIN.NEWS);
    if (response.success && response.data) {
      return {
        success: true,
        news: response.data.news
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch news'
    };
  },

  // Escalate ticket to higher authority level
  escalateTicket: async (ticketId: number, newState: number): Promise<{ success: boolean; error?: string }> => {
    const response = await adminRequest<any>(`${API_ENDPOINTS.ADMIN.ESCALATE_TICKET}/${ticketId}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ newState })
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to escalate ticket'
    };
  },

  // Respond to ticket (updates state and operatedBy)
  respondToTicket: async (ticketId: number, message: string): Promise<{ success: boolean; error?: string }> => {
    const response = await adminRequest<any>(`${API_ENDPOINTS.ADMIN.RESPOND_TICKET}/${ticketId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to respond to ticket'
    };
  },

  // Admin delete message
  deleteMessage: async (messageId: number): Promise<{ success: boolean; error?: string }> => {
    const response = await adminRequest<any>(`/admin/messages/${messageId}`, {
      method: 'DELETE'
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to delete message'
    };
  },

  // Admin close ticket
  closeTicket: async (ticketId: number): Promise<{ success: boolean; error?: string }> => {
    const response = await adminRequest<any>(`/admin/tickets/${ticketId}/close`, {
      method: 'PATCH'
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to close ticket'
    };
  },

  // Admin get HWID sessions
  getHWIDSessions: async (dwUserID: number): Promise<{ success: boolean; sessions?: any[]; error?: string }> => {
    const response = await adminRequest<any>(`/admin/players/${dwUserID}/hwid-sessions`, {
      method: 'GET'
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        sessions: response.data.sessions
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to retrieve HWID sessions'
    };
  },

  // Admin ban player
  banPlayer: async (dwUserID: number, banData: any): Promise<{ success: boolean; error?: string }> => {
    const requestData = {
      ...banData,
      dwUserID: dwUserID,
      bWorld: banData.bWorld !== undefined ? banData.bWorld : 1
    };
    
    const dwCharID = banData.dwCharID || dwUserID;
    const response = await adminRequest<any>(`/admin/players/${dwCharID}/ban`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to ban player'
    };
  },

  // Admin ban mode player (TBANBMTABLE)
  banModePlayer: async (dwUserID: number, banDuration: number, szReason: string): Promise<{ success: boolean; error?: string; banEndDate?: string }> => {
    const response = await adminRequest<any>('/admin/ban-mode', {
      method: 'POST',
      body: JSON.stringify({ dwUserID, banDuration, szReason })
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        banEndDate: response.data.banEndDate
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to ban player from game mode'
    };
  },

  // Admin ban trade player (TBANTRADETABLE)
  banTradePlayer: async (dwUserID: number, banDuration: number, szReason: string): Promise<{ success: boolean; error?: string; banEndDate?: string }> => {
    const response = await adminRequest<any>('/admin/ban-trade', {
      method: 'POST',
      body: JSON.stringify({ dwUserID, banDuration, szReason })
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        banEndDate: response.data.banEndDate
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to ban player from trading'
    };
  },

  // Admin get user ban status
  getUserBanStatus: async (dwUserID: number): Promise<{ success: boolean; banStatus?: any; error?: string }> => {
    const response = await adminRequest<any>(`/admin/user-ban-status/${dwUserID}`, {
      method: 'GET'
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        banStatus: response.data.banStatus
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to get user ban status'
    };
  },

  // Admin unban mode player
  unbanModePlayer: async (dwUserID: number): Promise<{ success: boolean; error?: string }> => {
    const response = await adminRequest<any>('/admin/unban-mode', {
      method: 'POST',
      body: JSON.stringify({ dwUserID })
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to unban player from game mode'
    };
  },

  // Admin unban trade player
  unbanTradePlayer: async (dwUserID: number): Promise<{ success: boolean; error?: string }> => {
    const response = await adminRequest<any>('/admin/unban-trade', {
      method: 'POST',
      body: JSON.stringify({ dwUserID })
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to unban player from trading'
    };
  },

  // Admin kick player
  kickPlayer: async (dwCharID: number): Promise<{ success: boolean; error?: string }> => {
    const response = await adminRequest<any>('/admin/kick-player', {
      method: 'POST',
      body: JSON.stringify({ dwCharID })
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to kick player'
    };
  },

  // Admin add warning
  addWarning: async (dwUserID: number, szReason: string): Promise<{ success: boolean; error?: string; warningId?: string }> => {
    const response = await adminRequest<any>('/admin/warnings', {
      method: 'POST',
      body: JSON.stringify({ dwUserID, szReason })
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        warningId: response.data.warningId
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to issue warning'
    };
  },

  // Admin get user warnings
  getUserWarnings: async (dwUserID: number): Promise<{ success: boolean; warnings?: any[]; error?: string }> => {
    const response = await adminRequest<any>(`/admin/warnings/${dwUserID}`, {
      method: 'GET'
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        warnings: response.data.warnings
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to get user warnings'
    };
  },

  // Admin delete warning
  deleteWarning: async (warningId: string, dwUserID: number): Promise<{ success: boolean; error?: string }> => {
    const response = await adminRequest<any>(`/admin/warnings/${warningId}`, {
      method: 'DELETE',
      body: JSON.stringify({ dwUserID })
    });
    
    if (response.success && response.data) {
      return {
        success: true
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to delete warning'
    };
  },

  // Get manager name by ID (for admin - uses admin token)
  // Uses skipRedirect=true to avoid disconnecting user if endpoint is not accessible
  getManagerName: async (managerId: string): Promise<{ success: boolean; name?: string; error?: string }> => {
    // Try admin endpoint first, then fallback to regular endpoint
    let response = await adminRequest<{ success: boolean; name: string }>(`/admin/managers/${managerId}`, {}, true);
    
    // If admin endpoint doesn't work, try regular endpoint with skipRedirect
    if (!response.success) {
      response = await adminRequest<{ success: boolean; name: string }>(`${API_ENDPOINTS.MANAGERS.GET}/${managerId}`, {}, true);
    }
    
    if (response.success && response.data) {
      return {
        success: true,
        name: response.data.name
      };
    }
    // Return success: false but don't throw - this is a non-critical operation
    return {
      success: false,
      error: response.error || 'Failed to get manager name'
    };
  },

  // Get all coupons
  getCoupons: async (): Promise<{ success: boolean; coupons?: any[]; error?: string }> => {
    const response = await adminRequest<any>(API_ENDPOINTS.ADMIN.COUPONS);
    if (response.success && response.data) {
      return {
        success: true,
        coupons: response.data.coupons
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch coupons'
    };
  },

  // Create coupon
  createCoupon: async (couponData: {
    code: string;
    description?: string;
    items: Array<{ wID: number; itemCount?: number }>;
    maxUses?: number;
    isActive?: boolean;
    expiryDate?: string;
  }): Promise<{ success: boolean; couponId?: number; error?: string }> => {
    console.log('Sending coupon data:', couponData); // Debug log
    const response = await adminRequest<any>(API_ENDPOINTS.ADMIN.COUPONS, {
      method: 'POST',
      body: JSON.stringify(couponData)
    });
    console.log('Coupon creation response:', response); // Debug log
    if (response.success && response.data) {
      return {
        success: true,
        couponId: response.data.couponId
      };
    }
    return {
      success: false,
      error: response.error || response.data?.error || 'Failed to create coupon'
    };
  },

  // Get coupon redemption history
  getCouponHistory: async (couponId: number): Promise<{ success: boolean; history?: any[]; error?: string }> => {
    const response = await adminRequest<any>(`${API_ENDPOINTS.ADMIN.COUPONS}/${couponId}/history`);
    if (response.success && response.data) {
      return {
        success: true,
        history: response.data.history
      };
    }
    return {
      success: false,
      error: response.error || 'Failed to fetch coupon history'
    };
  },
};

// Ticket API functions
export const ticketService = {
  // Get all tickets for authenticated user
  getTickets: async (): Promise<TicketsResponse> => {
    const response = await apiRequest<any>(API_ENDPOINTS.TICKETS.LIST);
    if (response.success && response.data) {
      return {
        success: true,
        tickets: response.data.tickets || response.data.data || response.data,
        error: response.data.error
      };
    }
    return response as TicketsResponse;
  },

  // Get ticket by ID with messages
  getTicket: async (id: number): Promise<TicketResponse> => {
    const response = await apiRequest<any>(`${API_ENDPOINTS.TICKETS.GET}/${id}`);
    if (response.success && response.data) {
      return {
        success: true,
        ticket: response.data.ticket || response.data.data || response.data,
        error: response.data.error
      };
    }
    return response as TicketResponse;
  },

  // Create new ticket
  createTicket: async (data: CreateTicketRequest): Promise<CreateTicketResponse> => {
    const response = await apiRequest<any>(API_ENDPOINTS.TICKETS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return {
        success: true,
        ticketId: response.data.ticketId || response.data.data?.ticketId,
        message: response.data.message || response.data.data?.message,
        error: response.data.error
      };
    }
    return response as CreateTicketResponse;
  },

  // Add message to ticket
  addMessage: async (ticketId: number, data: AddMessageRequest): Promise<ApiResponse> => {
    const response = await apiRequest<any>(`${API_ENDPOINTS.TICKETS.ADD_MESSAGE}/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message || response.data.data?.message,
        error: response.data.error
      };
    }
    return response;
  },

  closeTicket: async (ticketId: number): Promise<ApiResponse> => {
    const response = await apiRequest<any>(`${API_ENDPOINTS.TICKETS.CLOSE}/${ticketId}/close`, {
      method: 'PATCH',
    });
    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message || response.data.data?.message,
        error: response.data.error
      };
    }
    return response;
  },
};

// Clash Gauntlet API functions
export interface ClashGauntletRanking {
  dwCharID: number;
  szName: string;
  bClass: number;
  wWins: number;
  wLosses?: number;
  totalPoints: number;
  rank: number;
}

export interface ClashGauntletRankingsResponse {
  success: boolean;
  rankings?: ClashGauntletRanking[];
  error?: string;
}

export const clashGauntletService = {
  // Get Clash Gauntlet rankings
  getRankings: async (): Promise<ClashGauntletRankingsResponse> => {
    const response = await apiRequest<any>(API_ENDPOINTS.CLASH_GAUNTLET.RANKINGS);
    if (response.success && response.data) {
      return {
        success: true,
        rankings: response.data.rankings || response.data.data || response.data,
        error: response.data.error
      };
    }
    return response as ClashGauntletRankingsResponse;
  },
};

// Coupon API functions
export interface RedeemCouponRequest {
  code: string;
}

export interface RedeemCouponResponse {
  success: boolean;
  message?: string;
  items?: Array<{ itemId: number; itemCount: number }>;
  itemId?: number; // Legacy support
  itemCount?: number; // Legacy support
  error?: string;
}

export const couponService = {
  // Redeem a coupon
  redeemCoupon: async (code: string): Promise<RedeemCouponResponse> => {
    const response = await apiRequest<any>(API_ENDPOINTS.REDEEM_COUPON, {
      method: 'POST',
      body: JSON.stringify({ code: code.trim().toUpperCase() })
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message,
        items: response.data.items || (response.data.itemId ? [{ itemId: response.data.itemId, itemCount: response.data.itemCount || 1 }] : []),
        itemId: response.data.itemId, // Legacy support
        itemCount: response.data.itemCount // Legacy support
      };
    }
    return {
      success: false,
      error: response.error || response.data?.error || 'Failed to redeem coupon'
    };
  },
};

