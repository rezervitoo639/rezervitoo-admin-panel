import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listingsApi, type ListingFilters } from "../../../api/listings.api";

export function useListings(filters?: ListingFilters) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => listingsApi.list(filters),
  });
}

export function useListing(id: number) {
  return useQuery({
    queryKey: ["listings", id],
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      listingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useToggleListingFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: number; isFeatured: boolean }) =>
      listingsApi.toggleFeatured(id, isFeatured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useApproveListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      listingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useRejectListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      listingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => listingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
