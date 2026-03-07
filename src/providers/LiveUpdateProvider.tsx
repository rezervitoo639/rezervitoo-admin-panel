import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "../hooks/useWebSocket";

interface WebSocketMessage {
  type: string;
  message: string;
  data?: Record<string, any>;
  timestamp?: string;
}

/**
 * Global Live Update Provider
 *
 * This provider listens to WebSocket messages and automatically invalidates
 * relevant React Query caches to keep all data fresh across the admin panel.
 *
 * Features:
 * - Automatic query invalidation based on notification type
 * - Optimistic updates for notifications
 * - Centralized WebSocket message handling
 * - Automatic reconnection on disconnect
 */
export function LiveUpdateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000"}/ws/admin/notifications/`;

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      console.log("🔴 Live Update received:", message.type, message);

      // Skip connection_established messages
      if (message.type === "connection_established") {
        return;
      }

      // Handle the actual notification messages from backend
      // Backend sends type: "notification" with data containing the actual entity info
      if (message.type === "notification" && message.data) {
        const data = message.data;
        console.log("📦 Message data:", data);

        let invalidated = false;

        // Add a 200ms delay to ensure database transaction is fully committed
        // Backend now uses transaction.on_commit() so this delay is minimal
        setTimeout(() => {
          console.log(
            "🕐 Starting delayed invalidation (200ms after WebSocket message)",
          );

          // Determine what to invalidate based on the data content
          // Check which ID fields are present in the message data
          if (data.user_id || data.email) {
            console.log(
              "♻️ Invalidating queries: users, stats (new user detected)",
            );
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            invalidated = true;
          }

          if (data.listing_id || data.title || data.listing_type) {
            console.log(
              "♻️ Invalidating queries: listings, stats (new listing detected)",
            );
            queryClient.invalidateQueries({ queryKey: ["listings"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            invalidated = true;
          }

          if (data.booking_id) {
            console.log(
              "♻️ Invalidating queries: bookings, stats (new booking detected)",
            );
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            invalidated = true;
          }

          if (data.report_id) {
            console.log(
              "♻️ Invalidating queries: reports, support, stats (new report detected)",
            );
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            queryClient.invalidateQueries({ queryKey: ["support"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            invalidated = true;
          }

          if (data.review_id) {
            console.log(
              "♻️ Invalidating queries: reviews, support, stats (new review detected)",
            );
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            queryClient.invalidateQueries({ queryKey: ["support"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            invalidated = true;
          }

          // Always invalidate notifications to show the new notification
          console.log("♻️ Invalidating query: notifications");
          queryClient.invalidateQueries({ queryKey: ["notifications"] });

          // ALWAYS invalidate stats and dashboardStats for ALL notifications
          // This ensures dashboard updates regardless of entity type
          console.log(
            "♻️ Always invalidating stats and dashboardStats for dashboard update",
          );
          queryClient.invalidateQueries({ queryKey: ["stats"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });

          if (!invalidated) {
            console.warn(
              "⚠️ No specific entity invalidation matched, but stats already invalidated",
            );
          }

          console.log(
            "✅ Invalidation complete - React Query will refetch data",
          );
        }, 200); // 200ms delay - backend now uses transaction.on_commit()
      } else if (message.type !== "connection_established") {
        console.warn(
          "⚠️ Unknown message type:",
          message.type,
          "- invalidating all queries",
        );
        setTimeout(() => {
          queryClient.invalidateQueries();
        }, 200);
      }
    },
    [queryClient],
  );

  useWebSocket({
    url: wsUrl,
    onMessage: handleWebSocketMessage,
    showNotifications: false, // We handle notifications in the UI
    autoReconnect: true,
    reconnectInterval: 3000,
    onConnect: () => {
      console.log("✅ Live Update system connected");
      // Refresh all data on reconnect to ensure consistency
      queryClient.invalidateQueries();
    },
    onDisconnect: () => {
      console.log("⚠️ Live Update system disconnected");
    },
  });

  return <>{children}</>;
}

/**
 * Hook to manually trigger a refresh of specific data
 * Useful for pull-to-refresh or manual refresh buttons
 */
export function useLiveUpdate() {
  const queryClient = useQueryClient();

  const refreshAll = useCallback(() => {
    console.log("🔄 Manual refresh triggered");
    queryClient.invalidateQueries();
  }, [queryClient]);

  const refreshUsers = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  }, [queryClient]);

  const refreshListings = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["listings"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  }, [queryClient]);

  const refreshBookings = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  }, [queryClient]);

  const refreshNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  return {
    refreshAll,
    refreshUsers,
    refreshListings,
    refreshBookings,
    refreshNotifications,
  };
}
