import apiClient from "./index";
import type {
  Listing,
  ItineraryItem,
  UnavailableDate,
} from "../types/listing.types";

export interface ListingFilters {
  search?: string; // Unified search: title, description, location, type, amenities
  listing_type?: string;
  approval_status?: string;
  is_active?: boolean;
  min_price?: string;
  max_price?: string;
  min_guests?: string;
  max_guests?: string;
  property_type?: string; // For PROPERTY listings
  room_category?: string; // For HOTEL_ROOM listings
  room_type?: string; // For HOSTEL_BED listings
  package_type?: string; // For TRAVEL_PACKAGE listings
  ordering?: string; // Order by field (prefix with - for descending)
  page?: number;
  page_size?: number;
  owner?: number;
}

export const listingsApi = {
  list: async (filters?: ListingFilters) => {
    const params = new URLSearchParams();
    if (filters?.owner) params.append("owner", String(filters.owner));
    if (filters?.search) params.append("search", filters.search);
    if (filters?.listing_type)
      params.append("listing_type", filters.listing_type);
    if (filters?.approval_status)
      params.append("approval_status", filters.approval_status);
    if (filters?.is_active !== undefined)
      params.append("is_active", String(filters.is_active));
    if (filters?.min_price) params.append("min_price", filters.min_price);
    if (filters?.max_price) params.append("max_price", filters.max_price);
    if (filters?.min_guests) params.append("min_guests", filters.min_guests);
    if (filters?.max_guests) params.append("max_guests", filters.max_guests);
    if (filters?.property_type)
      params.append("property_type", filters.property_type);
    if (filters?.room_category)
      params.append("room_category", filters.room_category);
    if (filters?.room_type) params.append("room_type", filters.room_type);
    if (filters?.package_type)
      params.append("package_type", filters.package_type);
    if (filters?.ordering) params.append("ordering", filters.ordering);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size)
      params.append("page_size", String(filters.page_size));

    const response = await apiClient.get<{ count: number; results: Listing[] }>(
      `/listings/?${params.toString()}`,
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Listing>(`/listings/${id}/`);
    return response.data;
  },

  updateStatus: async (id: number, approval_status: string) => {
    const response = await apiClient.patch<Listing>(`/listings/${id}/`, {
      approval_status,
    });
    return response.data;
  },

  toggleFeatured: async (id: number, is_featured: boolean) => {
    const response = await apiClient.patch<Listing>(`/listings/${id}/`, {
      is_featured,
    });
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/listings/${id}/`);
  },

  // Itinerary Management
  getItinerary: async (listingId: number) => {
    const response = await apiClient.get<ItineraryItem[]>(
      `/listings/${listingId}/itinerary/`,
    );
    return response.data;
  },

  createItineraryItem: async (
    listingId: number,
    data: Omit<ItineraryItem, "id">,
  ) => {
    const response = await apiClient.post<ItineraryItem>(
      `/listings/${listingId}/itinerary/`,
      data,
    );
    return response.data;
  },

  updateItineraryItem: async (
    listingId: number,
    itemId: number,
    data: Partial<Omit<ItineraryItem, "id">>,
  ) => {
    const response = await apiClient.patch<ItineraryItem>(
      `/listings/${listingId}/itinerary/${itemId}/`,
      data,
    );
    return response.data;
  },

  deleteItineraryItem: async (listingId: number, itemId: number) => {
    await apiClient.delete(`/listings/${listingId}/itinerary/${itemId}/`);
  },

  // Availability Management
  getAvailability: async (listingId: number) => {
    const response = await apiClient.get<UnavailableDate[]>(
      `/listings/${listingId}/availability/`,
    );
    return response.data;
  },

  blockDates: async (listingId: number, data: Omit<UnavailableDate, "id">) => {
    const response = await apiClient.post<UnavailableDate>(
      `/listings/${listingId}/availability/`,
      data,
    );
    return response.data;
  },

  updateBlockedDates: async (
    listingId: number,
    dateId: number,
    data: Partial<Omit<UnavailableDate, "id">>,
  ) => {
    const response = await apiClient.patch<UnavailableDate>(
      `/listings/${listingId}/availability/${dateId}/`,
      data,
    );
    return response.data;
  },

  unblockDates: async (listingId: number, dateId: number) => {
    await apiClient.delete(`/listings/${listingId}/availability/${dateId}/`);
  },
};
