import apiClient from "./index";

export interface SupportContact {
  id: number;
  whatsapp_phone: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  updated_at: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

export const settingsApi = {
  // Get support contact info
  getSupportContact: async () => {
    const response = await apiClient.get<SupportContact>("/support-contact/1/");
    return response.data;
  },

  // Update support contact info
  updateSupportContact: async (data: Partial<SupportContact>) => {
    const response = await apiClient.patch<SupportContact>(
      "/support-contact/1/",
      data,
    );
    return response.data;
  },

  // Update admin profile
  updateProfile: async (id: number, data: UpdateProfileData | FormData) => {
    const response = await apiClient.patch(`/users/${id}/`, data, {
      headers:
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : undefined,
    });
    return response.data;
  },
};
