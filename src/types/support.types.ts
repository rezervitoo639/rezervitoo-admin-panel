export interface Report {
  id: number;
  reporter: number;
  reporter_details: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    account_type: string;
    role: string | null;
    pfp: string | null;
  };
  reported: number;
  reported_details: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    account_type: string;
    role: string | null;
    pfp: string | null;
  };
  reason: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  reviewer: number;
  reviewer_id: number;
  reviewer_details?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  reviewer_name: string;
  reviewer_picture: string | null;
  booking: number;
  review_type: "USER_TO_LISTING" | "PROVIDER_TO_USER";
  listing: number | null;
  listing_title: string | null;
  listing_cover: string | null;
  listing_type: string | null;
  reviewed_user: number | null;
  reviewed_user_id: number | null;
  reviewed_user_name: string | null;
  reviewed_user_picture: string | null;
  rating: number;
  comment: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRating {
  user_id: number;
  average_rating: number;
  review_count: number;
}
