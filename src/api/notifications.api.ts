import apiClient from "./index";

export interface Notification {
  id: number;
  type:
    | "new_user"
    | "new_listing"
    | "new_booking"
    | "new_report"
    | "new_review";
  payload: {
    user_id?: number;
    listing_id?: number;
    booking_id?: number;
    report_id?: number;
    review_id?: number;
    email?: string;
    full_name?: string;
    title?: string;
    owner_name?: string;
    account_type?: string;
    listing_type?: string;
    [key: string]: any;
  };
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export const notificationsApi = {
  getAll: async (params?: {
    is_read?: boolean;
    type?: string;
    page?: number;
    page_size?: number;
  }): Promise<NotificationsResponse> => {
    const response = await apiClient.get<NotificationsResponse>(
      "/support/notifications/",
      { params },
    );
    return response.data;
  },

  getById: async (id: number): Promise<Notification> => {
    const response = await apiClient.get<Notification>(
      `/support/notifications/${id}/`,
    );
    return response.data;
  },

  markAsRead: async (
    id: number,
    is_read: boolean = true,
  ): Promise<Notification> => {
    const response = await apiClient.patch<Notification>(
      `/support/notifications/${id}/mark_as_read/`,
      { is_read },
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post<{ message: string; count: number }>(
      "/support/notifications/mark_all_read/",
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/support/notifications/${id}/`);
  },
};
