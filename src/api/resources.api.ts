import apiClient from "./index";
import type {
  Amenity,
  Restriction,
  Nearby,
  BedType,
} from "../types/resource.types";

const createResourceApi = <T>(endpoint: string) => ({
  list: async (): Promise<T[]> => {
    const response = await apiClient.get<T[] | { results: T[] }>(
      `/${endpoint}/`
    );
    // Handle both paginated and non-paginated responses
    return Array.isArray(response.data) ? response.data : response.data.results;
  },

  getById: async (id: number): Promise<T> => {
    const response = await apiClient.get<T>(`/${endpoint}/${id}/`);
    return response.data;
  },

  create: async (data: FormData): Promise<T> => {
    const response = await apiClient.post<T>(`/${endpoint}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<T> => {
    const response = await apiClient.patch<T>(`/${endpoint}/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/${endpoint}/${id}/`);
  },
});

export const resourcesApi = {
  amenities: createResourceApi<Amenity>("resources/amenities"),
  restrictions: createResourceApi<Restriction>("resources/restrictions"),
  nearby: createResourceApi<Nearby>("resources/nearby"),
  beds: createResourceApi<BedType>("resources/bed-types"),
};
