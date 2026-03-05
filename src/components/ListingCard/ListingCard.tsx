import { IconStarFilled } from "@tabler/icons-react";
import type { Listing } from "../../types/listing.types";
import styles from "./ListingCard.module.css";

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export default function ListingCard({ listing, onClick }: ListingCardProps) {
  const getStatusClass = () => {
    const statusMap: Record<string, string> = {
      APPROVED: styles.statusApproved,
      PENDING: styles.statusPending,
      REJECTED: styles.statusRejected,
    };
    return statusMap[listing.approval_status] || styles.statusPending;
  };

  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
    >
      <div className={styles.image}>
        <img
          src={listing.cover_image || "/placeholder.jpg"}
          alt={listing.title}
        />
        <span className={`${styles.status} ${getStatusClass()}`}>
          {listing.approval_status}
        </span>
      </div>
      <div className={styles.content}>
        <h4 className={`${styles.title} entity-title`}>{listing.title}</h4>
        <p className={styles.type}>{listing.listing_type.replace(/_/g, " ")}</p>
        <div className={styles.footer}>
          <div className={styles.rating}>
            <IconStarFilled size={14} className={styles.starIcon} />
            <span>
              {listing.average_rating
                ? listing.average_rating.toFixed(1)
                : "N/A"}
            </span>
          </div>
          <span className="entity-price">{listing.price} DA</span>
        </div>
      </div>
    </div>
  );
}
