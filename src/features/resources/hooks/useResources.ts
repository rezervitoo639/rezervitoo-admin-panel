import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "../../../api/resources.api";

type ResourceType = "amenities" | "restrictions" | "nearby" | "beds";

export function useResources(type: ResourceType) {
  return useQuery({
    queryKey: [type],
    queryFn: () => resourcesApi[type].list(),
  });
}

export function useCreateResource(type: ResourceType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => resourcesApi[type].create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
}

export function useUpdateResource(type: ResourceType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      resourcesApi[type].update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
}

export function useDeleteResource(type: ResourceType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => resourcesApi[type].delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
}
