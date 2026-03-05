import type { ReactNode } from "react";
import styles from "./PageControls.module.css";

interface PageControlsProps {
  children: ReactNode;
}

export default function PageControls({ children }: PageControlsProps) {
  return <div className={styles.controls}>{children}</div>;
}

export function Spacer() {
  return <div className={styles.spacer} />;
}
