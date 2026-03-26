import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { IconCalendar, IconUser } from "@tabler/icons-react";
import DetailModal from "../DetailModal/DetailModal";
import ListingDetails from "../ListingDetails/ListingDetails.tsx";
import ListingCard from "../ListingCard/ListingCard.tsx";
import RoleBadge from "../RoleBadge/RoleBadge.tsx";
import StatusBadge from "../StatusBadge/StatusBadge.tsx";
import { listingsApi } from "../../api/listings.api";
import type { Booking } from "../../types/booking.types";
import type { Listing } from "../../types/listing.types";
import styles from "./BookingDetails.module.css";

interface BookingDetailsProps {
  booking: Booking | null;
  onClose: () => void;
  getStatusClass: (status: string) => string;
  elevatedZIndex?: boolean;
}

export default function BookingDetails({
  booking,
  onClose,
  getStatusClass,
  elevatedZIndex = false,
}: BookingDetailsProps) {
  const { t } = useTranslation();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Fetch listing details
  const { data: listing } = useQuery({
    queryKey: ["listing", booking?.listing],
    queryFn: () => listingsApi.getById(booking!.listing),
    enabled: !!booking?.listing,
  });

  if (!booking) return null;

  return (
    <>
      <DetailModal
        isOpen={!!booking}
        onClose={onClose}
        title={`${t("bookings.bookingId")} #${booking.id}`}
        elevatedZIndex={elevatedZIndex}
      >
        <div className={styles.container}>
          {/* Booking Details Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <IconCalendar size={20} />
              <h3>{t("bookings.bookingDetails")}</h3>
            </div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.label}>{t("bookings.bookingId")}:</span>
                <span className={styles.value}>#{booking.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>
                  {t("bookings.listingType")}:
                </span>
                <RoleBadge
                  role={booking.listing_type_at_booking}
                  size="small"
                />
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>{t("common.status")}:</span>
                <StatusBadge status={booking.status} />
              </div>
              {booking.schedule && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>
                    {t("bookings.scheduleId")}:
                  </span>
                  <span className={styles.value}>#{booking.schedule}</span>
                </div>
              )}
              {booking.start_date && booking.end_date ? (
                <>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>
                      {t("bookings.checkIn")}:
                    </span>
                    <span className={styles.value}>
                      {new Date(booking.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>
                      {t("bookings.checkOut")}:
                    </span>
                    <span className={styles.value}>
                      {new Date(booking.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>
                      {t("bookings.duration")}:
                    </span>
                    <span className={styles.value}>
                      {Math.ceil(
                        (new Date(booking.end_date).getTime() -
                          new Date(booking.start_date).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      {t("bookings.nights")}
                    </span>
                  </div>
                </>
              ) : (
                <div className={styles.detailRow}>
                  <span className={styles.label}>{t("bookings.dates")}:</span>
                  <span className={styles.value}>
                    {t("bookings.scheduleBased")}
                  </span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.label}>{t("bookings.guests")}:</span>
                <span className={styles.value}>{booking.guests_count}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>
                  {t("bookings.totalPrice")}:
                </span>
                <span className="entity-price">{booking.total_price} DA</span>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          {booking.guest_details && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <IconUser size={20} />
                <h3>{t("bookings.guestInformation")}</h3>
              </div>
              <div className={styles.profileWidget}>
                <div className={styles.avatar}>
                  {booking.guest_details.pfp ? (
                    <img src={booking.guest_details.pfp} alt={booking.guest_details.name} />
                  ) : (
                    <span>{booking.guest_details.name?.[0]?.toUpperCase() ?? "G"}</span>
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <p className={styles.profileName}>{booking.guest_details.name}</p>
                  <p className={styles.label}>{booking.guest_details.email}</p>
                  {booking.guest_details.phone && (
                    <p className={styles.label}>{booking.guest_details.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Listing Information */}
          {listing && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>{t("bookings.listingInformation")}</h3>
              </div>
              <ListingCard
                listing={listing}
                onClick={() => setSelectedListing(listing)}
              />
            </div>
          )}
        </div>
      </DetailModal>
      {selectedListing && (
        <ListingDetails
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          showActions={false}
        />
      )}
    </>
  );
}
