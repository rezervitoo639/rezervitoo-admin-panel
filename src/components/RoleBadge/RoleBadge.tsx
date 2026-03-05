import {
  IconUser,
  IconShieldLock,
  IconHome,
  IconBuildingSkyscraper,
  IconBed,
  IconPlane,
} from "@tabler/icons-react";
import styles from "./RoleBadge.module.css";

export type RoleType =
  | "USER"
  | "ADMIN"
  | "HOST"
  | "HOTEL"
  | "HOSTEL"
  | "AGENCY"
  | "PROPERTY"
  | "HOTEL_ROOM"
  | "HOSTEL_BED"
  | "TRAVEL_PACKAGE";

interface RoleBadgeProps {
  role: RoleType | string;
  size?: "small" | "medium";
}

export default function RoleBadge({ role, size = "medium" }: RoleBadgeProps) {
  const getRoleConfig = (role: string) => {
    const configs: Record<
      string,
      { icon: React.ReactNode; className: string; title: string }
    > = {
      // Roles
      USER: {
        icon: <IconUser size={16} />,
        className: styles.user,
        title: "User",
      },
      // PROVIDER: {
      //   icon: <IconBuildingStore size={16} />,
      //   className: styles.provider,
      //   title: "Provider",
      // },
      ADMIN: {
        icon: <IconShieldLock size={16} />,
        className: styles.admin,
        title: "Admin",
      },
      HOST: {
        icon: <IconHome size={16} />,
        className: styles.host,
        title: "Host",
      },
      HOTEL: {
        icon: <IconBuildingSkyscraper size={16} />,
        className: styles.hotel,
        title: "Hotel",
      },
      HOSTEL: {
        icon: <IconBed size={16} />,
        className: styles.hostel,
        title: "Hostel",
      },
      AGENCY: {
        icon: <IconPlane size={16} />,
        className: styles.agency,
        title: "Agency",
      },

      // Listing Types (Mapped to same styles/icons)
      PROPERTY: {
        icon: <IconHome size={16} />,
        className: styles.host,
        title: "Property",
      },
      HOTEL_ROOM: {
        icon: <IconBuildingSkyscraper size={16} />,
        className: styles.hotel,
        title: "Hotel Room",
      },
      HOSTEL_BED: {
        icon: <IconBed size={16} />,
        className: styles.hostel,
        title: "Hostel Bed",
      },
      TRAVEL_PACKAGE: {
        icon: <IconPlane size={16} />,
        className: styles.agency,
        title: "Travel Package",
      },
    };

    return (
      configs[role.toUpperCase()] || {
        icon: <IconUser size={16} />,
        className: styles.default,
        title: role,
      }
    );
  };

  const config = getRoleConfig(role);

  return (
    <span
      className={`${styles.badge} ${config.className} ${styles[size]} ${styles.iconBadge}`}
      title={config.title}
    >
      {config.icon}
    </span>
  );
}
