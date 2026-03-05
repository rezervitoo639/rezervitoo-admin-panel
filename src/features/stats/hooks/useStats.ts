import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../../../api/stats.api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => statsApi.getDashboardStats(),
    // Removed staleTime so invalidation triggers immediate refetch
  });
}
