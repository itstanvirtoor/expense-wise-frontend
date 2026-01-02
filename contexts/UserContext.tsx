"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, User } from "@/lib/api";

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  currency: string;
  timezone: string;
  location: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.auth.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value: UserContextType = {
    user,
    loading,
    refreshUser,
    currency: user?.currency || "USD",
    timezone: user?.timezone || "America/New_York",
    location: user?.location || "United States",
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
