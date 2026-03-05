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
 * Get status color based on report status
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "#ffd43b",
    UNDER_REVIEW: "#339af0",
    RESOLVED: "#51cf66",
    DISMISSED: "#adb5bd",
  };
  return colors[status] || colors.PENDING;
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    HIGH: "#ff6b6b",
    MEDIUM: "#ffd43b",
    LOW: "#51cf66",
  };
  return colors[priority] || colors.MEDIUM;
}
