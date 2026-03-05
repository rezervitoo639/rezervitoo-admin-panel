import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../../../api/support.api";
import type { ReviewFilters } from "../../../types/support.types";

export function useReviews(
  filters: ReviewFilters & { page?: number; page_size?: number }
) {
  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: () => reviewsApi.list(filters),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
