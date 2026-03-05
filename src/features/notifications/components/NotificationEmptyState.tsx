import { IconBellOff } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type {
  NotificationFilterType,
  NotificationReadFilter,
} from "../notification.utils";
import styles from "./NotificationEmptyState.module.css";

interface NotificationEmptyStateProps {
  typeFilter: NotificationFilterType;
  readFilter: NotificationReadFilter;
}

export default function NotificationEmptyState({
  typeFilter,
  readFilter,
}: NotificationEmptyStateProps) {
  const { t } = useTranslation();

  const getMessage = () => {
    if (readFilter === "unread") {
      return t("notifications.empty.allCaughtUp");
    }

    if (typeFilter !== "all") {
      return t("notifications.empty.noTypeFound", {
        type: typeFilter.replace("_", " "),
      });
    }

    return t("notifications.empty.noNotificationsYet");
  };

  return (
    <div className={styles.emptyState}>
      <IconBellOff className={styles.emptyIcon} size={64} />
      <h2 className={styles.emptyTitle}>{t("notifications.empty.title")}</h2>
      <p className={styles.emptyMessage}>{getMessage()}</p>
    </div>
  );
}
