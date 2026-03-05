import { IconClock } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../utils/useDebounce";
import { useValidationFilters } from "../../features/users/hooks/useValidationFilters";
import { useUsers } from "../../features/users/hooks/useUsers";
import StatCard from "../../components/StatCard/StatCard.tsx";
import RoleTabs from "../../components/RoleTabs/RoleTabs.tsx";
import PageControls from "../../components/PageControls/PageControls.tsx";
import SearchInput from "../../components/SearchInput/SearchInput.tsx";
import ValidationQueueListFeature from "../../features/users/components/ValidationQueueListFeature.tsx";
import styles from "./ValidationQueuePage.module.css";

export default function ValidationQueuePage() {
  const { t } = useTranslation();

  const roleTabs = [
    { value: "", label: t("common.all") },
    { value: "HOST", label: t("common.host") },
    { value: "HOTEL", label: t("common.hotel") },
    { value: "HOSTEL", label: t("common.hostel") },
    { value: "AGENCY", label: t("common.agency") },
  ];

  const { filters, setFilter } = useValidationFilters();
  const debouncedSearch = useDebounce(filters.search, 500);

  const { data } = useUsers({
    search: debouncedSearch,
    account_type: "PROVIDER",
    role: (filters.role as any) || undefined,
    verification_status: undefined,
  });

  // Filter to show only PENDING and UNVERIFIED for stat card
  const pendingUsers =
    data?.results.filter(
      (user) =>
        user.verification_status === "PENDING" ||
        user.verification_status === "UNVERIFIED",
    ) || [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("validationQueue.pageTitle")}</h1>
          <p className={styles.subtitle}>{t("validationQueue.pageSubtitle")}</p>
        </div>
        <div className={styles.stats}>
          <StatCard
            title={t("validationQueue.pendingReview")}
            value={pendingUsers.length}
            icon={IconClock}
            color="warning"
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
          placeholder={t("validationQueue.searchPlaceholder")}
          maxWidth="400px"
        />
      </PageControls>

      <ValidationQueueListFeature
        filters={{ ...filters, search: debouncedSearch }}
      />
    </div>
  );
}
