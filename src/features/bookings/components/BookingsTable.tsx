import { useTranslation } from "react-i18next";
import Table from "../../../components/Table/Table";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import ActionButtons from "../../../components/ActionButtons/ActionButtons";
import type { Booking } from "../../../types/booking.types";
import styles from "../../../pages/Bookings/BookingsPage.module.css";

interface BookingsTableProps {
  bookings: Booking[];
  onView: (booking: Booking) => void;
}

export default function BookingsTable({
  bookings,
  onView,
}: BookingsTableProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.tableContainer}>
      <Table
        columns={[
          {
            key: "id",
            label: t("bookings.bookingId"),
            render: (booking: Booking) => (
              <span
                onClick={() => onView(booking)}
                className={styles.bookingIdCell}
              >
                #{booking.id}
              </span>
            ),
          },
          {
            key: "user",
            label: t("bookings.guestName"),
            render: (booking: Booking) => (
              <div>
                <div className="entity-title">
                  {booking.guest_name || `User #${booking.user}`}
                </div>
                <div className="entity-id">ID: {booking.user}</div>
              </div>
            ),
          },
          {
            key: "listing",
            label: t("bookings.listingTitle"),
            render: (booking: Booking) => (
              <div>
                <div className="entity-title">
                  {booking.listing_title || `Listing #${booking.listing}`}
                </div>
                <div className="entity-id">ID: {booking.listing}</div>
              </div>
            ),
          },
          {
            key: "dates",
            label: t("bookings.dates"),
            headerClassName: styles.centerHeader,
            render: (booking: Booking) => (
              <div className={styles.datesCell}>
                {booking.start_date && booking.end_date ? (
                  <>
                    <div>
                      {new Date(booking.start_date).toLocaleDateString()}
                    </div>
                    <div className={styles.dateSeparator}></div>
                    <div>{new Date(booking.end_date).toLocaleDateString()}</div>
                  </>
                ) : (
                  <div className={styles.scheduleBased}>
                    {t("bookings.scheduleBased")}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "total_price",
            label: t("bookings.totalPrice"),
            headerClassName: styles.centerHeader,
            render: (booking: Booking) => (
              <div className={styles.priceCell}>
                <span className="entity-price">{booking.total_price} DA</span>
              </div>
            ),
          },
          {
            key: "status",
            label: t("common.status"),
            headerClassName: styles.centerHeader,
            render: (booking: Booking) => (
              <div className={styles.centerCell}>
                <StatusBadge status={booking.status} />
              </div>
            ),
          },
          {
            key: "actions",
            label: t("common.actions"),
            headerClassName: styles.centerHeader,
            render: (booking: Booking) => (
              <div className={styles.flexCenter}>
                <ActionButtons
                  onView={() => onView(booking)}
                  viewTitle={t("common.viewDetails")}
                />
              </div>
            ),
          },
        ]}
        data={bookings}
        emptyMessage="No bookings found"
      />
    </div>
  );
}
