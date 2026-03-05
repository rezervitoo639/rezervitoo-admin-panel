/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get rating stars for display
 */
export function getRatingStars(
  rating: number,
  size: "small" | "large" = "small"
) {
  const starSize = size === "large" ? 24 : 16;
  const stars = [];

  for (let i = 0; i < 5; i++) {
    stars.push({
      filled: i < rating,
      size: starSize,
    });
  }

  return stars;
}

/**
 * Format review type for display
 */
export function formatReviewType(type: string): string {
  return type === "USER_TO_LISTING" ? "Listing" : "User";
}
