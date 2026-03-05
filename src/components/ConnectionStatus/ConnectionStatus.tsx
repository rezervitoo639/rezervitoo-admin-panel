import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import styles from "./ConnectionStatus.module.css";

/**
 * Connection Status Indicator
 *
 * Displays WebSocket connection status in the navbar
 * - Green: Connected
 * - Red: Disconnected
 * - Shows tooltip with status
 */
export default function ConnectionStatus() {
  const wsUrl =
    import.meta.env.VITE_WS_URL ||
    "ws://localhost:8000/ws/admin/notifications/";

  const { isConnected } = useWebSocket({
    url: wsUrl,
    showNotifications: false,
    autoReconnect: true,
  });

  return (
    <div
      className={`${styles.connectionStatus} ${
        isConnected ? styles.connected : styles.disconnected
      }`}
      title={isConnected ? "Live updates active" : "Reconnecting..."}
    >
      {isConnected ? (
        <>
          <IconWifi size={18} />
          <span className={styles.statusText}>Live</span>
        </>
      ) : (
        <>
          <IconWifiOff size={18} />
          <span className={styles.statusText}>Offline</span>
        </>
      )}
      {isConnected && <span className={styles.pulse}></span>}
    </div>
  );
}
