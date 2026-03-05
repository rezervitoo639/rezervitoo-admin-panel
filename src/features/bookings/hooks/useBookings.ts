import { useQuery } from "@tanstack/react-query";
import { bookingsApi, type BookingFilters } from "../../../api/bookings.api";

export function useBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => bookingsApi.list(filters),
  });
}

export function useBooking(id: number) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingsApi.getById(id),
    enabled: !!id,
  });
}
