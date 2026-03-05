import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "../../../hooks/useWebSocket";
import type {
  Notification,
  NotificationsResponse,
} from "../../../api/notifications.api";

interface UseNotificationWebSocketOptions {
  wsUrl?: string;
  enableOptimisticUpdates?: boolean;
}

/**
 * Hook for real-time notification updates via WebSocket
 *
 * Features:
 * - Automatically invalidates notification queries when new notifications arrive
 * - Optimistic UI updates - adds new notifications to the list immediately
 * - Automatic reconnection on disconnect
 *
 * @param options Configuration options
 * @param options.wsUrl WebSocket URL (defaults to env variable)
 * @param options.enableOptimisticUpdates Enable optimistic UI updates (default: true)
 */
export function useNotificationWebSocket(
  options: UseNotificationWebSocketOptions = {},
) {
  const queryClient = useQueryClient();
  const { enableOptimisticUpdates = true } = options;

  const wsUrl =
    options.wsUrl ||
    import.meta.env.VITE_WS_URL ||
    "ws://localhost:8000/ws/admin/notifications/";

  useWebSocket({
    url: wsUrl,
    onMessage: (message) => {
      // Skip connection messages
      if (message.type === "connection_established") {
        return;
      }

      // When a new notification WebSocket message arrives
      // Backend sends type: "notification" with data containing entity info
      if (message.type === "notification" && message.data) {
        console.log("🔔 Real-time notification received:", message);

        // Optimistic update: Add the new notification to the cache immediately
        if (enableOptimisticUpdates && message.data) {
          // Determine notification type based on data content
          let notificationType: Notification["type"] = "new_user";

          if (message.data.listing_id) {
            notificationType = "new_listing";
          } else if (message.data.booking_id) {
            notificationType = "new_booking";
          } else if (message.data.report_id) {
            notificationType = "new_report";
          } else if (message.data.review_id) {
            notificationType = "new_review";
          }

          const newNotification: Notification = {
            id: message.data.notification_id || Date.now(),
            type: notificationType,
            payload: message.data,
            is_read: false,
            created_at: message.timestamp || new Date().toISOString(),
            updated_at: message.timestamp || new Date().toISOString(),
          };

          // Get all notification queries in the cache
          const notificationQueries =
            queryClient.getQueriesData<NotificationsResponse>({
              queryKey: ["notifications"],
            });

          // Update each query's data by prepending the new notification
          notificationQueries.forEach(([queryKey, oldData]) => {
            if (oldData && oldData.results) {
              // Only update if this query would include the new notification
              // Check if the query's filters match the notification
              const [, typeFilter, readFilter] = queryKey as [
                string,
                string,
                string,
              ];

              // Skip if type filter doesn't match (unless it's "all")
              if (
                typeFilter &&
                typeFilter !== "all" &&
                newNotification.type !== typeFilter
              ) {
                return;
              }

              // Skip if read filter is "read" (new notifications are always unread)
              if (readFilter === "read") {
                return;
              }

              queryClient.setQueryData<NotificationsResponse>(queryKey, {
                ...oldData,
                count: oldData.count + 1,
                results: [newNotification, ...oldData.results],
              });

              console.log(
                `✨ Optimistically added notification to query:`,
                queryKey,
              );
            }
          });

          // Show a success message
          console.log("✨ Optimistically added notification to cache");
        }

        // Note: We don't invalidate here because LiveUpdateProvider already handles it
        // This prevents double invalidation and flickering
      }
    },
    showNotifications: false, // Don't show toast notifications, we have our own page
    autoReconnect: true,
    reconnectInterval: 3000,
  });
}
