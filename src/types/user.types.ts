export type AccountType = "USER" | "PROVIDER";
export type ProviderRole = "HOST" | "HOSTEL" | "HOTEL" | "AGENCY";
export type VerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  account_type: AccountType;
  role: ProviderRole | null;
  verification_status: VerificationStatus;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pfp?: string;
  // Profile-specific fields
  hotel_name?: string | null;
  hotel_stars?: number | null;
  hostel_name?: string | null;
  agency_name?: string | null;
  host_type?: "OWNER" | "AGENT" | null;
  // Documents for verification
  documents?: string[]; // Array of document field names that have files
  // Host documents
  national_id?: string;
  national_id_recto?: string;
  national_id_verso?: string;
  // Business documents (Hostel, Hotel, Agency)
  nrc?: string;
  nif?: string;
  nrc_image?: string;
  nif_image?: string;

  // Annotated fields
  total_bookings?: number;
  last_login?: string | null;
  total_listings?: number;
  provider_total_bookings?: number;
  rating?: number;
}

export interface UserFilters {
  search?: string;
  account_type?: AccountType;
  role?: ProviderRole;
  verification_status?: VerificationStatus;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}
