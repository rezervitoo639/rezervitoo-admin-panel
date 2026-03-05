import { useState, useCallback } from "react";
import { useDebounce } from "../../../utils/useDebounce";

export interface ReportFilters {
  search: string;
  status: string;
  reportType: string;
  page: number;
  pageSize: number;
}

export function useReportFilters() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [reportType, setReportType] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const debouncedSearch = useDebounce(search, 500);

  const filters: ReportFilters = {
    search: debouncedSearch,
    status,
    reportType,
    page,
    pageSize,
  };

  const hasActiveFilters = search || status !== "all" || reportType !== "";

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    setReportType("");
  }, []);

  const setFilter = useCallback((key: keyof ReportFilters, value: any) => {
    switch (key) {
      case "search":
        setSearch(value);
        setPage(1);
        break;
      case "status":
        setStatus(value);
        setPage(1);
        break;
      case "reportType":
        setReportType(value);
        setPage(1);
        break;
      case "page":
        setPage(value);
        break;
    }
  }, []);

  return {
    filters,
    search,
    setSearch,
    setStatus,
    setReportType,
    setPage,
    setFilter,
    hasActiveFilters,
    clearFilters,
  };
}
