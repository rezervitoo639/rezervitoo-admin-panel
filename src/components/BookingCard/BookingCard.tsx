import { useTranslation } from "react-i18next";
import type { Booking } from "../../types/booking.types";
import styles from "./BookingCard.module.css";

interface BookingCardProps {
  booking: Booking;
  onClick?: () => void;
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  const { t } = useTranslation();
  const getStatusClass = () => {
    const statusMap: Record<string, string> = {
      PENDING: styles.statusPending,
      ACCEPTED: styles.statusAccepted,
      REJECTED: styles.statusRejected,
      CANCELLED: styles.statusCancelled,
      COMPLETED: styles.statusCompleted,
    };
    return statusMap[booking.status] || styles.statusPending;
  };

  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <span className={styles.id}>
          {t("cards.booking")} #{booking.id}
        </span>
        <span className={`${styles.status} ${getStatusClass()}`}>
          {booking.status}
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.label}>{t("cards.listing")}:</span>
          <span className={styles.value}>
            {booking.listing_details?.title || `ID: ${booking.listing}`}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>{t("cards.dates")}:</span>
          <span className={styles.value}>
            {booking.start_date && booking.end_date
              ? `${new Date(
                  booking.start_date,
                ).toLocaleDateString()} - ${new Date(
                  booking.end_date,
                ).toLocaleDateString()}`
              : t("common.na")}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>{t("cards.guests")}:</span>
          <span className={styles.value}>{booking.guests_count}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>{t("cards.total")}:</span>
          <span className="entity-price">{booking.total_price} DA</span>
        </div>
      </div>
    </div>
  );
}
