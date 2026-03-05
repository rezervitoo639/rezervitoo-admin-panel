import type {
  Listing,
  ApprovalStatus,
  TravelPackageListing,
} from "../../types/listing.types";

export function getListingTypeName(listing: Listing): string {
  const typeNames: Record<string, string> = {
    PropertyListing: "Property",
    HotelRoomListing: "Hotel Room",
    HostelBedListing: "Hostel Bed",
    TravelPackageListing: "Travel Package",
  };
  return typeNames[listing.listing_type] || listing.listing_type;
}

export function getApprovalStatusColor(status: ApprovalStatus): string {
  const colors: Record<ApprovalStatus, string> = {
    APPROVED: "success",
    PENDING: "warning",
    REJECTED: "danger",
  };
  return colors[status];
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `${numPrice.toFixed(2)} DA`;
}

export function getListingPrice(listing: Listing): string {
  if (listing.listing_type === "TRAVEL_PACKAGE") {
    const packageListing = listing as TravelPackageListing;
    return packageListing.base_price || packageListing.price || "0";
  }
  return listing.price || "0";
}

export function isListingActive(listing: Listing): boolean {
  return listing.is_active && listing.approval_status === "APPROVED";
}
