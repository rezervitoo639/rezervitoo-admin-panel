import { useState } from "react";
import { IconX, IconBell } from "@tabler/icons-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import styles from "./ToastNotification.module.css";

interface ToastNotificationProps {
  onNotificationClick?: () => void;
}

interface NotificationToast {
  id: number;
  message: string;
  data: Record<string, any>;
  timestamp: string;
}

export default function ToastNotification({
  onNotificationClick,
}: ToastNotificationProps) {
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000"}/ws/admin/notifications/`;

  useWebSocket({
    url: wsUrl,
    onMessage: (message) => {
      // Only show toasts for actual notifications, not connection messages
      if (message.type === "notification" && message.data) {
        const newToast: NotificationToast = {
          id: Date.now(),
          message: message.message,
          data: message.data,
          timestamp: message.timestamp || new Date().toISOString(),
        };

        // Replace old toasts with the new one (keep only the latest)
        setToasts([newToast]);
      }
    },
    showNotifications: false,
    autoReconnect: true,
  });

  const handleToastClick = (toast: NotificationToast) => {
    // Remove the toast
    setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    // Navigate to notifications page
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleDismiss = (e: React.MouseEvent, toastId: number) => {
    e.stopPropagation();
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={styles.toast}
          onClick={() => handleToastClick(toast)}
        >
          <div className={styles.toastIcon}>
            <IconBell size={20} />
          </div>
          <div className={styles.toastContent}>
            <div className={styles.toastTitle}>New Notification</div>
            <div className={styles.toastMessage}>{toast.message}</div>
          </div>
          <button
            className={styles.toastClose}
            onClick={(e) => handleDismiss(e, toast.id)}
            aria-label="Dismiss"
          >
            <IconX size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
