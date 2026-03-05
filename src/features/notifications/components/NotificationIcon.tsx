import type { Notification } from "../../../types/support.types";
import {
  IconUserPlus,
  IconHome,
  IconCalendar,
  IconFlag,
  IconStarFilled,
  IconBell,
} from "@tabler/icons-react";

interface NotificationIconProps {
  type: string;
  size?: number;
}

export default function NotificationIcon({
  type,
  size = 20,
}: NotificationIconProps) {
  const iconMap: Record<string, JSX.Element> = {
    new_user: <IconUserPlus size={size} />,
    new_listing: <IconHome size={size} />,
    new_booking: <IconCalendar size={size} />,
    new_report: <IconFlag size={size} />,
    new_review: <IconStarFilled size={size} />,
  };

  return iconMap[type] || <IconBell size={size} />;
}
