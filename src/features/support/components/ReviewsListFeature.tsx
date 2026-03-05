import { useState } from "react";
import Loader from "../../../components/Loader/Loader";
import ReviewModal from "../../../components/ReviewModal/ReviewModal";
import Pagination from "../../../components/Pagination/Pagination";
import ReviewsTable from "./ReviewsTable";
import { IconAlertCircle } from "@tabler/icons-react";
import { useReviews, useDeleteReview } from "../hooks/useReviews";
import { notifications } from "../../../utils/notifications";
import type { Review } from "../../../types/support.types";
import type { ReviewFilters } from "../hooks/useReviewFilters";
import styles from "../../../pages/Reviews/ReviewsPage.module.css";

interface ReviewsListFeatureProps {
  filters: ReviewFilters;
  setFilter: (key: keyof ReviewFilters, value: any) => void;
}

export default function ReviewsListFeature({
  filters,
  setFilter,
}: ReviewsListFeatureProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);

  const ratingValue = filters.ratingFilter
    ? Number(filters.ratingFilter)
    : undefined;

  const { data, isLoading, error } = useReviews({
    review_type: filters.reviewType === "all" ? undefined : filters.reviewType,
    min_rating: ratingValue,
    max_rating: ratingValue,
    page: filters.page,
    page_size: filters.pageSize,
  });

  const deleteMutation = useDeleteReview();

  const handleDelete = (review: Review) => {
    if (confirm("Delete this review?")) {
      deleteMutation.mutate(review.id, {
        onSuccess: () => {
          notifications.show({
            title: "Deleted",
            message: "Review has been deleted",
            color: "orange",
          });
          setShowModal(false);
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Failed to delete review",
            color: "red",
          });
        },
      });
    }
  };

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className={styles.errorContainer}>
        <IconAlertCircle size={32} /> <span>Error loading reviews</span>
      </div>
    );

  const reviews = data?.results || [];

  return (
    <>
      <ReviewsTable
        reviews={reviews}
        onView={handleView}
        onDelete={handleDelete}
      />

      {data && data.count > 0 && (
        <Pagination
          currentPage={filters.page}
          totalPages={Math.ceil(data.count / filters.pageSize)}
          totalCount={data.count}
          pageSize={filters.pageSize}
          onPageChange={(page) => setFilter("page", page)}
          onPageSizeChange={(size) => setFilter("pageSize", size)}
          itemName="reviews"
        />
      )}

      <ReviewModal
        review={selectedReview}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDelete={(id) => {
          const review = reviews.find((r) => r.id === id);
          if (review) handleDelete(review);
        }}
      />
    </>
  );
}
