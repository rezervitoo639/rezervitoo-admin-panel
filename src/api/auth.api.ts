import apiClient from "./index";
import type {
  LoginCredentials,
  TokenResponse,
  AuthUser,
} from "../types/auth.types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(
      "/users/login/",
      credentials,
    );
    return response.data;
  },

  googleLogin: async (idToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<{
      user: any;
      tokens: { access: string; refresh: string };
      created: boolean;
      message: string;
    }>("/users/login/google/", {
      id_token: idToken,
      is_admin_panel: true, // CRITICAL: Mark this as admin panel login
    });

    // Transform response to match TokenResponse format
    return {
      access: response.data.tokens.access,
      refresh: response.data.tokens.refresh,
    };
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiClient.get<AuthUser>("/users/me/");
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post("/users/logout/", { refresh: refreshToken });
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>("/users/refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  },
};
