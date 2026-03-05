import { useTranslation } from "react-i18next";
import Table from "../../../components/Table/Table";
import RoleBadge from "../../../components/RoleBadge/RoleBadge";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import ActionButtons from "../../../components/ActionButtons/ActionButtons";
import { formatPrice, getListingPrice } from "../listing.utils";
import type { Listing } from "../../../types/listing.types";
import styles from "../../../pages/Listings/ListingsPage.module.css";

interface ListingsTableProps {
  listings: Listing[];
  onView: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
}

export default function ListingsTable({
  listings,
  onView,
  onDelete,
}: ListingsTableProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.tableContainer}>
      <Table
        columns={[
          {
            key: "title",
            label: t("listings.title"),
            render: (listing: Listing) => (
              <div
                onClick={() => onView(listing)}
                className={styles.listingTitleCell}
              >
                <img
                  src={listing.cover_image}
                  alt={listing.title}
                  className={styles.listingCoverImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                <div>
                  <div className="entity-title">{listing.title}</div>
                  <div className="entity-id">ID: {listing.id}</div>
                </div>
              </div>
            ),
          },
          {
            key: "bookings",
            label: t("bookings.totalBookings"),
            headerClassName: styles.centerHeader,
            render: (listing: Listing) => (
              <div className={styles.centerCell}>
                {/* @ts-ignore - total_bookings field may be missing in type definition but exists in API */}
                {listing.bookings_count || 0}
              </div>
            ),
          },
          {
            key: "type",
            label: t("filters.propertyType"),
            headerClassName: styles.centerHeader,
            render: (listing: Listing) => (
              <div className={styles.centerCell}>
                <RoleBadge role={listing.listing_type} size="small" />
              </div>
            ),
          },
          {
            key: "location",
            label: t("listings.location"),
            headerClassName: styles.centerHeader,
            render: (listing: Listing) => (
              <div className={styles.centerCell}>
                {listing.location_text ||
                  listing.location?.city ||
                  t("common.na")}
              </div>
            ),
          },
          {
            key: "price",
            label: t("listings.price"),
            headerClassName: styles.centerHeader,
            render: (listing: Listing) => (
              <div className={styles.priceCell}>
                <div className="entity-price">
                  {formatPrice(getListingPrice(listing))}
                </div>
              </div>
            ),
          },
          {
            key: "status",
            label: t("common.status"),
            headerClassName: styles.centerHeader,
            render: (listing: Listing) => (
              <div className={styles.centerCell}>
                <StatusBadge status={listing.approval_status} />
              </div>
            ),
          },
          {
            key: "actions",
            label: t("common.actions"),
            headerClassName: styles.centerHeader,
            render: (listing: Listing) => (
              <div className={styles.flexCenter}>
                <ActionButtons
                  onView={() => onView(listing)}
                  onDelete={() => onDelete(listing)}
                  viewTitle="View Details"
                />
              </div>
            ),
          },
        ]}
        data={listings}
        emptyMessage="No listings found"
      />
    </div>
  );
}
