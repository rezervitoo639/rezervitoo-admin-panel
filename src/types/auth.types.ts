export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  account_type: "ADMIN" | "PROVIDER" | "USER";
  role: "HOST" | "HOSTEL" | "HOTEL" | "AGENCY" | null;
  phone: string;
  pfp?: string;
  verification_status: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  email_verified: boolean;
}
