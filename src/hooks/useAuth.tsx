import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { AuthUser, LoginCredentials } from "../types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("access_token"),
  );
  const [isAuthReady, setIsAuthReady] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isUserLoading,
    isFetching,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
    staleTime: Infinity, // Prevent automatic refetches
    gcTime: Infinity, // Keep in cache forever (was cacheTime in older versions)
    refetchOnMount: false, // Don't refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  // Track when auth state is ready (not in the middle of logging in)
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthReady(true);
    } else if (isAuthenticated && user) {
      setIsAuthReady(true);
    } else if (isAuthenticated && !isUserLoading && !isFetching) {
      // If authenticated but no user and not loading, something's wrong
      setIsAuthReady(true);
    } else {
      setIsAuthReady(false);
    }
  }, [isAuthenticated, user, isUserLoading, isFetching]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setIsAuthenticated(true);
      setIsAuthReady(false); // Mark as not ready until user is fetched
      // Use refetchQueries instead of invalidateQueries to wait for completion
      await queryClient.refetchQueries({ queryKey: ["currentUser"] });
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setIsAuthenticated(true);
      setIsAuthReady(false); // Mark as not ready until user is fetched
      // Use refetchQueries instead of invalidateQueries to wait for completion
      await queryClient.refetchQueries({ queryKey: ["currentUser"] });
    },
  });

  const login = async (credentials: LoginCredentials) => {
    // Clear any stale tokens before attempting login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);

    try {
      await loginMutation.mutateAsync(credentials);
    } catch (error: any) {
      // Ensure we stay logged out on failure
      setIsAuthenticated(false);
      throw error;
    }
  };

  const googleLogin = async (idToken: string) => {
    // Clear any stale tokens before attempting login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);

    try {
      await googleLoginMutation.mutateAsync(idToken);
    } catch (error: any) {
      // Ensure we stay logged out on failure
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      authApi.logout(refreshToken).catch(() => {});
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setIsAuthReady(true);
    queryClient.clear();
  };

  const value = {
    user: user || null,
    isLoading: !isAuthReady, // Only loading when auth state is not ready
    isAuthenticated,
    login,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
