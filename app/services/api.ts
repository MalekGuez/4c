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
  status: 'opened' | 'closed';
  userId: number;
  operatedBy?: number;
  createdAt?: string;
  description?: string; // Description comes from first user message
  state?: number; // Authority level where ticket is handled (1-5)
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  message: string;
  userId: number;
  date: string;
  isStaff?: boolean;
  szUserID?: string;
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
    ESCALATE_TICKET: '/admin/tickets',
    RESPOND_TICKET: '/admin/tickets',
  },
  MOONSTONES: '/get-ms',
  BUY_ITEM: '/buy-item',
} as const;

// Manager API functions
export const managerService = {
  // Get manager name by ID
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
const adminRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
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

  // Get players list
  getPlayers: async (search?: string): Promise<{ success: boolean; players?: any[]; error?: string }> => {
    const url = search ? `${API_ENDPOINTS.ADMIN.PLAYERS}?search=${encodeURIComponent(search)}` : API_ENDPOINTS.ADMIN.PLAYERS;
    const response = await adminRequest<any>(url);
    if (response.success && response.data) {
      return {
        success: true,
        players: response.data.players
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
  }
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

