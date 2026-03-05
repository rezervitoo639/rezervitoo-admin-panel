import type { DashboardStats } from "../../types/stats.types";
import styles from "./StatsGroup.module.css";

interface StatsGroupProps {
  data?: DashboardStats;
  filter?: string[];
  compact?: boolean;
}

const statLabels: Record<keyof DashboardStats, string> = {
  total_users: "Total Users",
  total_providers: "Total Providers",
  total_listings: "Total Listings",
  pending_listings: "Pending Listings",
  active_listings: "Active Listings",
  total_bookings: "Total Bookings",
  pending_verifications: "Pending Verifications",
  revenue_total: "Revenue Total",
};

export function StatsGroup({ data, filter, compact }: StatsGroupProps) {
  if (!data) return null;

  const statsToShow = filter
    ? Object.entries(data).filter(([key]) => filter.includes(key))
    : Object.entries(data);

  return (
    <div className={`${styles.statsGroup} ${compact ? styles.compact : ""}`}>
      {statsToShow.map(([key, value]) => (
        <div key={key} className={styles.statCard}>
          <div className={styles.statLabel}>
            {statLabels[key as keyof DashboardStats]}
          </div>
          <div className={styles.statValue}>
            {key === "revenue_total" ? `${value} DA` : value}
          </div>
        </div>
      ))}
    </div>
  );
}
