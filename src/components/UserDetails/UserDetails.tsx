import {
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconReceipt,
  IconStar,
  IconFlag,
  IconMessageCircle,
  IconStarFilled,
  IconBan,
} from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DetailModal from "../DetailModal/DetailModal";
import BookingDetails from "../BookingDetails/BookingDetails.tsx";
import ReviewModal from "../ReviewModal/ReviewModal.tsx";
import ReportModal from "../ReportModal/ReportModal.tsx";
import BookingCard from "../BookingCard/BookingCard.tsx";
import ReviewCard from "../ReviewCard/ReviewCard.tsx";
import ReportCard from "../ReportCard/ReportCard.tsx";
import type { User } from "../../types/user.types";
import type { Booking } from "../../types/booking.types";
import type { Review, Report } from "../../types/support.types";
import { bookingsApi } from "../../api/bookings.api";
import { reviewsApi, reportsApi } from "../../api/support.api";
import { usersApi } from "../../api/users.api";
import { notifications } from "../../utils/notifications";
import apiClient from "../../api/index";
import styles from "./UserDetails.module.css";

interface UserDetailsProps {
  user: User | null;
  onClose: () => void;
  elevatedZIndex?: boolean;
  hideOverlay?: boolean;
}

export default function UserDetails({
  user,
  onClose,
  elevatedZIndex = false,
  hideOverlay = false,
}: UserDetailsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Ban user mutation
  const banUser = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiClient.patch<User>(`/users/${userId}/`, {
        is_active: false,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Fetch full user data
  const { data: fullUserData } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => usersApi.getById(user!.id),
    enabled: !!user?.id,
  });

  // Use fetched full data or fallback to prop
  const displayUser = fullUserData || user;

  // Queries
  const { data: bookingsData } = useQuery({
    queryKey: ["bookings", { user: user?.id }],
    queryFn: () => bookingsApi.list({ user: user!.id }), // Filter by user ID
    enabled: !!user,
  });

  const { data: ratingData } = useQuery({
    queryKey: ["userRating", user?.id],
    queryFn: () => reviewsApi.getUserRating(user!.id),
    enabled: !!user,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", { reviewed_user: user?.id }],
    queryFn: () =>
      reviewsApi.list({
        reviewed_user: user!.id,
        review_type: "PROVIDER_TO_USER",
      }),
    enabled: !!user,
  });

  const { data: reviewsByUserData } = useQuery({
    queryKey: ["reviews", { reviewer: user?.id }],
    queryFn: () =>
      reviewsApi.list({ reviewer: user!.id, review_type: "USER_TO_LISTING" }),
    enabled: !!user,
  });

  const { data: reportsData } = useQuery({
    queryKey: ["reports", { reported: user?.id }],
    queryFn: () => reportsApi.list({ reported: user!.id }),
    enabled: !!user,
  });

  if (!user) return null;
  if (!displayUser) return null;

  // Bookings are already filtered by user ID from the API
  const userBookings = bookingsData?.results || [];

  const handleBanUser = () => {
    if (confirm(t("userDetails.confirmBan"))) {
      banUser.mutate(displayUser.id, {
        onSuccess: () => {
          notifications.show({
            title: t("userDetails.userBanned"),
            message: t("userDetails.userBannedMessage", {
              name: `${displayUser.first_name} ${displayUser.last_name}`,
            }),
            color: "red",
          });
          onClose();
        },
        onError: () => {
          notifications.show({
            title: t("common.error"),
            message: t("userDetails.banError"),
            color: "red",
          });
        },
      });
    }
  };

  const getStatusClass = (status: string): string => {
    const classes: Record<string, string> = {
      PENDING: styles.statusPending,
      ACCEPTED: styles.statusAccepted,
      REJECTED: styles.statusRejected,
      CANCELLED: styles.statusCancelled,
      COMPLETED: styles.statusCompleted,
    };
    return classes[status] || styles.statusDefault;
  };

  return (
    <>
      <DetailModal
        isOpen={!!user}
        onClose={onClose}
        title={t("userDetails.title")}
        elevatedZIndex={elevatedZIndex}
        hideOverlay={hideOverlay}
      >
        <div className={styles.container}>
          {/* User Info Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconUser size={20} />
              <h3>{t("userDetails.userInfo")}</h3>
            </div>
            <div className={styles.userHeader}>
              <div className={styles.avatar}>
                {displayUser.pfp ? (
                  <img
                    src={displayUser.pfp}
                    alt={`${displayUser.first_name} ${displayUser.last_name}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <>
                    {displayUser.first_name[0]}
                    {displayUser.last_name[0]}
                  </>
                )}
              </div>
              <div className={styles.userInfo}>
                <h2>
                  {displayUser.first_name} {displayUser.last_name}
                </h2>
                <p className={styles.email}>{displayUser.email}</p>
                <div className={styles.badges}>
                  <span
                    className={
                      displayUser.email_verified
                        ? styles.statusVerified
                        : styles.statusUnverified
                    }
                  >
                    {displayUser.email_verified
                      ? t("userDetails.emailVerified")
                      : t("userDetails.emailNotVerified")}
                  </span>
                  <span
                    className={
                      displayUser.is_active
                        ? styles.statusActive
                        : styles.statusInactive
                    }
                  >
                    {displayUser.is_active
                      ? t("userDetails.active")
                      : t("userDetails.inactive")}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <IconPhone size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("userDetails.phone")}:
                  </span>
                  <span className={styles.value}>
                    {displayUser.phone || t("common.na")}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconMail size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("userDetails.email")}:
                  </span>
                  <span className={styles.value}>{displayUser.email}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconCalendar size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("userDetails.joined")}:
                  </span>
                  <span className={styles.value}>
                    {new Date(displayUser.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconUser size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("userDetails.userId")}:
                  </span>
                  <span className={styles.value}>#{displayUser.id}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconCalendar size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("userDetails.lastLogin")}:
                  </span>
                  <span className={styles.value}>
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString()
                      : t("userDetails.never")}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconStar size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("userDetails.averageRating")}:
                  </span>
                  <span className={styles.value}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <IconStarFilled
                        size={16}
                        style={{ color: "#fbbf24", marginTop: "0.125rem" }}
                      />
                      <span>
                        {ratingData?.average_rating
                          ? ratingData.average_rating.toFixed(1)
                          : "0.0"}{" "}
                        (
                        {t("userDetails.reviewsCount", {
                          count: ratingData?.review_count || 0,
                        })}
                        )
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <IconReceipt size={18} className={styles.detailIcon} />
                <div>
                  <span className={styles.label}>
                    {t("userDetails.totalBookings")}:
                  </span>
                  <span className={styles.value}>
                    {bookingsData?.count || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          {userBookings && userBookings.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconReceipt size={20} />
                <h3>
                  {t("userDetails.bookings")} ({userBookings.length})
                </h3>
              </div>
              <div className={styles.listingsGrid}>
                {userBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onClick={() => setSelectedBooking(booking)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviews Received Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconStar size={20} />
              <h3>
                {t("userDetails.reviewsOnUser")} ({reviewsData?.count || 0})
              </h3>
            </div>
            {reviewsData && reviewsData.results.length > 0 ? (
              <div className={styles.listingsGrid}>
                {reviewsData.results.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onClick={() => setSelectedReview(review)}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.noData}>{t("userDetails.noReviews")}</p>
            )}
          </div>

          {/* Reviews By User Section */}
          {reviewsByUserData && reviewsByUserData.results.length > 0 && (
            <>
              <div className={styles.divider}></div>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <IconMessageCircle size={20} />
                  <h3>
                    {t("userDetails.reviewsByUser")} ({reviewsByUserData.count})
                  </h3>
                </div>
                <div className={styles.listingsGrid}>
                  {reviewsByUserData.results.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onClick={() => setSelectedReview(review)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Reports Section */}
          {reportsData && reportsData.results.length > 0 && (
            <>
              <div className={styles.divider}></div>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <IconFlag size={20} />
                  <h3>
                    {t("userDetails.reportsAgainstUser")} ({reportsData.count})
                  </h3>
                </div>
                <div className={styles.listingsGrid}>
                  {reportsData.results.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onClick={() => setSelectedReport(report)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Ban User Button */}
          {displayUser.is_active && (
            <div className={styles.actions}>
              <button
                className={styles.banButton}
                onClick={handleBanUser}
                disabled={banUser.isPending}
              >
                <IconBan size={18} />
                {t("userDetails.banUser")}
              </button>
            </div>
          )}
        </div>
      </DetailModal>
      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          getStatusClass={getStatusClass}
        />
      )}

      {/* Review Overlay */}
      <ReviewModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onDelete={() => {}}
      />

      {/* Report Overlay */}
      <ReportModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onStatusChange={() => {}}
      />
    </>
  );
}
