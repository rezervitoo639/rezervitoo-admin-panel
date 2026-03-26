export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface Booking {
  id: number;
  listing: number;
  schedule?: number | null; // For package bookings
  start_date: string | null; // Nullable for packages
  end_date: string | null; // Nullable for packages
  total_price: string;
  guests_count: number;
  status: BookingStatus;
  listing_type_at_booking: string;
  listing_details?: {
    id: number;
    title: string;
    cover_image: string;
    listing_type: string;
    base_price?: string; // For packages
    price?: string; // For accommodations
  };
  // Flat fields for table display
  guest_details?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    pfp: string | null;
  };
  listing_title?: string;
  created_at: string;
  updated_at: string;
}
