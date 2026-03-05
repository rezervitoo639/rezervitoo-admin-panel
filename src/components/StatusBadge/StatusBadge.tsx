import { useTranslation } from "react-i18next";
import {
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";
import styles from "./StatusBadge.module.css";

export type StatusType =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACCEPTED"
  | "CANCELLED"
  | "COMPLETED"
  | "RESOLVED"
  | "DISMISSED"
  | "VERIFIED"
  | "UNVERIFIED";

interface StatusBadgeProps {
  status: StatusType | string;
  size?: "small" | "medium" | "large";
}

export default function StatusBadge({
  status,
  size = "medium",
}: StatusBadgeProps) {
  const { t } = useTranslation();

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { label: string; icon?: JSX.Element; className: string }
    > = {
      PENDING: {
        label: t("common.pending"),
        icon: <IconClock size={14} />,
        className: styles.pending,
      },
      APPROVED: {
        label: t("listings.approved"),
        icon: <IconCheck size={14} />,
        className: styles.approved,
      },
      ACCEPTED: {
        label: t("common.accepted"),
        icon: <IconCheck size={14} />,
        className: styles.approved,
      },
      REJECTED: {
        label: t("common.rejected"),
        icon: <IconX size={14} />,
        className: styles.rejected,
      },
      CANCELLED: {
        label: t("common.cancelled"),
        icon: <IconX size={14} />,
        className: styles.cancelled,
      },
      COMPLETED: {
        label: t("common.completed"),
        icon: <IconCheck size={14} />,
        className: styles.completed,
      },
      RESOLVED: {
        label: t("common.resolved"),
        icon: <IconCheck size={14} />,
        className: styles.resolved,
      },
      DISMISSED: {
        label: t("common.dismissed"),
        icon: <IconX size={14} />,
        className: styles.dismissed,
      },
      VERIFIED: {
        label: t("common.verified"),
        icon: <IconCheck size={14} />,
        className: styles.verified,
      },
      UNVERIFIED: {
        label: t("common.unverified"),
        icon: <IconAlertCircle size={14} />,
        className: styles.unverified,
      },
      ACTIVE: {
        label: t("common.active"),
        icon: <IconCheck size={14} />,
        className: styles.approved,
      },
      BLOCKED: {
        label: t("common.blocked"),
        icon: <IconX size={14} />,
        className: styles.rejected,
      },
    };

    if (!status) {
      return {
        label: t("common.na"),
        className: styles.default,
      };
    }

    return (
      configs[status.toUpperCase()] || {
        label: status,
        className: styles.default,
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <span className={`${styles.badge} ${config.className} ${styles[size]}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
