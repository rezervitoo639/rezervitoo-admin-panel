import { IconHome, IconStar, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../utils/useDebounce.ts";
import { useDashboardStats } from "../../features/stats/hooks/useStats";
import { useProviderFilters } from "../../features/users/hooks/useProviderFilters";
import StatCard from "../../components/StatCard/StatCard.tsx";
import RoleTabs from "../../components/RoleTabs/RoleTabs";
import PageControls, {
  Spacer,
} from "../../components/PageControls/PageControls.tsx";
import SearchInput from "../../components/SearchInput/SearchInput.tsx";
import CircleButton from "../../components/CircleButton/CircleButton.tsx";
import IconButton from "../../components/IconButton/IconButton.tsx";
import ProvidersListFeature from "../../features/users/components/ProvidersListFeature.tsx";
import styles from "./ProvidersPage.module.css";

export default function ProvidersPage() {
  const { t } = useTranslation();

  const roleTabs = [
    { value: "", label: t("common.all") },
    { value: "HOST", label: t("common.host") },
    { value: "HOTEL", label: t("common.hotel") },
    { value: "HOSTEL", label: t("common.hostel") },
    { value: "AGENCY", label: t("common.agency") },
  ];

  const { filters, setFilter, hasActiveFilters, clearFilters } =
    useProviderFilters();
  const debouncedSearch = useDebounce(filters.search, 500);

  const { data: stats } = useDashboardStats();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("providers.pageTitle")}</h1>
          <p className={styles.subtitle}>{t("providers.pageSubtitle")}</p>
        </div>
        <div className={styles.statsContainer}>
          <StatCard
            title={t("providers.totalProviders")}
            value={stats?.overview?.total_providers || 0}
            icon={IconHome}
            color="primary"
            orientation="row"
          />
        </div>
      </div>

      <RoleTabs
        tabs={roleTabs}
        activeTab={filters.role}
        onChange={(role) => setFilter("role", role)}
      />

      <PageControls>
        <SearchInput
          value={filters.search}
          onChange={(search) => setFilter("search", search)}
          placeholder={t("providers.searchPlaceholder")}
          maxWidth="400px"
        />
        <CircleButton
          icon={<IconStar size={20} />}
          onClick={() =>
            setFilter(
              "ordering",
              filters.ordering === "-average_rating"
                ? undefined
                : "-average_rating",
            )
          }
          active={filters.ordering === "-average_rating"}
          iconColor="#ffd700"
          title={t("common.highestAvgRating")}
        />
        <select
          className={styles.filterSelect}
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="UNVERIFIED">Unverified</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <Spacer />
        <IconButton
          icon={<IconX size={20} />}
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          title={t("common.clearFilters")}
        />
      </PageControls>

      <ProvidersListFeature
        filters={{ ...filters, search: debouncedSearch }}
        setFilter={setFilter}
      />
    </div>
  );
}
