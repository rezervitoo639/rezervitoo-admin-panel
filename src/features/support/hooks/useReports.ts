import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "../../../api/support.api";
import type { ReportFilters } from "../../../types/support.types";

export function useReports(
  filters: ReportFilters & { page?: number; page_size?: number }
) {
  return useQuery({
    queryKey: ["reports", filters],
    queryFn: () => reportsApi.list(filters),
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: number;
      status: string;
      notes: string;
    }) => reportsApi.updateStatus(id, { status, admin_notes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
