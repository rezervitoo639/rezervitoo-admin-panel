import { useTranslation } from "react-i18next";
import Table from "../../../components/Table/Table";
import ActionButtons from "../../../components/ActionButtons/ActionButtons";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import type { Report } from "../../../types/support.types";
import styles from "../../../pages/Reports/ReportsPage.module.css";

interface ReportsTableProps {
  reports: Report[];
  onView: (report: Report) => void;
  onDelete: (report: Report) => void;
}

export default function ReportsTable({
  reports,
  onView,
  onDelete,
}: ReportsTableProps) {
  const { t } = useTranslation();

  return (
    <Table
      columns={[
        {
          key: "id",
          label: t("reports.id"),
          render: (report: Report) => `#${report.id}`,
        },
        {
          key: "reporter",
          label: t("reports.reporter"),
          render: (report: Report) => (
            <div>
              <div className="entity-title">
                {report.reporter_details.first_name}{" "}
                {report.reporter_details.last_name}
              </div>
              <div className="entity-id">ID: {report.reporter}</div>
            </div>
          ),
        },
        {
          key: "reported",
          label: t("reports.reported"),
          render: (report: Report) => (
            <div>
              <div className="entity-title">
                {report.reported_details.first_name}{" "}
                {report.reported_details.last_name}
              </div>
              <div className="entity-id">ID: {report.reported}</div>
            </div>
          ),
        },
        {
          key: "reason",
          label: t("reports.reason"),
          render: (report: Report) => (
            <div title={report.reason}>
              {report.reason.length > 30
                ? `${report.reason.substring(0, 30)}...`
                : report.reason}
            </div>
          ),
        },
        {
          key: "filed_on",
          label: t("reports.filedOn"),
          headerClassName: styles.centerHeader,
          render: (report: Report) => (
            <div className={styles.centerCell}>
              {new Date(report.created_at).toLocaleDateString()}
            </div>
          ),
        },
        {
          key: "status",
          label: t("common.status"),
          headerClassName: styles.centerHeader,
          render: (report: Report) => (
            <div className={styles.centerCell}>
              <StatusBadge status={report.status} />
            </div>
          ),
        },
        {
          key: "actions",
          label: t("common.actions"),
          headerClassName: styles.centerHeader,
          render: (report: Report) => (
            <div className={styles.centerCell}>
              <ActionButtons
                onView={() => onView(report)}
                onDelete={() => onDelete(report)}
              />
            </div>
          ),
        },
      ]}
      data={reports}
      emptyMessage={t("reports.noReportsFound")}
    />
  );
}
