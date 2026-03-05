import { IconEye, IconTrash } from "@tabler/icons-react";
import styles from "./ActionButtons.module.css";

interface ActionButtonsProps {
  onView?: () => void;
  onDelete?: () => void;
  viewTitle?: string;
  deleteTitle?: string;
}

export default function ActionButtons({
  onView,
  onDelete,
  viewTitle = "View Details",
  deleteTitle = "Delete",
}: ActionButtonsProps) {
  return (
    <div className={styles.container}>
      {onView && (
        <button
          className={styles.actionButton}
          onClick={onView}
          title={viewTitle}
        >
          <IconEye size={16} />
        </button>
      )}
      {onDelete && (
        <button
          className={styles.actionButtonDelete}
          onClick={onDelete}
          title={deleteTitle}
        >
          <IconTrash size={16} />
        </button>
      )}
    </div>
  );
}
