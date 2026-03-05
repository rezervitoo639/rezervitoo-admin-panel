import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/Modal/Modal";
import type { BookingFilters } from "../hooks/useBookingFilters";
import styles from "../../../pages/Bookings/BookingsPage.module.css";

interface BookingsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: BookingFilters;
  setFilter: (key: keyof BookingFilters, value: any) => void;
  clearFilters: () => void;
}

export default function BookingsFilterModal({
  isOpen,
  onClose,
  filters,
  setFilter,
  clearFilters,
}: BookingsFilterModalProps) {
  const { t } = useTranslation();
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const [localStartDateFrom, setLocalStartDateFrom] = useState(
    filters.startDateFrom,
  );
  const [localStartDateTo, setLocalStartDateTo] = useState(filters.startDateTo);

  useEffect(() => {
    setLocalMinPrice(filters.minPrice);
    setLocalMaxPrice(filters.maxPrice);
    setLocalStartDateFrom(filters.startDateFrom);
    setLocalStartDateTo(filters.startDateTo);
  }, [
    filters.minPrice,
    filters.maxPrice,
    filters.startDateFrom,
    filters.startDateTo,
  ]);

  const handleApply = () => {
    setFilter("minPrice", localMinPrice);
    setFilter("maxPrice", localMaxPrice);
    setFilter("startDateFrom", localStartDateFrom);
    setFilter("startDateTo", localStartDateTo);
    onClose();
  };

  const handleClear = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setLocalStartDateFrom("");
    setLocalStartDateTo("");
    clearFilters();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("common.advancedFilters")}
    >
      <div className={styles.filtersModal}>
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

        <div className={styles.filterSection}>
          <h3>{t("common.startDateRange")}</h3>
          <div className={styles.rangeInputs}>
            <input
              type="date"
              className={styles.filterInput}
              placeholder={t("filters.from")}
              value={localStartDateFrom}
              onChange={(e) => setLocalStartDateFrom(e.target.value)}
            />
            <span>{t("filters.to")}</span>
            <input
              type="date"
              className={styles.filterInput}
              placeholder={t("filters.to")}
              value={localStartDateTo}
              onChange={(e) => setLocalStartDateTo(e.target.value)}
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
