import { useTranslation } from "react-i18next";
import type { Notification } from "../../../api/notifications.api";
import { IconX, IconClock } from "@tabler/icons-react";
import NotificationIcon from "./NotificationIcon";
import {
  getNotificationTitleKey,
  getNotificationMessageData,
  getTimeAgo,
  getNotificationIconClass,
} from "../notification.utils";
import styles from "./NotificationCard.module.css";

interface NotificationCardProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
}

export default function NotificationCard({
  notification,
  onClick,
  onDelete,
}: NotificationCardProps) {
  const { t } = useTranslation();

  // Check if notification is very recent (within last 10 seconds)
  const isVeryRecent = () => {
    const createdAt = new Date(notification.created_at).getTime();
    const now = Date.now();
    return now - createdAt < 10000; // 10 seconds
  };

  const messageData = getNotificationMessageData(notification);

  return (
    <div
      className={`${styles.notificationCard} ${
        !notification.is_read ? styles.unread : ""
      }`}
      onClick={() => onClick(notification)}
    >
      <div
        className={`${styles.iconWrapper} ${
          styles[getNotificationIconClass(notification.type)]
        }`}
      >
        <NotificationIcon type={notification.type} />
      </div>

      <div className={styles.content}>
        <div className={styles.notificationHeader}>
          <div style={{ flex: 1 }}>
            <div className={styles.notificationTitle}>
              {t(getNotificationTitleKey(notification.type))}
              {isVeryRecent() && (
                <span className={styles.newBadge}>{t("common.new")}</span>
              )}
            </div>
            <div className={styles.notificationMessage}>
              {t(messageData.key, messageData.params)}
            </div>
          </div>
        </div>

        <div className={styles.timestamp}>
          <IconClock size={14} />
          <span>{getTimeAgo(notification.created_at)}</span>
        </div>
      </div>

      <button
        className={styles.deleteButton}
        onClick={(e) => onDelete(e, notification.id)}
        aria-label="Delete notification"
      >
        <IconX size={18} />
      </button>
    </div>
  );
}
