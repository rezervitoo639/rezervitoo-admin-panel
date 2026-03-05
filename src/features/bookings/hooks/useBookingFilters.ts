import { useState, useCallback } from "react";
import { useDebounce } from "../../../utils/useDebounce";

export interface BookingFilters {
  search: string;
  status: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  startDateFrom: string;
  startDateTo: string;
  page: number;
  pageSize: number;
}

export function useBookingFilters() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [listingType, setListingType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const filters: BookingFilters = {
    search: debouncedSearch,
    status,
    listingType,
    minPrice,
    maxPrice,
    startDateFrom,
    startDateTo,
    page,
    pageSize,
  };

  const hasActiveFilters = minPrice || maxPrice || startDateFrom || startDateTo;

  const clearFilters = useCallback(() => {
    setMinPrice("");
    setMaxPrice("");
    setStartDateFrom("");
    setStartDateTo("");
    setListingType("");
  }, []);

  const setFilter = useCallback((key: keyof BookingFilters, value: any) => {
    switch (key) {
      case "search":
        setSearch(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "listingType":
        setListingType(value);
        break;
      case "minPrice":
        setMinPrice(value);
        break;
      case "maxPrice":
        setMaxPrice(value);
        break;
      case "startDateFrom":
        setStartDateFrom(value);
        break;
      case "startDateTo":
        setStartDateTo(value);
        break;
      case "page":
        setPage(value);
        break;
      case "pageSize":
        setPageSize(value);
        break;
    }
  }, []);

  return {
    filters,
    debouncedSearch,
    search,
    showFilters,
    hasActiveFilters,
    status,
    setSearch,
    setStatus,
    setPage,
    setPageSize,
    setShowFilters,
    setFilter,
    clearFilters,
  };
}
