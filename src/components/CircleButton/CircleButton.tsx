import type { ReactNode } from "react";
import styles from "./CircleButton.module.css";

interface CircleButtonProps {
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  iconColor?: string; // Color for active icon
}

export default function CircleButton({
  icon,
  onClick,
  active = false,
  title,
  disabled = false,
  iconColor,
}: CircleButtonProps) {
  return (
    <button
      className={`${styles.circleButton} ${active ? styles.active : ""}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={active && iconColor ? { color: iconColor } : undefined}
    >
      {icon}
    </button>
  );
}
