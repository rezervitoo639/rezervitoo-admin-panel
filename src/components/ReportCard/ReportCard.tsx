import { useTranslation } from "react-i18next";
import type { Report } from "../../types/support.types";
import styles from "./ReportCard.module.css";

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

export default function ReportCard({ report, onClick }: ReportCardProps) {
  const { t } = useTranslation();
  const getStatusClass = () => {
    const statusMap: Record<string, string> = {
      PENDING: styles.statusPending,
      RESOLVED: styles.statusResolved,
      DISMISSED: styles.statusDismissed,
    };
    return statusMap[report.status] || styles.statusPending;
  };

  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <span className={styles.id}>
          {t("reports.id")} #{report.id}
        </span>
        <span className={`${styles.status} ${getStatusClass()}`}>
          {report.status}
        </span>
      </div>
      <div className={styles.content}>
        <p className={styles.reason}>{report.reason}</p>
        <div className={styles.footer}>
          <span className={styles.reporter}>
            {t("reviews.by")} {report.reporter_details.first_name}{" "}
            {report.reporter_details.last_name}
          </span>
          <span className={styles.date}>
            {new Date(report.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
