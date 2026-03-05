import { IconUser } from "@tabler/icons-react";
import type { User } from "../../types/user.types";
import RoleBadge from "../RoleBadge/RoleBadge";
import styles from "./ProfileSection.module.css";

interface ProfileSectionProps {
  user: User;
  onClick?: () => void;
  title?: string;
  subtitle?: string;
}

export default function ProfileSection({
  user,
  onClick,
  title,
  subtitle,
}: ProfileSectionProps) {
  const getDisplayName = () => {
    if (user.account_type === "PROVIDER") {
      switch (user.role) {
        case "HOTEL":
          return user.hotel_name || `${user.first_name} ${user.last_name}`;
        case "HOSTEL":
          return user.hostel_name || `${user.first_name} ${user.last_name}`;
        case "AGENCY":
          return user.agency_name || `${user.first_name} ${user.last_name}`;
        default:
          return `${user.first_name} ${user.last_name}`;
      }
    }
    return `${user.first_name} ${user.last_name}`;
  };

  return (
    <div
      className={`${styles.profileSection} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
    >
      {title && (
        <div className={styles.header}>
          <IconUser size={20} />
          <h3>{title}</h3>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.avatar}>
          {user.pfp ? (
            <img src={user.pfp} alt={getDisplayName()} />
          ) : (
            <span className={styles.initials}>
              {user.first_name[0]}
              {user.last_name[0]}
            </span>
          )}
        </div>
        <div className={styles.info}>
          <h4 className={styles.name}>{getDisplayName()}</h4>
          <p className={styles.email}>{user.email}</p>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.badgeContainer}>
          {user.account_type === "PROVIDER" && user.role ? (
            <RoleBadge role={user.role} size="small" />
          ) : (
            <RoleBadge role="USER" size="small" />
          )}
        </div>
      </div>
    </div>
  );
}
