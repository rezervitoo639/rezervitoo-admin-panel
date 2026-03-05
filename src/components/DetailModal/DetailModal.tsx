import { useEffect } from "react";
import type { ReactNode } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import styles from "./DetailModal.module.css";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  elevatedZIndex?: boolean;
  hideOverlay?: boolean;
}

export default function DetailModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  elevatedZIndex = false,
  hideOverlay = false,
}: DetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { sidebarOpen } = useSidebar();

  return (
    <div
      className={`${styles.overlay} ${elevatedZIndex ? styles.elevated : ""} ${hideOverlay ? styles.noBackground : ""}`}
      onClick={handleOverlayClick}
      data-sidebar-collapsed={!sidebarOpen ? "true" : "false"}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <span className={styles.iconText}>×</span>
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
