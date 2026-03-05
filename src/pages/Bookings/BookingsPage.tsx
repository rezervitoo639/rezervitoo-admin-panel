import { IconReceipt, IconClock, IconFilter, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDashboardStats } from "../../features/stats/hooks/useStats.ts";
import { useBookingFilters } from "../../features/bookings/hooks/useBookingFilters.ts";
import StatCard from "../../components/StatCard/StatCard.tsx";
import RoleTabs from "../../components/RoleTabs/RoleTabs.tsx";
import PageControls, {
  Spacer,
} from "../../components/PageControls/PageControls.tsx";
import SearchInput from "../../components/SearchInput/SearchInput.tsx";
import IconButton from "../../components/IconButton/IconButton.tsx";
import BookingsListFeature from "../../features/bookings/components/BookingsListFeature.tsx";
import styles from "./BookingsPage.module.css";

export default function BookingsPage() {
  const { t } = useTranslation();

  const bookingTypeTabs = [
    { value: "", label: t("common.all") },
    { value: "PROPERTY", label: t("common.property") },
    { value: "HOTEL_ROOM", label: t("common.hotelRoom") },
    { value: "HOSTEL_BED", label: t("common.hostelBed") },
    { value: "TRAVEL_PACKAGE", label: t("common.travelPackage") },
  ];

  const {
    filters,
    search,
    showFilters,
    hasActiveFilters,
    status,
    setSearch,
    setStatus,
    setShowFilters,
    setFilter,
    clearFilters,
  } = useBookingFilters();

  const { data: stats } = useDashboardStats();

  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      PENDING: styles.statusPending,
      ACCEPTED: styles.statusAccepted,
      REJECTED: styles.statusRejected,
      CANCELLED: styles.statusCancelled,
      COMPLETED: styles.statusCompleted,
    };
    return statusClasses[status] || styles.statusDefault;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("bookings.pageTitle")}</h1>
          <p className={styles.subtitle}>{t("bookings.pageSubtitle")}</p>
        </div>
        <div className={styles.statsContainer}>
          <StatCard
            title={t("bookings.totalBookings")}
            value={stats?.overview?.total_bookings || 0}
            icon={IconReceipt}
            color="primary"
            orientation="row"
          />
          <StatCard
            title={t("bookings.pendingApproval")}
            value={stats?.overview?.pending_bookings || 0}
            icon={IconClock}
            color="warning"
            orientation="row"
          />
        </div>
      </div>

      <RoleTabs
        tabs={bookingTypeTabs}
        activeTab={filters.listingType}
        onChange={(value) => setFilter("listingType", value)}
      />

      <PageControls>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("bookings.searchPlaceholder")}
          maxWidth="400px"
        />
        <select
          className={styles.filterSelect}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">{t("common.allStatuses")}</option>
          <option value="PENDING">{t("common.pending")}</option>
          <option value="ACCEPTED">{t("common.accepted")}</option>
          <option value="REJECTED">{t("common.rejected")}</option>
          <option value="CANCELLED">{t("common.cancelled")}</option>
          <option value="COMPLETED">{t("common.completed")}</option>
        </select>
        <Spacer />
        <IconButton
          icon={<IconFilter size={20} />}
          onClick={() => setShowFilters(true)}
          active={!!hasActiveFilters}
          title="More Filters"
        />
        <IconButton
          icon={<IconX size={20} />}
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          title="Clear Filters"
        />
      </PageControls>

      <BookingsListFeature
        filters={filters}
        showFilters={showFilters}
        setFilter={setFilter}
        setShowFilters={setShowFilters}
        clearFilters={clearFilters}
        getStatusClass={getStatusClass}
      />
    </div>
  );
}
