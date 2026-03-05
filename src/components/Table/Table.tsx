import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Table.module.css";

interface Column<T> {
  key: string;
  label: string;
  headerClassName?: string;
  render?: (item: T) => ReactNode;
  align?: "left" | "right" | "center";
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function Table<T = unknown>({
  columns,
  data,
  emptyMessage = "No data available",
}: TableProps<T>) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  // Safety check: ensure data is an array
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className={styles.table}>
        <div className={styles.empty}>{emptyMessage}</div>
      </div>
    );
  }

  // Helper to get opposite alignment for RTL
  const getAlignment = (align?: "left" | "right" | "center") => {
    if (!align || align === "center") return align;
    if (!isRTL) return align;
    return align === "left" ? "right" : "left";
  };

  return (
    <div className={styles.table}>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.headerClassName}
                  style={{ textAlign: getAlignment(column.align || "left") }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{ textAlign: getAlignment(column.align || "left") }}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as any)[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
