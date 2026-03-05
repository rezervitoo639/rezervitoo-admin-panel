import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDashboardStats } from "../../features/stats/hooks/useStats";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import StatCard from "../../components/StatCard/StatCard";
import RoleTabs, { RoleTab } from "../../components/RoleTabs/RoleTabs";
import {
  IconUsers,
  IconHome,
  IconClipboardCheck,
  IconUserCheck,
  IconListCheck,
  IconClock,
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react";
import styles from "./DashboardPage.module.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function DashboardPage() {
  const { t } = useTranslation();
  const dashboardTabs: RoleTab[] = [
    { value: "users", label: t("dashboard.tabs.users") },
    { value: "listings", label: t("dashboard.tabs.listings") },
    { value: "bookings", label: t("dashboard.tabs.bookings") },
  ];
  const { data: stats, isLoading } = useDashboardStats();
  const [activeTab, setActiveTab] = useState<"users" | "listings" | "bookings">(
    "users",
  );
  const [selectedPieSection, setSelectedPieSection] = useState<string | null>(
    null,
  );

  if (isLoading || !stats) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // --- Chart Data Helpers ---

  // Helper to format date strings 'YYYY-MM-DD' to 'Month Year'
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const currentLang = localStorage.getItem("i18nextLng") || "en";
    return date.toLocaleDateString(
      currentLang === "ar" ? "ar-DZ" : currentLang === "fr" ? "fr-FR" : "en-US",
      {
        month: "short",
        year: "numeric",
      },
    );
  };

  // Helper to normalize data across all months
  const normalizeDataByMonths = (datasets: any[], allMonths: string[]) => {
    return datasets.map((dataset) => {
      const dataMap = new Map(
        dataset.rawData.map((d: any) => [formatDate(d.month), d.count]),
      );
      return {
        ...dataset,
        data: allMonths.map((month) => dataMap.get(month) || 0),
      };
    });
  };

  // 1. Line Chart Data (Progressive Growth)
  const getLineChartData = () => {
    // Colors matching RoleBadge component
    const roleColors = {
      user: "#1971c2", // Blue
      host: "#1864ab", // Dark blue
      hotel: "#2b8a3e", // Green
      hostel: "#e67700", // Orange
      agency: "#7048e8", // Purple
      property: "#1864ab", // Dark blue (same as host)
      hotelroom: "#2b8a3e", // Green (same as hotel)
      hostelbed: "#e67700", // Orange (same as hostel)
      travelpackage: "#7048e8", // Purple (same as agency)
    };

    if (activeTab === "users") {
      // Collect all unique months
      const allMonthsSet = new Set<string>();
      const usersData = stats.graphs.users_growth;
      const providerGrowth = stats.graphs.providers_growth_by_role || {};

      usersData?.forEach((d) => allMonthsSet.add(formatDate(d.month)));
      Object.values(providerGrowth).forEach((roleData: any) => {
        roleData?.forEach((d: any) => allMonthsSet.add(formatDate(d.month)));
      });

      // Sort months chronologically (oldest to newest)
      const allMonths = Array.from(allMonthsSet).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });

      // Prepare datasets with raw data
      const rawDatasets = [];

      if (usersData && usersData.length > 0) {
        rawDatasets.push({
          label: t("common.regularUsers"),
          rawData: usersData,
          borderColor: roleColors.user,
          backgroundColor: roleColors.user,
          tension: 0.4,
        });
      }

      const roleLabels = {
        host: t("common.host"),
        hotel: t("common.hotel"),
        hostel: t("common.hostel"),
        agency: t("common.agency"),
      };

      Object.entries(providerGrowth).forEach(([role, data]: [string, any]) => {
        if (data && data.length > 0) {
          rawDatasets.push({
            label: roleLabels[role as keyof typeof roleLabels] || role,
            rawData: data,
            borderColor: roleColors[role as keyof typeof roleColors],
            backgroundColor: roleColors[role as keyof typeof roleColors],
            tension: 0.4,
          });
        }
      });

      const normalizedDatasets = normalizeDataByMonths(rawDatasets, allMonths);
      return { labels: allMonths, datasets: normalizedDatasets };
    }

    if (activeTab === "listings") {
      // Multi-line for listings by type
      const allMonthsSet = new Set<string>();
      const listingsData = stats.graphs.listings_growth;
      const listingsGrowthByType = stats.graphs.listings_growth_by_type || {};

      listingsData?.forEach((d) => allMonthsSet.add(formatDate(d.month)));
      Object.values(listingsGrowthByType).forEach((typeData: any) => {
        typeData?.forEach((d: any) => allMonthsSet.add(formatDate(d.month)));
      });

      // Sort months chronologically (oldest to newest)
      const allMonths = Array.from(allMonthsSet).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });

      const rawDatasets = [];
      const typeLabels = {
        property: t("common.property"),
        hotelroom: t("common.hotelRoom"),
        hostelbed: t("common.hostelBed"),
        travelpackage: t("common.travelPackage"),
      };

      const typeColors = {
        property: roleColors.host,
        hotelroom: roleColors.hotel,
        hostelbed: roleColors.hostel,
        travelpackage: roleColors.agency,
      };

      Object.entries(listingsGrowthByType).forEach(
        ([type, data]: [string, any]) => {
          if (data && data.length > 0) {
            rawDatasets.push({
              label: typeLabels[type as keyof typeof typeLabels] || type,
              rawData: data,
              borderColor: typeColors[type as keyof typeof typeColors],
              backgroundColor: typeColors[type as keyof typeof typeColors],
              tension: 0.4,
            });
          }
        },
      );

      const normalizedDatasets = normalizeDataByMonths(rawDatasets, allMonths);
      return { labels: allMonths, datasets: normalizedDatasets };
    }

    if (activeTab === "bookings") {
      // Multi-line for bookings by listing type
      const allMonthsSet = new Set<string>();
      const bookingsData = stats.graphs.bookings_growth;
      const bookingsGrowthByType = stats.graphs.bookings_growth_by_type || {};

      bookingsData?.forEach((d) => allMonthsSet.add(formatDate(d.month)));
      Object.values(bookingsGrowthByType).forEach((typeData: any) => {
        typeData?.forEach((d: any) => allMonthsSet.add(formatDate(d.month)));
      });

      // Sort months chronologically (oldest to newest)
      const allMonths = Array.from(allMonthsSet).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });

      const rawDatasets = [];
      const typeLabels = {
        property: t("common.property"),
        hotelroom: t("common.hotelRoom"),
        hostelbed: t("common.hostelBed"),
        travelpackage: t("common.travelPackage"),
      };

      const typeColors = {
        property: roleColors.host,
        hotelroom: roleColors.hotel,
        hostelbed: roleColors.hostel,
        travelpackage: roleColors.agency,
      };

      Object.entries(bookingsGrowthByType).forEach(
        ([type, data]: [string, any]) => {
          if (data && data.length > 0) {
            rawDatasets.push({
              label: typeLabels[type as keyof typeof typeLabels] || type,
              rawData: data,
              borderColor: typeColors[type as keyof typeof typeColors],
              backgroundColor: typeColors[type as keyof typeof typeColors],
              tension: 0.4,
            });
          }
        },
      );

      const normalizedDatasets = normalizeDataByMonths(rawDatasets, allMonths);
      return { labels: allMonths, datasets: normalizedDatasets };
    }

    return { labels: [], datasets: [] };
  };

  // 2. Pie Chart Data (Distribution) - Using RoleBadge colors
  const getPieChartData = (): ChartData<"pie"> => {
    let labels: string[] = [];
    let values: number[] = [];
    let colors: string[] = [];

    // Colors matching RoleBadge component
    const roleColors: Record<string, string> = {
      USER: "#1971c2", // Blue
      HOST: "#1864ab", // Dark blue
      HOTEL: "#2b8a3e", // Green
      HOSTEL: "#e67700", // Orange
      AGENCY: "#7048e8", // Purple
    };

    const translateKey = (key: string) => {
      const k = key.toLowerCase().trim();
      if (k === "hotelroom") return t("common.hotelRoom");
      if (k === "hostelbed") return t("common.hostelBed");
      if (k === "travelpackage") return t("common.travelPackage");
      if (k === "property") return t("common.property");
      if (k === "regular") return t("common.regular");
      return t(`common.${k}`, { defaultValue: key });
    };

    switch (activeTab) {
      case "users":
        // Show Regular Users + individual provider types
        labels = stats.distributions.users.map((d) =>
          translateKey(d.role || d.name),
        );
        values = stats.distributions.users.map((d) => d.value);
        colors = stats.distributions.users.map(
          (d) => roleColors[d.role] || "#6b7280",
        );
        break;
      case "listings":
        // Map model names to readable text
        labels = stats.distributions.listings.map((d) =>
          translateKey(
            d?.polymorphic_ctype__model
              ?.replace("listing", "")
              ?.replace("profile", "") || "Other",
          ),
        );
        values = stats.distributions.listings.map((d) => d.count);
        colors = [
          roleColors.HOST,
          roleColors.HOTEL,
          roleColors.HOSTEL,
          roleColors.AGENCY,
        ];
        break;
      case "bookings":
        labels = stats.distributions.bookings.map((d) =>
          translateKey(
            (d?.listing__polymorphic_ctype__model || "Unknown").replace(
              "listing",
              "",
            ),
          ),
        );
        values = stats.distributions.bookings.map((d) => d.count);
        colors = [
          roleColors.HOST,
          roleColors.HOTEL,
          roleColors.HOSTEL,
          roleColors.AGENCY,
        ];
        break;
    }

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    };
  };

  // Pie Chart Options (Donut style with click handler, no legend)
  const pieOptions = {
    plugins: {
      legend: { display: false }, // Hide legend
    },
    cutout: "50%", // Makes it a donut chart with smaller hole
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const data = getPieChartData();
        const label = data.labels?.[index] as string;
        setSelectedPieSection(label);
      } else {
        setSelectedPieSection(null);
      }
    },
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("dashboard.pageTitle")}</h1>

      {/* Tabs using RoleTabs component */}
      <RoleTabs
        tabs={dashboardTabs}
        activeTab={activeTab}
        onChange={(value) => {
          setActiveTab(value as "users" | "listings" | "bookings");
          setSelectedPieSection(null);
        }}
      />

      {/* KPI Stats Grid - Dynamic based on Tab */}
      <div className={styles.statsGrid}>
        {activeTab === "users" && (
          <>
            <StatCard
              title={t("dashboard.totalUsers")}
              value={stats.overview.total_users}
              icon={IconUsers}
              trend={stats.overview.users_trend || 0}
            />
            <StatCard
              title={t("dashboard.providers")}
              value={stats.overview.total_providers}
              icon={IconUserCheck}
              trend={stats.overview.providers_trend || 0}
            />
            <StatCard
              title={t("dashboard.pendingVerifications")}
              value={stats.overview.pending_verifications}
              icon={IconListCheck}
              color="warning"
            />
          </>
        )}
        {activeTab === "listings" && (
          <>
            <StatCard
              title={t("dashboard.totalListings")}
              value={stats.overview.total_listings}
              icon={IconHome}
            />
            <StatCard
              title={t("dashboard.activeListings")}
              value={stats.overview.active_listings}
              icon={IconClipboardCheck}
              color="success"
            />
            <StatCard
              title={t("dashboard.pendingApproval")}
              value={stats.overview.pending_listings}
              icon={IconAlertCircle}
              color="warning"
            />
          </>
        )}
        {activeTab === "bookings" && (
          <>
            <StatCard
              title={t("dashboard.totalBookings")}
              value={stats.overview.total_bookings}
              icon={IconClipboardCheck}
            />
            <StatCard
              title={t("dashboard.pendingBookings")}
              value={stats.overview.pending_bookings}
              icon={IconClock}
              color="warning"
            />
            <StatCard
              title={t("dashboard.completedBookings")}
              value={stats.overview.completed_bookings || 0}
              icon={IconCircleCheck}
              color="success"
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className={styles.grid}>
        {/* Line Chart: Growth */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t("dashboard.growthOverTime")}</h3>
          <div className={styles.chartContainer}>
            <Line
              data={getLineChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true, // Show legend for all charts
                    position: "top" as const,
                  },
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Pie Chart: Distribution */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t("dashboard.distribution")}</h3>
          <div className={styles.pieChartContainer}>
            <Pie data={getPieChartData()} options={pieOptions} />
          </div>
          {selectedPieSection && (
            <div className={styles.detailsOverlay}>
              <strong>Selected: {selectedPieSection}</strong>
              <p className="text-sm text-gray-500 mt-1">
                Showing details for {selectedPieSection}...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
