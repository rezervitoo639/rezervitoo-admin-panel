import { useState } from "react";
import type {
  NotificationFilterType,
  NotificationReadFilter,
} from "../notification.utils";

/**
 * Hook for managing notification filter state
 */
export function useNotificationFilters() {
  const [typeFilter, setTypeFilter] = useState<NotificationFilterType>("all");
  const [readFilter, setReadFilter] = useState<NotificationReadFilter>("all");

  const resetFilters = () => {
    setTypeFilter("all");
    setReadFilter("all");
  };

  return {
    typeFilter,
    readFilter,
    setTypeFilter,
    setReadFilter,
    resetFilters,
  };
}
