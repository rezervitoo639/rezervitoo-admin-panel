import { useTranslation } from "react-i18next";
import Table from "../../../components/Table/Table";
import ActionButtons from "../../../components/ActionButtons/ActionButtons";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import type { User } from "../../../types/user.types";
import styles from "../../../pages/ValidationQueue/ValidationQueuePage.module.css";

interface ValidationQueueTableProps {
  users: User[];
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function ValidationQueueTable({
  users,
  onView,
  onDelete,
}: ValidationQueueTableProps) {
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
            label: t("validationQueue.provider"),
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
                    className="entity-title"
                    style={{ cursor: "pointer" }}
                  >
                    {getProviderName(user)}
                  </div>
                  <div className="entity-id">ID: {user.id}</div>
                </div>
              </div>
            ),
          },
          {
            key: "submitted",
            label: t("validationQueue.submittedOn"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>
                {new Date(user.updated_at).toLocaleDateString()}
              </div>
            ),
          },
          {
            key: "status",
            label: t("common.status"),
            headerClassName: styles.centerHeader,
            render: (user: User) => (
              <div className={styles.centerCell}>
                <StatusBadge status={user.verification_status} />
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
                  viewTitle={t("validationQueue.reviewApplication")}
                />
              </div>
            ),
          },
        ]}
        data={users}
        emptyMessage={t("validationQueue.noPendingApplications")}
      />
    </div>
  );
}
