import type { ReactNode } from "react";
import styles from "./IconButton.module.css";

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  iconColor?: string; // Color for active icon
}

export default function IconButton({
  icon,
  onClick,
  active = false,
  title,
  disabled = false,
  iconColor,
}: IconButtonProps) {
  return (
    <button
      className={`${styles.iconButton} ${active ? styles.active : ""}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={active && iconColor ? { color: iconColor } : undefined}
    >
      {icon}
    </button>
  );
}
