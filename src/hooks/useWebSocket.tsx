import { useEffect, useRef, useCallback, useState } from "react";
import { notifications } from "../utils/notifications";

interface WebSocketMessage {
  type: string;
  message: string;
  data?: Record<string, any>;
  timestamp?: string;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  showNotifications?: boolean;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export const useWebSocket = ({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  showNotifications = true,
  autoReconnect = true,
  reconnectInterval = 3000,
}: UseWebSocketOptions) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const connect = useCallback(() => {
    // Don't create new connection if already connected or connecting
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      console.log("WebSocket already connected or connecting, skipping...");
      return;
    }

    try {
      // Get JWT token from localStorage (use access_token key)
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("No auth token found for WebSocket connection");
        return;
      }

      // Create WebSocket connection with token as query parameter
      const wsUrl = `${url}?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);

        if (showNotifications) {
          notifications.show({
            title: "Connected",
            message: "Real-time updates enabled",
            color: "green",
          });
        }

        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(data);

          // Show notification if enabled
          if (showNotifications && data.message) {
            notifications.show({
              title: "New Update",
              message: data.message,
              color: "blue",
            });
          }

          // Call custom message handler
          onMessage?.(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        wsRef.current = null;
        onDisconnect?.();

        // Auto-reconnect if enabled
        if (autoReconnect) {
          console.log(`Reconnecting in ${reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [
    url,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    showNotifications,
    autoReconnect,
    reconnectInterval,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }, []);

  // Auto-connect on mount (only if token exists)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
  };
};

// Hook specifically for admin notifications
export const useAdminNotifications = (onUpdate?: () => void) => {
  const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000";

  return useWebSocket({
    url: `${wsBaseUrl}/ws/admin/notifications/`,
    onMessage: (message) => {
      console.log("Admin notification received:", message);

      // Trigger data refresh callback
      if (onUpdate) {
        onUpdate();
      }

      // Handle specific notification types
      if (message.data) {
        // Example: Refresh specific views based on notification type
        if (message.data.user_id) {
          // New user created - could trigger user list refresh
          console.log("New user notification:", message.data);
        }
        if (message.data.listing_id) {
          // New listing created - could trigger listing list refresh
          console.log("New listing notification:", message.data);
        }
        if (message.data.report_id) {
          // New report - could trigger reports list refresh
          console.log("New report notification:", message.data);
        }
      }
    },
    showNotifications: false, // Disable toast notifications to reduce spam
    autoReconnect: false, // Disable auto-reconnect in development to prevent spam
  });
};
