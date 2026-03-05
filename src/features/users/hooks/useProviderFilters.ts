import { useState } from "react";

export interface ProviderFilters {
  search: string;
  role: string;
  status: string;
  ordering?: string;
  page: number;
  pageSize: number;
}

export function useProviderFilters() {
  const [filters, setFilters] = useState<ProviderFilters>({
    search: "",
    role: "",
    status: "",
    ordering: undefined,
    page: 1,
    pageSize: 25,
  });

  const setFilter = <K extends keyof ProviderFilters>(
    key: K,
    value: ProviderFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when changing filters (except page and pageSize)
      ...(key !== "page" && key !== "pageSize" ? { page: 1 } : {}),
    }));
  };

  const hasActiveFilters =
    filters.search || filters.role || filters.status || filters.ordering;

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      role: "",
      status: "",
      ordering: undefined,
      page: 1,
    }));
  };

  return { filters, setFilter, hasActiveFilters, clearFilters };
}
