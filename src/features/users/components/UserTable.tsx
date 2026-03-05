import { useTranslation } from "react-i18next";
import Table from "../../../components/Table/Table";
import ActionButtons from "../../../components/ActionButtons/ActionButtons";
import { type User } from "../../../types/user.types";
import styles from "../../../pages/Users/UserManagementPage.module.css";

interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onView, onDelete }: UserTableProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.tableContainer}>
      <Table
        columns={[
          {
            key: "user",
            label: t("common.name"),
            render: (user: User) => (
              <div className={styles.userCell}>
                <div className={styles.avatar}>
                  {user.pfp ? (
                    <img
                      src={user.pfp}
                      alt={`${user.first_name} ${user.last_name}`}
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
                    className="entity-title"
                    style={{ cursor: "pointer" }}
                  >
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="entity-id">ID: {user.id}</div>
                </div>
              </div>
            ),
          },
          {
            key: "email",
            label: t("common.email"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>{user.email}</div>
            ),
          },
          {
            key: "bookings",
            label: t("users.totalBookings"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>
                {user.total_bookings ?? 0}
              </div>
            ),
          },
          {
            key: "last_login",
            label: t("users.lastLogin"),
            headerClassName: styles.centerHeader,
            render: (user: User) => {
              if (!user.last_login)
                return (
                  <div className={styles.centerCell}>{t("common.never")}</div>
                );

              const now = new Date();
              const lastLogin = new Date(user.last_login);
              const diffMs = now.getTime() - lastLogin.getTime();
              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

              if (diffHrs < 24) {
                return (
                  <div className={styles.centerCell}>
                    {t("common.hoursAgo", { count: diffHrs })}
                  </div>
                );
              }

              const days = Math.floor(diffHrs / 24);
              return (
                <div className={styles.centerCell}>
                  {t("common.daysAgo", { count: days })}
                </div>
              );
            },
          },
          {
            key: "status",
            label: t("common.status"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>
                <span
                  className={
                    user.is_active
                      ? styles.statusVerified
                      : styles.statusRejected
                  }
                >
                  {user.is_active
                    ? t("users.statusActive")
                    : t("users.statusBanned")}
                </span>
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
                  viewTitle="View Details"
                />
              </div>
            ),
          },
        ]}
        data={users}
        emptyMessage="No users found matching your search"
      />
    </div>
  );
}
