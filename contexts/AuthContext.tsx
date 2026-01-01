"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, TokenManager, User, LoginCredentials, SignupCredentials } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = TokenManager.getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try to get user profile
      const response = await api.auth.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        TokenManager.setUser(response.data);
      } else {
        // Token might be invalid
        TokenManager.clearTokens();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      TokenManager.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.auth.login(credentials);
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        TokenManager.setTokens(accessToken, refreshToken);
        TokenManager.setUser(user);
        setUser(user);
        return { success: true };
      }
      
      return { 
        success: false, 
        message: response.message || 'Login failed' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'An error occurred during login' 
      };
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.auth.signup(credentials);
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        TokenManager.setTokens(accessToken, refreshToken);
        TokenManager.setUser(user);
        setUser(user);
        return { success: true };
      }
      
      return { 
        success: false, 
        message: response.message || 'Signup failed' 
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: 'An error occurred during signup' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.auth.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        TokenManager.setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route wrapper
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
