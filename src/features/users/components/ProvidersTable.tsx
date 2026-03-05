import { useTranslation } from "react-i18next";
import RoleBadge from "../../../components/RoleBadge/RoleBadge";
import Table from "../../../components/Table/Table";
import ActionButtons from "../../../components/ActionButtons/ActionButtons";
import type { User } from "../../../types/user.types";
import styles from "../../../pages/Providers/ProvidersPage.module.css";

interface ProvidersTableProps {
  providers: User[];
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function ProvidersTable({
  providers,
  onView,
  onDelete,
}: ProvidersTableProps) {
  const { t } = useTranslation();
  const getProviderName = (user: User) => {
    switch (user.role) {
      case "HOTEL":
        return user.hotel_name || `${user.first_name} ${user.last_name}`;
      case "HOSTEL":
        return user.hostel_name || `${user.first_name} ${user.last_name}`;
      case "AGENCY":
        return user.agency_name || `${user.first_name} ${user.last_name}`;
      case "HOST":
      default:
        return `${user.first_name} ${user.last_name}`;
    }
  };

  return (
    <div className={styles.tableContainer}>
      <Table
        columns={[
          {
            key: "provider",
            label: t("providers.provider"),
            render: (user: User) => (
              <div className={styles.providerCell}>
                <div className={styles.avatar}>
                  {user.pfp ? (
                    <img
                      src={user.pfp}
                      alt={getProviderName(user)}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <>
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </>
                  )}
                </div>
                <div>
                  <div
                    onClick={() => onView(user)}
                    className={`entity-title ${styles.clickableTitle}`}
                  >
                    {getProviderName(user)}
                  </div>
                  <div className="entity-id">ID: {user.id}</div>
                </div>
              </div>
            ),
          },
          {
            key: "role",
            label: t("providers.role"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>
                <RoleBadge role={user.role || "HOST"} size="small" />
              </div>
            ),
          },
          {
            key: "listings",
            label: t("providers.totalListings"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>
                {user.total_listings ?? 0}
              </div>
            ),
          },
          {
            key: "bookings",
            label: t("users.totalBookings"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>
                {user.provider_total_bookings ?? 0}
              </div>
            ),
          },
          {
            key: "rating",
            label: t("providers.rating"),
            headerClassName: styles.centerHeader,
            render: (user: User) => {
              const avgRating = user.rating || 0;
              return (
                <div className={`${styles.centerCell} ${styles.ratingCell}`}>
                  {avgRating > 0 ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#fbbf24"
                        stroke="#fbbf24"
                        strokeWidth="1.5"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>{avgRating.toFixed(1)}</span>
                    </>
                  ) : (
                    <span className={styles.emptyText}>{t("common.na")}</span>
                  )}
                </div>
              );
            },
          },
          {
            key: "joined",
            label: t("providers.joinDate"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            ),
          },
          {
            key: "actions",
            label: t("common.actions"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.flexCenter}>
                <ActionButtons
                  onView={() => onView(user)}
                  onDelete={() => onDelete(user)}
                  viewTitle={t("common.viewDetails")}
                />
              </div>
            ),
          },
        ]}
        data={providers}
        emptyMessage={t("providers.noProvidersFound")}
      />
    </div>
  );
}
