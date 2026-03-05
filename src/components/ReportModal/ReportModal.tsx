import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconCheck, IconX, IconClock } from "@tabler/icons-react";
import Modal from "../Modal/Modal";
import StatusBadge from "../StatusBadge/StatusBadge";
import ProfileSection from "../ProfileSection/ProfileSection";
import UserDetails from "../UserDetails/UserDetails";
import ProviderDetails from "../ProviderDetails/ProviderDetails";
import type { Report } from "../../types/support.types";
import type { User } from "../../types/user.types";
import styles from "./ReportModal.module.css";

interface ReportModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (
    reportId: number,
    newStatus: string,
    notes?: string,
  ) => void;
}

export default function ReportModal({
  report,
  isOpen,
  onClose,
  onStatusChange,
}: ReportModalProps) {
  const { t } = useTranslation();
  const [adminNotes, setAdminNotes] = useState(report?.admin_notes || "");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<User | null>(null);

  if (!report) return null;

  const handleUpdateStatus = (status: string) => {
    if (onStatusChange) {
      onStatusChange(report.id, status, adminNotes);
    }
  };

  const handleProfileClick = (user: any, isProvider: boolean) => {
    if (isProvider) {
      setSelectedProvider(user);
    } else {
      setSelectedUser(user);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t("reports.manageReport")}
        hideOverlay={!!(selectedUser || selectedProvider)}
      >
        <div className={styles.modalContent}>
          {/* Status Badge at Top */}
          <div className={styles.statusSection}>
            <h3 className={styles.statusLabel}>{t("reports.currentStatus")}</h3>
            <StatusBadge status={report.status} />
          </div>

          {/* Reporter Section */}
          <ProfileSection
            user={report.reporter_details as any}
            onClick={() =>
              handleProfileClick(
                report.reporter_details,
                report.reporter_details.account_type === "PROVIDER",
              )
            }
            title={t("reports.reporter")}
          />

          {/* Reported User Section */}
          <ProfileSection
            user={report.reported_details as any}
            onClick={() =>
              handleProfileClick(
                report.reported_details,
                report.reported_details.account_type === "PROVIDER",
              )
            }
            title={t("reports.reportedUser")}
          />

          {/* Reason Section */}
          <div className={styles.section}>
            <h3>{t("reports.reason")}</h3>
            <p className={styles.reasonFull}>{report.reason}</p>
          </div>

          {/* Admin Notes */}
          <div className={styles.section}>
            <h3>{t("reports.adminNotes")}</h3>
            <textarea
              className={styles.textarea}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t("reports.addNotesPlaceholder")}
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
            {report.status !== "RESOLVED" && (
              <button
                onClick={() => handleUpdateStatus("RESOLVED")}
                className={styles.resolveButton}
              >
                <IconCheck size={18} />
                {t("reports.markAsResolved")}
              </button>
            )}
            {report.status !== "DISMISSED" && (
              <button
                onClick={() => handleUpdateStatus("DISMISSED")}
                className={styles.dismissButton}
              >
                <IconX size={18} />
                {t("reports.dismiss")}
              </button>
            )}
            {report.status !== "PENDING" && (
              <button
                onClick={() => handleUpdateStatus("PENDING")}
                className={styles.pendingButton}
              >
                <IconClock size={18} />
                {t("reports.setPending")}
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Detail Modals */}
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          elevatedZIndex={true}
          hideOverlay={true}
        />
      )}
      {selectedProvider && (
        <ProviderDetails
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          showActions={false}
          elevatedZIndex={true}
          hideOverlay={true}
        />
      )}
    </>
  );
}
