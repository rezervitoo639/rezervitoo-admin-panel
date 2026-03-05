import { useState, useCallback } from "react";
import { useDebounce } from "../../../utils/useDebounce";

export interface ReviewFilters {
  search: string;
  reviewType: string;
  ratingFilter: string;
  page: number;
  pageSize: number;
}

export function useReviewFilters() {
  const [search, setSearch] = useState("");
  const [reviewType, setReviewType] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const debouncedSearch = useDebounce(search, 500);

  const filters: ReviewFilters = {
    search: debouncedSearch,
    reviewType,
    ratingFilter,
    page,
    pageSize,
  };

  const hasActiveFilters =
    search || reviewType !== "all" || ratingFilter !== "";

  const clearFilters = useCallback(() => {
    setSearch("");
    setReviewType("all");
    setRatingFilter("");
  }, []);

  const setFilter = useCallback((key: keyof ReviewFilters, value: any) => {
    switch (key) {
      case "search":
        setSearch(value);
        setPage(1);
        break;
      case "reviewType":
        setReviewType(value);
        setPage(1);
        break;
      case "ratingFilter":
        setRatingFilter(value);
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
    setReviewType,
    setRatingFilter,
    setPage,
    setFilter,
    hasActiveFilters,
    clearFilters,
  };
}
