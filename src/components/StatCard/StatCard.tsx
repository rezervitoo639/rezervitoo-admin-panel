import { isValidElement } from "react";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react";
import styles from "./StatCard.module.css";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: any; // Accepting component or node
  color?: "primary" | "success" | "warning" | "info" | "danger";
  trend?: number;
  trendLabel?: string;
  className?: string;
  orientation?: "row" | "column"; // Controls flex-direction
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  trend,
  trendLabel,
  className = "",
  orientation = "column", // Default to column
}: StatCardProps) {
  // Determine trend color and icon
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;
  // const isNeutral = !trend || trend === 0;

  return (
    <div
      className={`${styles.statCard} ${styles[color]} ${styles[orientation]} ${className}`}
    >
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          {Icon && (isValidElement(Icon) ? Icon : <Icon size={24} />)}
        </div>
        {trend !== undefined && (
          <div
            className={`${styles.trend} ${isPositive ? styles.positive : isNegative ? styles.negative : styles.neutral}`}
          >
            {isPositive ? (
              <IconTrendingUp size={16} />
            ) : isNegative ? (
              <IconTrendingDown size={16} />
            ) : (
              <IconMinus size={16} />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.title}>{title}</div>
        {trendLabel && <div className={styles.meta}>{trendLabel}</div>}
      </div>
    </div>
  );
}
