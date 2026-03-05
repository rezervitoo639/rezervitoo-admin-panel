import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../../../api/notifications.api";
import type {
  NotificationFilterType,
  NotificationReadFilter,
} from "../notification.utils";

/**
 * Hook for fetching notifications with filters
 */
export function useNotifications(
  typeFilter: NotificationFilterType,
  readFilter: NotificationReadFilter,
  page?: number,
  pageSize?: number,
) {
  return useQuery({
    queryKey: ["notifications", typeFilter, readFilter, page, pageSize],
    queryFn: () => {
      const params: any = {};
      if (typeFilter !== "all") params.type = typeFilter;
      if (readFilter === "unread") params.is_read = false;
      if (readFilter === "read") params.is_read = true;
      if (page) params.page = page;
      if (pageSize) params.page_size = pageSize;
      return notificationsApi.getAll(params);
    },
  });
}

/**
 * Hook for fetching a single notification
 */
export function useNotification(id: number) {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: () => notificationsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook for marking notification as read/unread
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_read }: { id: number; is_read: boolean }) =>
      notificationsApi.markAsRead(id, is_read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook for marking all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook for deleting a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
