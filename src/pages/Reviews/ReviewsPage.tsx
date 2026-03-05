import { IconX, IconStarFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import PageControls, {
  Spacer,
} from "../../components/PageControls/PageControls";
import RoleTabs from "../../components/RoleTabs/RoleTabs";
import SearchInput from "../../components/SearchInput/SearchInput";
import IconButton from "../../components/IconButton/IconButton";
import StatCard from "../../components/StatCard/StatCard";
import ReviewsListFeature from "../../features/support/components/ReviewsListFeature";
import { useReviewFilters } from "../../features/support/hooks/useReviewFilters";
import { useReviews } from "../../features/support/hooks/useReviews";
import styles from "./ReviewsPage.module.css";

export default function ReviewsPage() {
  const { t } = useTranslation();

  const roleTabs = [
    { value: "all", label: t("common.all") },
    { value: "USER_TO_LISTING", label: t("common.user") },
    { value: "PROVIDER_TO_USER", label: t("common.provider") },
  ];

  const {
    filters,
    search,
    setSearch,
    setReviewType,
    setRatingFilter,
    setFilter,
    hasActiveFilters,
    clearFilters,
  } = useReviewFilters();

  // Fetch total count for KPI
  const { data: allReviews } = useReviews({
    review_type: filters.reviewType === "all" ? undefined : filters.reviewType,
  });
  const totalReviews = allReviews?.count || 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("reviews.pageTitle")}</h1>
          <p className={styles.subtitle}>{t("reviews.pageSubtitle")}</p>
        </div>
        <div className={styles.statsContainer}>
          <StatCard
            title={t("reviews.totalReviews")}
            value={totalReviews}
            icon={IconStarFilled}
            color="primary"
            orientation="row"
          />
        </div>
      </div>

      <RoleTabs
        tabs={roleTabs}
        activeTab={filters.reviewType}
        onChange={setReviewType}
      />

      <PageControls>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("reviews.searchPlaceholder")}
          maxWidth="400px"
        />
        <select
          value={filters.ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">{t("common.allRatings")}</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        <Spacer />
        <IconButton
          icon={<IconX size={20} />}
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          title={t("common.clearFilters")}
        />
      </PageControls>

      <ReviewsListFeature filters={filters} setFilter={setFilter} />
    </div>
  );
}
