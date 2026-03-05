import {
  IconList,
  IconCircleCheck,
  IconHeart,
  IconFlame,
  IconStar,
  IconFilter,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDashboardStats } from "../../features/stats/hooks/useStats.ts";
import { useListingFilters } from "../../features/listings/hooks/useListingFilters.ts";
import StatCard from "../../components/StatCard/StatCard.tsx";
import RoleTabs from "../../components/RoleTabs/RoleTabs.tsx";
import PageControls, {
  Spacer,
} from "../../components/PageControls/PageControls.tsx";
import SearchInput from "../../components/SearchInput/SearchInput.tsx";
import CircleButton from "../../components/CircleButton/CircleButton.tsx";
import IconButton from "../../components/IconButton/IconButton.tsx";
import ListingsListFeature from "../../features/listings/components/ListingsListFeature.tsx";
import styles from "./ListingsPage.module.css";

export default function ListingsPage() {
  const { t } = useTranslation();

  const listingTypeTabs = [
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
    setSearch,
    setListingType,
    setApprovalStatus,
    setOrderBy,
    setShowFilters,
    setFilter,
    clearFilters,
  } = useListingFilters();

  const { data: stats } = useDashboardStats();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("listings.pageTitle")}</h1>
          <p className={styles.subtitle}>{t("listings.pageSubtitle")}</p>
        </div>
        <div className={styles.statsContainer}>
          <StatCard
            title={t("listings.totalListings")}
            value={stats?.overview?.total_listings || 0}
            icon={IconList}
            color="primary"
            orientation="row"
          />
          <StatCard
            title={t("listings.activeListings")}
            value={stats?.overview?.active_listings || 0}
            icon={IconCircleCheck}
            color="success"
            orientation="row"
          />
        </div>
      </div>

      <RoleTabs
        tabs={listingTypeTabs}
        activeTab={filters.listingType}
        onChange={(value) => setListingType(value)}
      />

      <PageControls>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by title, location, type, amenities..."
          maxWidth="400px"
        />
        <CircleButton
          icon={<IconHeart size={20} />}
          onClick={() =>
            setOrderBy(
              filters.orderBy === "-wishlist_count"
                ? "-created_at"
                : "-wishlist_count",
            )
          }
          active={filters.orderBy === "-wishlist_count"}
          iconColor="#fa5252"
          title={t("listings.mostWishlisted")}
        />
        <CircleButton
          icon={<IconFlame size={20} />}
          onClick={() =>
            setOrderBy(
              filters.orderBy === "-bookings_count"
                ? "-created_at"
                : "-bookings_count",
            )
          }
          active={filters.orderBy === "-bookings_count"}
          iconColor="#fd7e14"
          title={t("listings.mostBooked")}
        />
        <CircleButton
          icon={<IconStar size={20} />}
          onClick={() =>
            setOrderBy(
              filters.orderBy === "-average_rating"
                ? "-created_at"
                : "-average_rating",
            )
          }
          active={filters.orderBy === "-average_rating"}
          iconColor="#ffd700"
          title={t("listings.topRated")}
        />
        <select
          className={styles.filterSelect}
          value={filters.approvalStatus}
          onChange={(e) => setApprovalStatus(e.target.value)}
        >
          <option value="">{t("common.allStatuses")}</option>
          <option value="APPROVED">{t("listings.approved")}</option>
          <option value="PENDING">{t("common.pending")}</option>
          <option value="REJECTED">{t("common.rejected")}</option>
        </select>
        <select
          className={styles.filterSelect}
          value={filters.orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="-created_at">{t("listings.newestFirst")}</option>
          <option value="created_at">{t("listings.oldestFirst")}</option>
          <option value="-price">{t("listings.highestPrice")}</option>
          <option value="price">{t("listings.lowestPrice")}</option>
          <option value="title">{t("listings.titleAZ")}</option>
          <option value="-title">{t("listings.titleZA")}</option>
        </select>
        <Spacer />
        <IconButton
          icon={<IconFilter size={20} />}
          onClick={() => setShowFilters(true)}
          active={!!hasActiveFilters}
          iconColor="#228be6"
          title={t("common.moreFilters")}
        />
        <IconButton
          icon={<IconX size={20} />}
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          title={t("common.clearFilters")}
        />
      </PageControls>

      <ListingsListFeature
        filters={filters}
        showFilters={showFilters}
        setFilter={setFilter}
        setShowFilters={setShowFilters}
        clearFilters={clearFilters}
      />
    </div>
  );
}
