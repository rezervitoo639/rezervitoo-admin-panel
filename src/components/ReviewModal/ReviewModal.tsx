import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { IconStarFilled } from "@tabler/icons-react";
import Modal from "../Modal/Modal";
import ProfileSection from "../ProfileSection/ProfileSection";
import ListingCard from "../ListingCard/ListingCard";
import UserDetails from "../UserDetails/UserDetails";
import ProviderDetails from "../ProviderDetails/ProviderDetails";
import ListingDetails from "../ListingDetails/ListingDetails";
import ImageViewer from "../ImageViewer/ImageViewer";
import { listingsApi } from "../../api/listings.api";
import type { Review } from "../../types/support.types";
import type { Listing } from "../../types/listing.types";
import type { User } from "../../types/user.types";
import styles from "./ReviewModal.module.css";

interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (reviewId: number) => void;
}

export default function ReviewModal({
  review,
  isOpen,
  onClose,
  onDelete,
}: ReviewModalProps) {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  // Fetch full listing data if this is a listing review
  const { data: fullListingData } = useQuery({
    queryKey: ["listing", review?.listing],
    queryFn: () => listingsApi.getById(review!.listing!),
    enabled: !!review?.listing && review.review_type === "USER_TO_LISTING",
  });

  if (!review) return null;

  const getRatingStars = (rating: number) => {
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <IconStarFilled
            key={i}
            size={16}
            style={{
              color: i < rating ? "#fbbf24" : "#d1d5db",
            }}
          />
        ))}
      </div>
    );
  };

  // Use full listing data from API or create minimal object as fallback
  const listingForCard: Listing | null =
    review.review_type === "USER_TO_LISTING" && review.listing
      ? fullListingData ||
        ({
          id: review.listing,
          title: review.listing_title || "Listing",
          cover_image: review.listing_cover || "",
          listing_type: review.listing_type || "PROPERTY",
          price: "N/A",
          approval_status: "APPROVED",
        } as any)
      : null;

  // Create user for reviewed user in provider reviews
  const reviewedUser: User | null =
    review.review_type === "PROVIDER_TO_USER"
      ? ({
          id: review.reviewed_user_id,
          first_name:
            review.reviewed_user_name?.split(" ")[0] ||
            review.reviewed_user_name ||
            "User",
          last_name:
            review.reviewed_user_name?.split(" ").slice(1).join(" ") || "",
          email: "",
          pfp: review.reviewed_user_picture,
          account_type: "USER",
          role: null,
        } as any)
      : null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t("reviews.reviewDetails")}
        hideOverlay={!!(selectedUser || selectedProvider || selectedListing)}
      >
        <div className={styles.reviewModal}>
          {/* Listing Card for User to Listing Reviews */}
          {listingForCard && (
            <div className={styles.listingSection}>
              <h3 className={styles.sectionTitle}>
                {t("reviews.reviewedListing")}
              </h3>
              <ListingCard
                listing={listingForCard}
                onClick={() => setSelectedListing(listingForCard)}
              />
            </div>
          )}

          {/* Reviewed User for Provider Reviews */}
          {reviewedUser && (
            <ProfileSection
              user={reviewedUser}
              onClick={() => setSelectedUser(reviewedUser)}
              title={t("reviews.reviewedUser")}
            />
          )}

          {/* Compact Review Section: Profile + Date on left, Rating on right, Comment below */}
          <div className={styles.reviewContainer}>
            <div className={styles.reviewHeader}>
              <div
                className={styles.reviewerInfo}
                onClick={() => {
                  const isProvider = review.review_type === "PROVIDER_TO_USER";
                  const user = {
                    id: review.reviewer_id,
                    first_name:
                      review.reviewer_name.split(" ")[0] ||
                      review.reviewer_name,
                    last_name:
                      review.reviewer_name.split(" ").slice(1).join(" ") || "",
                    email: "",
                    pfp: review.reviewer_picture,
                    account_type: isProvider ? "PROVIDER" : "USER",
                    role: isProvider ? ("HOST" as const) : null,
                  } as any;

                  if (isProvider) {
                    setSelectedProvider(user);
                  } else {
                    setSelectedUser(user);
                  }
                }}
              >
                {review.reviewer_picture ? (
                  <img
                    src={review.reviewer_picture}
                    alt={review.reviewer_name}
                    className={styles.reviewerAvatar}
                  />
                ) : (
                  <div className={styles.reviewerAvatarPlaceholder}>
                    {review.reviewer_name[0].toUpperCase()}
                  </div>
                )}
                <div className={styles.reviewerDetails}>
                  <div className={styles.reviewerName}>
                    {review.reviewer_name}
                  </div>
                  <div className={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className={styles.ratingSection}>
                {getRatingStars(review.rating)}
              </div>
            </div>

            {/* Comment */}
            {review.comment && (
              <div className={styles.commentSection}>
                <p className={styles.commentText}>{review.comment}</p>
              </div>
            )}

            {/* Review Image */}
            {review.image && (
              <div
                className={styles.imageSection}
                onClick={() => setImageViewerOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={review.image}
                  alt="Review"
                  className={styles.reviewImage}
                />
              </div>
            )}
          </div>

          {/* Delete Button */}
          <div className={styles.modalActions}>
            <button
              onClick={() => {
                if (confirm("Delete this review?")) {
                  onDelete(review.id);
                  onClose();
                }
              }}
              className={styles.deleteButton}
            >
              Delete Review
            </button>
          </div>
        </div>
      </Modal>

      {/* Image Viewer */}
      {review?.image && (
        <ImageViewer
          images={[review.image]}
          initialIndex={0}
          isOpen={imageViewerOpen}
          onClose={() => setImageViewerOpen(false)}
        />
      )}

      {/* Detail Modals */}
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          elevatedZIndex={true}
          hideOverlay={true}
        />
      )}
      {selectedProvider && (
        <ProviderDetails
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          showActions={false}
          elevatedZIndex={true}
          hideOverlay={true}
        />
      )}
      {selectedListing && (
        <ListingDetails
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          showActions={false}
          elevatedZIndex={true}
          hideOverlay={true}
        />
      )}
    </>
  );
}
