import { useState } from "react";

export interface UserFilters {
  search: string;
  ordering?: string;
  page: number;
  pageSize: number;
}

export function useUserFilters() {
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    ordering: undefined,
    page: 1,
    pageSize: 25,
  });

  const setFilter = <K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when changing search
      ...(key === "search" ? { page: 1 } : {}),
    }));
  };

  return { filters, setFilter };
}
