import { IconUser, IconStar, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../utils/useDebounce.ts";
import { useDashboardStats } from "../../features/stats/hooks/useStats.ts";
import { useUserFilters } from "../../features/users/hooks/useUserFilters";
import StatCard from "../../components/StatCard/StatCard.tsx";
import PageControls, {
  Spacer,
} from "../../components/PageControls/PageControls.tsx";
import SearchInput from "../../components/SearchInput/SearchInput.tsx";
import CircleButton from "../../components/CircleButton/CircleButton.tsx";
import IconButton from "../../components/IconButton/IconButton.tsx";
import UsersListFeature from "../../features/users/components/UsersListFeature.tsx";
import styles from "./UserManagementPage.module.css";

export default function UserManagementPage() {
  const { t } = useTranslation();
  const { filters, setFilter } = useUserFilters();
  const debouncedSearch = useDebounce(filters.search, 500);

  const { data: stats } = useDashboardStats();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("users.pageTitle")}</h1>
          <p className={styles.subtitle}>{t("users.pageSubtitle")}</p>
        </div>
        <div className={styles.statsContainer}>
          <StatCard
            title={t("users.customers")}
            value={stats?.overview?.regular_users || 0}
            icon={IconUser}
            color="primary"
            orientation="row"
          />
        </div>
      </div>

      <PageControls>
        <SearchInput
          value={filters.search}
          onChange={(search) => setFilter("search", search)}
          placeholder={t("users.searchPlaceholder")}
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
          title={t("users.highestAvgRating")}
        />
        <Spacer />
        <IconButton
          icon={<IconX size={20} />}
          onClick={() => {
            setFilter("search", "");
            setFilter("ordering", undefined);
          }}
          disabled={!filters.search && !filters.ordering}
          title="Clear Filters"
        />
      </PageControls>

      <UsersListFeature
        search={debouncedSearch}
        ordering={filters.ordering}
        page={filters.page}
        pageSize={filters.pageSize}
        onPageChange={(page) => setFilter("page", page)}
        onPageSizeChange={(size) => setFilter("pageSize", size)}
      />
    </div>
  );
}
