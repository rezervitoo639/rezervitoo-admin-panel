import { useTranslation } from "react-i18next";
import Table from "../../../components/Table/Table";
import ActionButtons from "../../../components/ActionButtons/ActionButtons";
import { formatDate, getRatingStars } from "../utils/review.utils";
import type { Review } from "../../../types/support.types";
import styles from "../../../pages/Reviews/ReviewsPage.module.css";

interface ReviewsTableProps {
  reviews: Review[];
  onView: (review: Review) => void;
  onDelete: (review: Review) => void;
}

export default function ReviewsTable({
  reviews,
  onView,
  onDelete,
}: ReviewsTableProps) {
  const { t } = useTranslation();
  const renderRatingStars = (rating: number) => {
    const stars = getRatingStars(rating, "small");
    return (
      <div className={styles.stars}>
        {stars.map((star, i) => (
          <svg
            key={i}
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill={star.filled ? "#fbbf24" : "none"}
            stroke={star.filled ? "#fbbf24" : "#d1d5db"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <Table
      columns={[
        {
          key: "id",
          label: t("reviews.id"),
          render: (review: Review) => `#${review.id}`,
        },
        {
          key: "reviewer",
          label: t("reviews.reviewer"),
          render: (review: Review) => (
            <div className={styles.user}>
              <div className="entity-title">{review.reviewer_name}</div>
              <div className="entity-id">ID: {review.reviewer}</div>
            </div>
          ),
        },
        {
          key: "reviewed",
          label: t("reviews.reviewed"),
          render: (review: Review) => {
            const name =
              review.review_type === "USER_TO_LISTING"
                ? review.listing_title || `Listing #${review.listing}`
                : review.reviewed_user_name || `User #${review.reviewed_user}`;

            return (
              <div className={styles.user}>
                <div title={name} className="entity-title">
                  {name.length > 20 ? `${name.substring(0, 20)}...` : name}
                </div>
                <div className="entity-id">
                  ID:{" "}
                  {review.review_type === "USER_TO_LISTING"
                    ? review.listing
                    : review.reviewed_user}
                </div>
              </div>
            );
          },
        },
        {
          key: "rating",
          label: t("reviews.rating"),
          headerClassName: styles.centerHeader,
          render: (review: Review) => (
            <div className={styles.centerCell}>
              {renderRatingStars(review.rating)}
            </div>
          ),
        },
        {
          key: "review",
          label: t("reviews.review"),
          render: (review: Review) => (
            <div className={styles.reviewText} title={review.comment || ""}>
              {review.comment && review.comment.length > 30
                ? `${review.comment.substring(0, 30)}...`
                : review.comment || "-"}
            </div>
          ),
        },
        {
          key: "created_at",
          label: t("reviews.date"),
          headerClassName: styles.centerHeader,
          render: (review: Review) => (
            <div className={styles.centerCell}>
              {formatDate(review.created_at)}
            </div>
          ),
        },
        {
          key: "actions",
          label: t("common.actions"),
          headerClassName: styles.centerHeader,
          render: (review: Review) => (
            <div className={styles.centerCell}>
              <ActionButtons
                onView={() => onView(review)}
                onDelete={() => onDelete(review)}
              />
            </div>
          ),
        },
      ]}
      data={reviews}
      emptyMessage={t("reviews.noReviewsFound")}
    />
  );
}
