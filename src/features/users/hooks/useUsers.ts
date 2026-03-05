import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../../api/users.api";
import type { UserFilters } from "../../../types/user.types";

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersApi.list(filters),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.updateVerification(id, "VERIFIED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useRejectUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.updateVerification(id, "REJECTED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateUserVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "VERIFIED" | "REJECTED";
    }) => usersApi.updateVerification(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
