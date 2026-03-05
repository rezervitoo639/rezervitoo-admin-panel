import apiClient from "./index";
import type { DashboardStats } from "../types/stats.types";

export const statsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>(
      "/users/stats/dashboard/"
    );
    return response.data;
  },
};
