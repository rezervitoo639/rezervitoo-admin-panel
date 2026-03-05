export interface DashboardStats {
  overview: {
    total_users: number;
    total_providers: number;
    total_listings: number;
    pending_listings: number;
    total_bookings: number;
    pending_bookings: number;
    completed_bookings: number;
    pending_verifications: number;
    revenue_total: string;
    active_listings: number;
    users_trend: number;
    providers_trend: number;
  };
  graphs: {
    users_growth: { month: string; count: number }[];
    providers_growth_by_role: {
      host: { month: string; count: number }[];
      hotel: { month: string; count: number }[];
      hostel: { month: string; count: number }[];
      agency: { month: string; count: number }[];
    };
    listings_growth: { month: string; count: number }[];
    listings_growth_by_type: {
      property: { month: string; count: number }[];
      hotelroom: { month: string; count: number }[];
      hostelbed: { month: string; count: number }[];
      travelpackage: { month: string; count: number }[];
    };
    bookings_growth: { month: string; count: number }[];
    bookings_growth_by_type: {
      property: { month: string; count: number }[];
      hotelroom: { month: string; count: number }[];
      hostelbed: { month: string; count: number }[];
      travelpackage: { month: string; count: number }[];
    };
  };
  distributions: {
    users: { name: string; value: number; role: string }[];
    listings: { polymorphic_ctype__model: string; count: number }[];
    bookings: { listing__polymorphic_ctype__model: string; count: number }[];
  };
}
