import { IconCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type {
  NotificationFilterType,
  NotificationReadFilter,
} from "../notification.utils";
import styles from "./NotificationFilters.module.css";

interface NotificationFiltersProps {
  typeFilter: NotificationFilterType;
  readFilter: NotificationReadFilter;
  onTypeFilterChange: (filter: NotificationFilterType) => void;
  onReadFilterChange: (filter: NotificationReadFilter) => void;
  showMarkAllButton?: boolean;
  onMarkAllAsRead?: () => void;
  markAllButtonDisabled?: boolean;
}

export default function NotificationFilters({
  typeFilter,
  readFilter,
  onTypeFilterChange,
  onReadFilterChange,
  showMarkAllButton,
  onMarkAllAsRead,
  markAllButtonDisabled,
}: NotificationFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.filters}>
      {/* Read status filters */}
      <button
        className={`${styles.filterButton} ${readFilter === "all" ? styles.active : ""}`}
        onClick={() => onReadFilterChange("all")}
      >
        {t("notifications.filters.all")}
      </button>
      <button
        className={`${styles.filterButton} ${readFilter === "unread" ? styles.active : ""}`}
        onClick={() => onReadFilterChange("unread")}
      >
        {t("notifications.filters.unread")}
      </button>
      <button
        className={`${styles.filterButton} ${readFilter === "read" ? styles.active : ""}`}
        onClick={() => onReadFilterChange("read")}
      >
        {t("notifications.filters.read")}
      </button>

      <div className={styles.divider} />

      {/* Type filters */}
      <button
        className={`${styles.filterButton} ${typeFilter === "all" ? styles.active : ""}`}
        onClick={() => onTypeFilterChange("all")}
      >
        {t("notifications.filters.allTypes")}
      </button>
      <button
        className={`${styles.filterButton} ${typeFilter === "new_user" ? styles.active : ""}`}
        onClick={() => onTypeFilterChange("new_user")}
      >
        {t("notifications.filters.users")}
      </button>
      <button
        className={`${styles.filterButton} ${typeFilter === "new_listing" ? styles.active : ""}`}
        onClick={() => onTypeFilterChange("new_listing")}
      >
        {t("notifications.filters.listings")}
      </button>
      <button
        className={`${styles.filterButton} ${typeFilter === "new_booking" ? styles.active : ""}`}
        onClick={() => onTypeFilterChange("new_booking")}
      >
        {t("notifications.filters.bookings")}
      </button>
      <button
        className={`${styles.filterButton} ${typeFilter === "new_report" ? styles.active : ""}`}
        onClick={() => onTypeFilterChange("new_report")}
      >
        {t("notifications.filters.reports")}
      </button>
      <button
        className={`${styles.filterButton} ${typeFilter === "new_review" ? styles.active : ""}`}
        onClick={() => onTypeFilterChange("new_review")}
      >
        {t("notifications.filters.reviews")}
      </button>

      {/* Mark All as Read Button - Icon Only */}
      {showMarkAllButton && onMarkAllAsRead && (
        <>
          <div className={styles.divider} />
          <button
            className={styles.iconButton}
            onClick={onMarkAllAsRead}
            disabled={markAllButtonDisabled}
            title={t("notifications.markAllAsRead")}
          >
            <IconCheck size={18} />
          </button>
        </>
      )}
    </div>
  );
}
