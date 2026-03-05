import type { Notification } from "../../api/notifications.api";

export type NotificationFilterType =
  | "all"
  | "new_user"
  | "new_listing"
  | "new_booking"
  | "new_report"
  | "new_review";
export type NotificationReadFilter = "all" | "unread" | "read";

/**
 * Calculate time ago from timestamp
 */
export function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return created.toLocaleDateString();
}

/**
 * Get notification title translation key based on type
 */
export function getNotificationTitleKey(type: string): string {
  const titles: Record<string, string> = {
    new_user: "notifications.titles.new_user",
    new_listing: "notifications.titles.new_listing",
    new_booking: "notifications.titles.new_booking",
    new_report: "notifications.titles.new_report",
    new_review: "notifications.titles.new_review",
  };
  return titles[type] || "notifications.titles.default";
}

/**
 * Get formatted notification message data (key + params) from payload
 */
export function getNotificationMessageData(notification: Notification): {
  key: string;
  params: any;
} {
  const p = notification.payload;

  switch (notification.type) {
    case "new_user":
      return {
        key: "notifications.templates.new_user",
        params: {
          name: p.full_name || p.email,
          accountType: p.account_type,
        },
      };

    case "new_listing":
      const listingType = p.listing_type
        ? p.listing_type.replace("LISTING", "").replace("_", " ") // simplified for now
        : "listing";
      return {
        key: "notifications.templates.new_listing",
        params: {
          ownerName: p.owner_name || "A user",
          title: p.title,
          listingType,
          location: p.location || "Location TBD",
        },
      };

    case "new_booking":
      const guestText =
        p.guests_count > 1 ? `${p.guests_count} guests` : "1 guest"; // Should be localized too but sticking to scope
      const dateRange =
        p.start_date && p.end_date
          ? `${new Date(p.start_date).toLocaleDateString()} - ${new Date(p.end_date).toLocaleDateString()}`
          : "Dates TBD";
      return {
        key: "notifications.templates.new_booking",
        params: {
          userName: p.user_name || "A user",
          listingTitle: p.listing_title,
          guestCount: guestText,
          dateRange,
          price: `$${p.total_price}`,
        },
      };

    case "new_report":
      return {
        key: "notifications.templates.new_report",
        params: {
          reporterName: p.reporter_name || "A user",
          reportedName: p.reported_name || "another user",
          reason:
            p.reason?.substring(0, 80) + (p.reason?.length > 80 ? "..." : ""),
        },
      };

    case "new_review":
      const stars = "⭐".repeat(p.rating || 0);
      if (p.review_type === "USER_TO_LISTING" && p.listing_title) {
        return {
          key: "notifications.templates.new_review_listing",
          params: {
            reviewerName: p.reviewer_name || "A user",
            listingTitle: p.listing_title,
            stars,
            comment: p.comment
              ? ` • "${p.comment.substring(0, 60)}${p.comment.length > 60 ? "..." : ""}"`
              : "",
          },
        };
      }
      return {
        key: "notifications.templates.new_review_user",
        params: {
          reviewerName: p.reviewer_name || "A user",
          reviewedUserName: p.reviewed_user_name || "a user",
          stars,
        },
      };

    default:
      return {
        key: "notifications.templates.default",
        params: {},
      };
  }
}

/**
 * Get navigation path for notification type
 */
export function getNotificationNavigationPath(
  notification: Notification,
): string {
  switch (notification.type) {
    case "new_user":
      return "/users";
    case "new_listing":
      return "/listings";
    case "new_booking":
      return "/bookings";
    case "new_report":
      return "/reports";
    case "new_review":
      return "/reviews";
    default:
      return "/";
  }
}

/**
 * Get icon class name for notification type
 */
export function getNotificationIconClass(type: string): string {
  return type.replace("_", "");
}
