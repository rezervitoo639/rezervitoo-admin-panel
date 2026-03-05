import apiClient from "./index";
import type { User, UserFilters } from "../types/user.types";

export const usersApi = {
  // List all users with filters
  list: async (filters?: UserFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.account_type)
      params.append("account_type", filters.account_type);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.verification_status)
      params.append("verification_status", filters.verification_status);
    if (filters?.is_active !== undefined)
      params.append("is_active", String(filters.is_active));
    if (filters?.ordering) params.append("ordering", filters.ordering);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const response = await apiClient.get<{ count: number; results: User[] }>(
      `/users/?${params.toString()}`
    );
    return response.data;
  },

  // Get single user details
  getById: async (id: number) => {
    const response = await apiClient.get<User>(`/users/${id}/`);
    return response.data;
  },

  // Update user verification status
  updateVerification: async (id: number, status: "VERIFIED" | "REJECTED") => {
    const response = await apiClient.patch<User>(`/users/${id}/`, {
      verification_status: status,
    });
    return response.data;
  },

  // Soft delete user
  delete: async (id: number) => {
    await apiClient.delete(`/users/${id}/`);
  },
};
