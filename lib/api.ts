// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  profilePicture?: string;
  currency: string;
  monthlyBudget: number;
  theme: string;
  location: string;
  timezone: string;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  billReminders: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
  receiptUrl?: string;
  creditCardId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditCard {
  id: string;
  userId: string;
  name: string;
  lastFourDigits: string;
  issuer: string;
  billingCycle: number;
  dueDate: number;
  creditLimit: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalExpenses: number;
  monthlySpending: number;
  monthlyBudget: number;
  budgetRemaining: number;
  categoryBreakdown: Array<{
    category: string;
    total: number;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    total: number;
  }>;
  paymentMethodBreakdown: Array<{
    method: string;
    total: number;
    count: number;
    percentage: number;
  }>;
  recentExpenses: Expense[];
}

// Token management
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'user';

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// API Client with automatic token refresh
class ApiClient {
  private static isRefreshing = false;
  private static refreshSubscribers: Array<(token: string) => void> = [];

  private static subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private static onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newAccessToken = data.data.accessToken;
      TokenManager.setTokens(newAccessToken, refreshToken);
      return newAccessToken;
    } catch (error) {
      TokenManager.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
  }

  static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const accessToken = TokenManager.getAccessToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 - token expired
      if (response.status === 401 && accessToken) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            // Retry the original request with new token
            headers['Authorization'] = `Bearer ${newToken}`;
            return this.request(endpoint, options);
          }
        } else {
          // Wait for token refresh to complete
          return new Promise((resolve) => {
            this.subscribeTokenRefresh((token: string) => {
              headers['Authorization'] = `Bearer ${token}`;
              resolve(this.request(endpoint, options));
            });
          });
        }
      }

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Request failed',
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        statusCode: response.status,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  static async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API Service
export const api = {
  // Authentication
  auth: {
    login: (credentials: LoginCredentials) =>
      ApiClient.post<AuthResponse>('/auth/login', credentials),
    
    signup: (credentials: SignupCredentials) =>
      ApiClient.post<AuthResponse>('/auth/signup', credentials),
    
    logout: () =>
      ApiClient.post('/auth/logout'),
    
    refresh: (refreshToken: string) =>
      ApiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),
    
    getProfile: () =>
      ApiClient.get<User>('/auth/me'),
  },

  // User
  user: {
    getProfile: () =>
      ApiClient.get<User>('/user/profile'),
    
    updateProfile: (data: Partial<User>) =>
      ApiClient.patch<User>('/user/profile', data),
    
    changePassword: (oldPassword: string, newPassword: string) =>
      ApiClient.patch('/user/password', { oldPassword, newPassword }),
    
    updateNotifications: (preferences: Partial<User>) =>
      ApiClient.patch<User>('/user/notifications', preferences),
  },

  // Dashboard
  dashboard: {
    getData: () =>
      ApiClient.get<DashboardData>('/dashboard'),
    
    getAdminData: () =>
      ApiClient.get('/dashboard/admin'),
  },

  // Expenses
  expenses: {
    getAll: (params?: {
      category?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const query = queryParams.toString();
      return ApiClient.get<{ 
        expenses: Expense[]; 
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        summary?: any;
      }>(
        `/expenses${query ? `?${query}` : ''}`
      );
    },
    
    getById: (id: string) =>
      ApiClient.get<Expense>(`/expenses/${id}`),
    
    create: (expense: Partial<Expense>) =>
      ApiClient.post<Expense>('/expenses', expense),
    
    update: (id: string, expense: Partial<Expense>) =>
      ApiClient.patch<Expense>(`/expenses/${id}`, expense),
    
    delete: (id: string) =>
      ApiClient.delete(`/expenses/${id}`),
    
    bulkDelete: (ids: string[]) =>
      ApiClient.post('/expenses/bulk-delete', { ids }),
  },

  // Credit Cards
  creditCards: {
    getAll: () =>
      ApiClient.get<CreditCard[]>('/credit-cards'),
    
    getById: (id: string) =>
      ApiClient.get<CreditCard>(`/credit-cards/${id}`),
    
    create: (card: Partial<CreditCard>) =>
      ApiClient.post<CreditCard>('/credit-cards', card),
    
    update: (id: string, card: Partial<CreditCard>) =>
      ApiClient.patch<CreditCard>(`/credit-cards/${id}`, card),
    
    delete: (id: string) =>
      ApiClient.delete(`/credit-cards/${id}`),
    
    getPayments: (id: string) =>
      ApiClient.get(`/credit-card/${id}/payments`),
    
    addPayment: (id: string, payment: { amount: number; date: string }) =>
      ApiClient.post(`/credit-card/${id}/payment`, payment),
  },

  // Analytics
  analytics: {
    getOverview: (params?: { timeRange?: string; startDate?: string; endDate?: string }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      const query = queryParams.toString();
      return ApiClient.get(`/analytics/overview${query ? `?${query}` : ''}`);
    },
    
    getCategoryAnalytics: (params?: { startDate?: string; endDate?: string }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      const query = queryParams.toString();
      return ApiClient.get(`/analytics/category${query ? `?${query}` : ''}`);
    },
    
    getTrends: (params?: { period?: string; startDate?: string; endDate?: string }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      const query = queryParams.toString();
      return ApiClient.get(`/analytics/trends${query ? `?${query}` : ''}`);
    },
  },

  // Settings
  settings: {
    get: () =>
      ApiClient.get('/settings'),
    
    update: (settings: any) =>
      ApiClient.patch('/settings', settings),
  },

  // Categories
  categories: {
    getAll: () =>
      ApiClient.get('/category'),
  },
};

export { TokenManager };
export default api;
