export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

export interface Restriction {
  id: number;
  name: string;
  icon?: string;
}

export interface Nearby {
  id: number;
  name: string;
  icon?: string;
  distance?: string;
}

export interface BedType {
  id: number;
  name: string;
  icon?: string;
}

export interface ListingBed {
  id: number;
  bed_type_details: BedType;
  quantity: number;
}

export interface ListingImage {
  id: number;
  image: string;
}

export interface ItineraryItem {
  id: number;
  day: number;
  title: string;
  description: string;
}

export interface UnavailableDate {
  id: number;
  start_date: string;
  end_date: string;
  reason?: string;
}

export interface PackageSchedule {
  id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  max_capacity: number;
  spots_booked: number;
  spots_available: number;
  is_fully_booked: boolean;
  created_at: string;
}

export interface Location {
  address?: string;
  city?: string;
  district?: string;
  lat?: number | null;
  lng?: number | null;
}

interface BaseListing {
  id: number;
  owner: number;
  owner_name: string;
  title: string;
  description: string;
  price?: string; // Optional for packages (use base_price instead)
  negotiable: boolean;
  quantity: number;
  max_guests: number;
  min_duration: number;
  specifications: Record<string, unknown>;
  cover_image: string;
  location_lat: number | null;
  location_lng: number | null;
  location_text: string;
  location?: Location;
  is_active: boolean;
  is_featured?: boolean;
  approval_status: ApprovalStatus;
  amenities?: Amenity[];
  amenity_details?: Amenity[];
  restriction_details?: Restriction[];
  nearby_details?: Nearby[];
  beds?: ListingBed[];
  images?: ListingImage[];
  unavailable_dates?: UnavailableDate[];
  created_at: string;
  updated_at: string;
  average_rating: number;
  review_count?: number;
  view_count?: number;
  wishlist_count: number;
  bookings_count?: number;
  is_wishlisted?: boolean;
}

export interface PropertyListing extends BaseListing {
  listing_type: string;
  host_profile: number;
  property_type: "HOUSE" | "APARTMENT" | "CABIN" | "VILLA" | "STUDIO";
  bedrooms: number;
  bathrooms: number;
}

export interface HotelRoomListing extends BaseListing {
  listing_type: string;
  hotel_profile: number;
  room_category: "SINGLE" | "DOUBLE" | "SUITE" | "DELUXE" | "FAMILY";
  hotel_stars?: number;
}

export interface HostelBedListing extends BaseListing {
  listing_type: string;
  hostel_profile: number;
  room_type: "DORM" | "PRIVATE";
  gender: "MALE" | "FEMALE";
}

export interface TravelPackageListing extends BaseListing {
  listing_type: string;
  agency_profile: number;
  package_type: "LOCAL" | "HAJJ" | "UMRAH" | "INTERNATIONAL";
  duration_days: number;
  start_location: string;
  destination: string;
  base_price: string; // Display price (actual prices in schedules)
  itinerary_items?: ItineraryItem[];
  schedules?: PackageSchedule[]; // Available departure schedules
}

export type Listing =
  | PropertyListing
  | HotelRoomListing
  | HostelBedListing
  | TravelPackageListing;
