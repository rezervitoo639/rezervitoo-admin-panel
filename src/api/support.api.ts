import apiClient from "./index";
import type { Report, Review, UserRating } from "../types/support.types";

export interface ReportFilters {
  status?: string;
  reporter?: number;
  reported?: number;
  reportType?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface ReviewFilters {
  review_type?: string;
  listing?: number;
  reviewed_user?: number;
  reviewer?: number;
  min_rating?: number;
  max_rating?: number;
  page?: number;
  page_size?: number;
}

export const reportsApi = {
  list: async (filters?: ReportFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.reporter) params.append("reporter", String(filters.reporter));
    if (filters?.reported) params.append("reported", String(filters.reported));
    if (filters?.reportType)
      params.append("reported__account_type", filters.reportType.toUpperCase());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const response = await apiClient.get<{ count: number; results: Report[] }>(
      `/support/reports/?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Report>(`/support/reports/${id}/`);
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: { status: string; admin_notes?: string }
  ) => {
    const response = await apiClient.patch<Report>(
      `/support/reports/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/support/reports/${id}/`);
  },
};

export const reviewsApi = {
  list: async (filters?: ReviewFilters) => {
    const params = new URLSearchParams();
    if (filters?.review_type) params.append("review_type", filters.review_type);
    if (filters?.listing) params.append("listing", String(filters.listing));
    if (filters?.reviewed_user)
      params.append("reviewed_user", String(filters.reviewed_user));
    if (filters?.reviewer) params.append("reviewer", String(filters.reviewer));
    if (filters?.min_rating)
      params.append("min_rating", String(filters.min_rating));
    if (filters?.max_rating)
      params.append("max_rating", String(filters.max_rating));
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const response = await apiClient.get<{ count: number; results: Review[] }>(
      `/support/reviews/?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Review>(`/support/reviews/${id}/`);
    return response.data;
  },

  getUserRating: async (userId?: number) => {
    const params = userId ? `?user_id=${userId}` : "";
    const response = await apiClient.get<UserRating>(
      `/support/reviews/user_rating/${params}`
    );
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/support/reviews/${id}/`);
  },
};

export const wishlistApi = {
  toggle: async (listingId: number) => {
    const response = await apiClient.post<{
      message: string;
      wishlisted: boolean;
      data?: any;
    }>(`/support/wishlist/toggle/`, { listing: listingId });
    return response.data;
  },
};
