import { useTranslation } from "react-i18next";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  itemName?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemName = "items",
}: PaginationProps) {
  const { t } = useTranslation();
  if (totalCount === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        {t("common.pagination", {
          start: startItem,
          end: endItem,
          total: totalCount,
          items: itemName,
        })}
      </div>
      <div className={styles.paginationControls}>
        {onPageSizeChange && (
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
          >
            <option value="10">{t("common.perPage", { count: 10 })}</option>
            <option value="25">{t("common.perPage", { count: 25 })}</option>
            <option value="50">{t("common.perPage", { count: 50 })}</option>
            <option value="100">{t("common.perPage", { count: 100 })}</option>
          </select>
        )}
        <div className={styles.pageButtons}>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            {t("pagination.first")}
          </button>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {t("pagination.previous")}
          </button>
          <span className={styles.pageNumber}>
            {t("pagination.pageOf", {
              current: currentPage,
              total: totalPages,
            })}
          </span>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            {t("pagination.next")}
          </button>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            {t("pagination.last")}
          </button>
        </div>
      </div>
    </div>
  );
}
