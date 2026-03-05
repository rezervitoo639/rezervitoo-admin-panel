import { IconX, IconFlag } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import PageControls, {
  Spacer,
} from "../../components/PageControls/PageControls";
import RoleTabs from "../../components/RoleTabs/RoleTabs";
import SearchInput from "../../components/SearchInput/SearchInput";
import IconButton from "../../components/IconButton/IconButton.tsx";
import StatCard from "../../components/StatCard/StatCard";
import ReportsListFeature from "../../features/support/components/ReportsListFeature";
import { useReportFilters } from "../../features/support/hooks/useReportFilters";
import { useReports } from "../../features/support/hooks/useReports";
import styles from "./ReportsPage.module.css";

export default function ReportsPage() {
  const { t } = useTranslation();

  const reportTypeTabs = [
    { value: "", label: t("common.all") },
    { value: "provider", label: t("common.provider") },
    { value: "user", label: t("common.user") },
  ];

  const {
    filters,
    search,
    setSearch,
    setStatus,
    setReportType,
    setFilter,
    hasActiveFilters,
    clearFilters,
  } = useReportFilters();

  // Fetch total reports for KPI
  const { data: allReports } = useReports({
    reportType: filters.reportType || undefined,
  });
  const totalReports = allReports?.count || 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("reports.pageTitle")}</h1>
          <p className={styles.subtitle}>{t("reports.pageSubtitle")}</p>
        </div>
        <div className={styles.statsContainer}>
          <StatCard
            title={t("reports.totalReports")}
            value={totalReports}
            icon={IconFlag}
            color="primary"
            orientation="row"
          />
        </div>
      </div>

      <RoleTabs
        tabs={reportTypeTabs}
        activeTab={filters.reportType}
        onChange={setReportType}
      />

      <PageControls>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("reports.searchPlaceholder")}
          maxWidth="400px"
        />
        <select
          className={styles.filterSelect}
          value={filters.status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">{t("common.allStatuses")}</option>
          <option value="PENDING">{t("common.pending")}</option>
          <option value="RESOLVED">{t("common.resolved")}</option>
          <option value="DISMISSED">{t("common.dismissed")}</option>
        </select>
        <Spacer />
        <IconButton
          icon={<IconX size={20} />}
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          title={t("common.clearFilters")}
        />
      </PageControls>

      <ReportsListFeature filters={filters} setFilter={setFilter} />
    </div>
  );
}
