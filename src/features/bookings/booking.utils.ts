import type { Booking, BookingStatus } from "../../types/booking.types";

export function getBookingStatusColor(status: BookingStatus): string {
  const colors: Record<BookingStatus, string> = {
    ACCEPTED: "success",
    PENDING: "warning",
    REJECTED: "danger",
    CANCELLED: "danger",
    COMPLETED: "success",
  };
  return colors[status];
}

export function calculateBookingDuration(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatBookingDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isBookingActive(booking: Booking): boolean {
  return booking.status === "ACCEPTED" || booking.status === "PENDING";
}
