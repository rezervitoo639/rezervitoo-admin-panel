import { useState, useCallback } from "react";
import { useDebounce } from "../../../utils/useDebounce";

export interface ListingFilters {
  search: string;
  listingType: string;
  approvalStatus: string;
  minPrice: string;
  maxPrice: string;
  minGuests: string;
  maxGuests: string;
  propertyType: string;
  roomCategory: string;
  roomType: string;
  packageType: string;
  orderBy: string;
  page: number;
  pageSize: number;
}

export function useListingFilters() {
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minGuests, setMinGuests] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [roomCategory, setRoomCategory] = useState("");
  const [roomType, setRoomType] = useState("");
  const [packageType, setPackageType] = useState("");
  const [orderBy, setOrderBy] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const filters: ListingFilters = {
    search: debouncedSearch,
    listingType,
    approvalStatus,
    minPrice,
    maxPrice,
    minGuests,
    maxGuests,
    propertyType,
    roomCategory,
    roomType,
    packageType,
    orderBy,
    page,
    pageSize,
  };

  const hasActiveFilters =
    minPrice ||
    maxPrice ||
    minGuests ||
    maxGuests ||
    propertyType ||
    roomCategory ||
    roomType ||
    packageType;

  const clearFilters = useCallback(() => {
    setMinPrice("");
    setMaxPrice("");
    setMinGuests("");
    setMaxGuests("");
    setPropertyType("");
    setRoomCategory("");
    setRoomType("");
    setPackageType("");
  }, []);

  const setFilter = useCallback((key: keyof ListingFilters, value: any) => {
    switch (key) {
      case "search":
        setSearch(value);
        break;
      case "listingType":
        setListingType(value);
        break;
      case "approvalStatus":
        setApprovalStatus(value);
        break;
      case "minPrice":
        setMinPrice(value);
        break;
      case "maxPrice":
        setMaxPrice(value);
        break;
      case "minGuests":
        setMinGuests(value);
        break;
      case "maxGuests":
        setMaxGuests(value);
        break;
      case "propertyType":
        setPropertyType(value);
        break;
      case "roomCategory":
        setRoomCategory(value);
        break;
      case "roomType":
        setRoomType(value);
        break;
      case "packageType":
        setPackageType(value);
        break;
      case "orderBy":
        setOrderBy(value);
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
    setSearch,
    setListingType,
    setApprovalStatus,
    setOrderBy,
    setPage,
    setPageSize,
    setShowFilters,
    setFilter,
    clearFilters,
  };
}
