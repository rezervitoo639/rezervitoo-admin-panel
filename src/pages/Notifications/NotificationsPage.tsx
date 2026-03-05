import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconBell } from "@tabler/icons-react";
import type { Notification } from "../../api/notifications.api";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "../../features/notifications/hooks/useNotifications";
import { useNotificationFilters } from "../../features/notifications/hooks/useNotificationFilters";
import { useNotificationWebSocket } from "../../features/notifications/hooks/useNotificationWebSocket";
import { getNotificationNavigationPath } from "../../features/notifications/notification.utils";
import NotificationCard from "../../features/notifications/components/NotificationCard";
import NotificationFilters from "../../features/notifications/components/NotificationFilters";
import NotificationEmptyState from "../../features/notifications/components/NotificationEmptyState";
import Loader from "../../components/Loader/Loader";
import StatCard from "../../components/StatCard/StatCard";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./NotificationsPage.module.css";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Use notification filters hook
  const { typeFilter, readFilter, setTypeFilter, setReadFilter } =
    useNotificationFilters();

  // Fetch notifications with filters and pagination
  const { data, isLoading } = useNotifications(
    typeFilter,
    readFilter,
    currentPage,
    pageSize,
  );

  // Mutations
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  // Real-time WebSocket updates
  useNotificationWebSocket();

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsReadMutation.mutate({ id: notification.id, is_read: true });
    }

    // Navigate to relevant page
    const path = getNotificationNavigationPath(notification);
    navigate(path);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm(t("notifications.deleteConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const notifications = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate stat card value based on selected filters
  let statLabel = t("notifications.totalNotifications");
  let statValue = totalCount;

  if (typeFilter !== "all" && readFilter !== "all") {
    statLabel = `${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).replace("_", " ")} - ${readFilter.charAt(0).toUpperCase() + readFilter.slice(1)}`;
  } else if (typeFilter !== "all") {
    statLabel = `${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1).replace("_", " ")} ${t("notifications.totalNotifications")}`;
  } else if (readFilter === "unread") {
    statLabel = t("notifications.unreadNotifications");
  } else if (readFilter === "read") {
    statLabel = t("notifications.readNotifications");
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("notifications.pageTitle")}</h1>
          <p className={styles.subtitle}>{t("notifications.pageSubtitle")}</p>
        </div>
        <div className={styles.statsContainer}>
          <StatCard
            title={statLabel}
            value={statValue}
            icon={IconBell}
            color="primary"
            orientation="row"
          />
        </div>
      </div>

      <NotificationFilters
        typeFilter={typeFilter}
        readFilter={readFilter}
        onTypeFilterChange={(type) => {
          setTypeFilter(type);
          setCurrentPage(1);
        }}
        onReadFilterChange={(filter) => {
          setReadFilter(filter);
          setCurrentPage(1);
        }}
        showMarkAllButton={readFilter === "all" || readFilter === "unread"}
        onMarkAllAsRead={() => markAllAsReadMutation.mutate()}
        markAllButtonDisabled={
          markAllAsReadMutation.isPending || totalCount === 0
        }
      />

      {notifications.length === 0 ? (
        <NotificationEmptyState
          typeFilter={typeFilter}
          readFilter={readFilter}
        />
      ) : (
        <>
          <div className={styles.notificationsList}>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            itemName={t("notifications.items", {
              defaultValue: "notifications",
            })}
          />
        </>
      )}
    </div>
  );
}
