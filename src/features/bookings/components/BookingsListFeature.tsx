import { useState } from "react";
import Loader from "../../../components/Loader/Loader";
import BookingDetails from "../../../components/BookingDetails/BookingDetails";
import Pagination from "../../../components/Pagination/Pagination";
import BookingsTable from "./BookingsTable";
import BookingsFilterModal from "./BookingsFilterModal";
import { IconAlertCircle } from "@tabler/icons-react";
import { useBookings } from "../hooks/useBookings";
import type { Booking } from "../../../types/booking.types";
import type { BookingFilters } from "../hooks/useBookingFilters";
import styles from "../../../pages/Bookings/BookingsPage.module.css";

interface BookingsListFeatureProps {
  filters: BookingFilters;
  showFilters: boolean;
  setFilter: (key: keyof BookingFilters, value: any) => void;
  setShowFilters: (show: boolean) => void;
  clearFilters: () => void;
  getStatusClass: (status: string) => string;
}

export default function BookingsListFeature({
  filters,
  showFilters,
  setFilter,
  setShowFilters,
  clearFilters,
  getStatusClass,
}: BookingsListFeatureProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data, isLoading, error } = useBookings({
    search: filters.search,
    status: filters.status || undefined,
    listing_type: filters.listingType || undefined,
    min_price: filters.minPrice || undefined,
    max_price: filters.maxPrice || undefined,
    start_date_from: filters.startDateFrom || undefined,
    start_date_to: filters.startDateTo || undefined,
    page: filters.page,
    page_size: filters.pageSize,
  });

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className={styles.errorContainer}>
        <IconAlertCircle size={32} /> <span>Error loading bookings</span>
      </div>
    );

  const bookings = data?.results || [];

  return (
    <>
      <BookingsTable bookings={bookings} onView={setSelectedBooking} />

      {data && data.count > 0 && (
        <Pagination
          currentPage={filters.page}
          totalPages={Math.ceil(data.count / filters.pageSize)}
          totalCount={data.count}
          pageSize={filters.pageSize}
          onPageChange={(page) => setFilter("page", page)}
          onPageSizeChange={(size) => setFilter("pageSize", size)}
          itemName="bookings"
        />
      )}

      <BookingsFilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
      />

      <BookingDetails
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        getStatusClass={getStatusClass}
      />
    </>
  );
}
