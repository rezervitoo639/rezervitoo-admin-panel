import apiClient from "./index";
import type { Booking } from "../types/booking.types";

export interface BookingFilters {
  search?: string; // Unified search: booking ID, guest, provider, listing
  user?: number; // Filter by user ID
  listing?: number; // Filter by listing ID
  status?: string;
  listing_type?: string;
  min_price?: string;
  max_price?: string;
  start_date_from?: string;
  start_date_to?: string;
  ordering?: string; // Order by field (prefix with - for descending)
  page?: number;
  page_size?: number;
}

export const bookingsApi = {
  list: async (filters?: BookingFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.user) params.append("user", String(filters.user));
    if (filters?.listing) params.append("listing", String(filters.listing));
    if (filters?.status) params.append("status", filters.status);
    if (filters?.listing_type)
      params.append("listing_type", filters.listing_type);
    if (filters?.min_price) params.append("min_price", filters.min_price);
    if (filters?.max_price) params.append("max_price", filters.max_price);
    if (filters?.start_date_from)
      params.append("start_date_from", filters.start_date_from);
    if (filters?.start_date_to)
      params.append("start_date_to", filters.start_date_to);
    if (filters?.ordering) params.append("ordering", filters.ordering);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const response = await apiClient.get<{ count: number; results: Booking[] }>(
      `/bookings/?${params.toString()}`,
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Booking>(`/bookings/${id}/`);
    return response.data;
  },

  // Deprecated: Use list({ listing: listingId }) instead
  getByListing: async (listingId: number) => {
    const response = await apiClient.get<{ count: number; results: Booking[] }>(
      `/bookings/?listing=${listingId}`,
    );
    return response.data.results;
  },
};
