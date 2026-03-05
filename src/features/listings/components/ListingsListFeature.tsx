import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Loader/Loader";
import ListingDetails from "../../../components/ListingDetails/ListingDetails";
import Pagination from "../../../components/Pagination/Pagination";
import ListingsTable from "./ListingsTable";
import ListingsFilterModal from "./ListingsFilterModal";
import { IconAlertCircle } from "@tabler/icons-react";
import { useListings, useDeleteListing } from "../hooks/useListings";
import { notifications } from "../../../utils/notifications";
import type { Listing } from "../../../types/listing.types";
import type { ListingFilters } from "../hooks/useListingFilters";
import styles from "../../../pages/Listings/ListingsPage.module.css";

interface ListingsListFeatureProps {
  filters: ListingFilters;
  showFilters: boolean;
  setFilter: (key: keyof ListingFilters, value: any) => void;
  setShowFilters: (show: boolean) => void;
  clearFilters: () => void;
}

export default function ListingsListFeature({
  filters,
  showFilters,
  setFilter,
  setShowFilters,
  clearFilters,
}: ListingsListFeatureProps) {
  const { t } = useTranslation();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const { data, isLoading, error } = useListings({
    search: filters.search,
    listing_type: filters.listingType || undefined,
    approval_status: filters.approvalStatus || undefined,
    min_price: filters.minPrice || undefined,
    max_price: filters.maxPrice || undefined,
    min_guests: filters.minGuests || undefined,
    max_guests: filters.maxGuests || undefined,
    property_type: filters.propertyType || undefined,
    room_category: filters.roomCategory || undefined,
    room_type: filters.roomType || undefined,
    package_type: filters.packageType || undefined,
    ordering: filters.orderBy,
    page: filters.page,
    page_size: filters.pageSize,
  });

  const deleteListing = useDeleteListing();

  const handleDelete = (listing: Listing) => {
    if (confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      deleteListing.mutate(listing.id, {
        onSuccess: () =>
          notifications.show({
            title: "Listing deleted",
            color: "green",
            message: "Listing has been deleted successfully",
          }),
        onError: () =>
          notifications.show({
            title: "Error",
            color: "red",
            message: "Could not delete listing",
          }),
      });
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className={styles.errorContainer}>
        <IconAlertCircle size={32} /> <span>Error loading listings</span>
      </div>
    );

  const listings = data?.results || [];

  return (
    <>
      <ListingsTable
        listings={listings}
        onView={setSelectedListing}
        onDelete={handleDelete}
      />

      {data && data.count > 0 && (
        <Pagination
          currentPage={filters.page}
          totalPages={Math.ceil(data.count / filters.pageSize)}
          totalCount={data.count}
          pageSize={filters.pageSize}
          onPageChange={(page) => setFilter("page", page)}
          onPageSizeChange={(size) => setFilter("pageSize", size)}
          itemName={t("nav.listings")}
        />
      )}

      <ListingsFilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
      />

      <ListingDetails
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </>
  );
}
