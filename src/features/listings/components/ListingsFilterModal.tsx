import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/Modal/Modal";
import type { ListingFilters } from "../hooks/useListingFilters";
import styles from "../../../pages/Listings/ListingsPage.module.css";

interface ListingsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ListingFilters;
  setFilter: (key: keyof ListingFilters, value: any) => void;
  clearFilters: () => void;
}

export default function ListingsFilterModal({
  isOpen,
  onClose,
  filters,
  setFilter,
  clearFilters,
}: ListingsFilterModalProps) {
  const { t } = useTranslation();
  const [localPropertyType, setLocalPropertyType] = useState(
    filters.propertyType,
  );
  const [localRoomCategory, setLocalRoomCategory] = useState(
    filters.roomCategory,
  );
  const [localRoomType, setLocalRoomType] = useState(filters.roomType);
  const [localPackageType, setLocalPackageType] = useState(filters.packageType);
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const [localMinGuests, setLocalMinGuests] = useState(filters.minGuests);
  const [localMaxGuests, setLocalMaxGuests] = useState(filters.maxGuests);

  useEffect(() => {
    setLocalPropertyType(filters.propertyType);
    setLocalRoomCategory(filters.roomCategory);
    setLocalRoomType(filters.roomType);
    setLocalPackageType(filters.packageType);
    setLocalMinPrice(filters.minPrice);
    setLocalMaxPrice(filters.maxPrice);
    setLocalMinGuests(filters.minGuests);
    setLocalMaxGuests(filters.maxGuests);
  }, [filters]);

  const handleApply = () => {
    setFilter("propertyType", localPropertyType);
    setFilter("roomCategory", localRoomCategory);
    setFilter("roomType", localRoomType);
    setFilter("packageType", localPackageType);
    setFilter("minPrice", localMinPrice);
    setFilter("maxPrice", localMaxPrice);
    setFilter("minGuests", localMinGuests);
    setFilter("maxGuests", localMaxGuests);
    onClose();
  };

  const handleClear = () => {
    setLocalPropertyType("");
    setLocalRoomCategory("");
    setLocalRoomType("");
    setLocalPackageType("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setLocalMinGuests("");
    setLocalMaxGuests("");
    clearFilters();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("common.advancedFilters")}
    >
      <div className={styles.filtersModal}>
        {/* Property Type Filters */}
        {(!filters.listingType || filters.listingType === "PROPERTY") && (
          <div className={styles.filterSection}>
            <h3>{t("filters.propertyType")}</h3>
            <select
              className={styles.filterInput}
              value={localPropertyType}
              onChange={(e) => setLocalPropertyType(e.target.value)}
            >
              <option value="">{t("common.all")}</option>
              <option value="APARTMENT">{t("filters.apartment")}</option>
              <option value="HOUSE">{t("filters.house")}</option>
              <option value="VILLA">{t("filters.villa")}</option>
              <option value="STUDIO">{t("filters.studio")}</option>
              <option value="COTTAGE">Cottage</option>
              <option value="CABIN">Cabin</option>
            </select>
          </div>
        )}

        {/* Hotel Room Filters */}
        {(!filters.listingType || filters.listingType === "HOTEL_ROOM") && (
          <>
            <div className={styles.filterSection}>
              <h3>{t("filters.roomCategory")}</h3>
              <select
                className={styles.filterInput}
                value={localRoomCategory}
                onChange={(e) => setLocalRoomCategory(e.target.value)}
              >
                <option value="">{t("common.all")}</option>
                <option value="ECONOMY">Economy</option>
                <option value="STANDARD">{t("filters.standard")}</option>
                <option value="DELUXE">{t("filters.deluxe")}</option>
                <option value="SUITE">{t("filters.suite")}</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
            </div>
            <div className={styles.filterSection}>
              <h3>{t("filters.roomType")}</h3>
              <select
                className={styles.filterInput}
                value={localRoomType}
                onChange={(e) => setLocalRoomType(e.target.value)}
              >
                <option value="">{t("common.all")}</option>
                <option value="SINGLE">{t("filters.single")}</option>
                <option value="DOUBLE">{t("filters.double")}</option>
                <option value="TWIN">{t("filters.twin")}</option>
                <option value="TRIPLE">{t("filters.triple")}</option>
                <option value="QUAD">{t("filters.quad")}</option>
              </select>
            </div>
          </>
        )}

        {/* Travel Package Filters */}
        {(!filters.listingType || filters.listingType === "TRAVEL_PACKAGE") && (
          <div className={styles.filterSection}>
            <h3>{t("filters.packageType")}</h3>
            <select
              className={styles.filterInput}
              value={localPackageType}
              onChange={(e) => setLocalPackageType(e.target.value)}
            >
              <option value="">{t("common.all")}</option>
              <option value="ADVENTURE">{t("filters.adventure")}</option>
              <option value="RELAXATION">{t("filters.relaxation")}</option>
              <option value="CULTURAL">{t("filters.cultural")}</option>
              <option value="FAMILY">Family</option>
              <option value="ROMANTIC">Romantic</option>
              <option value="BUSINESS">Business</option>
            </select>
          </div>
        )}

        {/* Price Range */}
        <div className={styles.filterSection}>
          <h3>{t("filters.priceRange")}</h3>
          <div className={styles.rangeInputs}>
            <input
              type="number"
              className={styles.filterInput}
              placeholder={t("filters.minPrice")}
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
            />
            <span>{t("filters.to")}</span>
            <input
              type="number"
              className={styles.filterInput}
              placeholder={t("filters.maxPrice")}
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Guest Capacity */}
        <div className={styles.filterSection}>
          <h3>{t("bookings.guests")}</h3>
          <div className={styles.rangeInputs}>
            <input
              type="number"
              className={styles.filterInput}
              placeholder={t("filters.minGuests")}
              value={localMinGuests}
              onChange={(e) => setLocalMinGuests(e.target.value)}
            />
            <span>{t("filters.to")}</span>
            <input
              type="number"
              className={styles.filterInput}
              placeholder={t("filters.maxGuests")}
              value={localMaxGuests}
              onChange={(e) => setLocalMaxGuests(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filterActions}>
          <button className={styles.clearFiltersButton} onClick={handleClear}>
            {t("common.clearAll")}
          </button>
          <button className={styles.applyFiltersButton} onClick={handleApply}>
            {t("common.applyFilters")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
