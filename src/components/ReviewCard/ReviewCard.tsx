import { useTranslation } from "react-i18next";
import { IconStarFilled } from "@tabler/icons-react";
import type { Review } from "../../types/support.types";
import styles from "./ReviewCard.module.css";

interface ReviewCardProps {
  review: Review;
  onClick?: () => void;
}

export default function ReviewCard({ review, onClick }: ReviewCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <span className={styles.id}>
          {t("reviews.review")} #{review.id}
        </span>
        <div className={styles.rating}>
          <IconStarFilled size={14} className={styles.starIcon} />
          <span>{review.rating}</span>
        </div>
      </div>
      <div className={styles.content}>
        {review.listing_title && (
          <p className={styles.target}>{review.listing_title}</p>
        )}
        {review.reviewed_user_name && (
          <p className={styles.target}>
            {t("reviews.user")}: {review.reviewed_user_name}
          </p>
        )}
        <p className={styles.comment}>
          {review.comment || t("common.noComment")}
        </p>
        <div className={styles.footer}>
          <span className={styles.author}>
            {t("reviews.by")} {review.reviewer_name}
          </span>
          <span className={styles.date}>
            {new Date(review.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
