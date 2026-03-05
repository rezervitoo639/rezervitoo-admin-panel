import { useState } from "react";
import { IconX, IconCheck } from "@tabler/icons-react";
import type {
  Amenity,
  Restriction,
  Nearby,
  BedType,
} from "../../../types/resource.types";
import styles from "../../../pages/Resources/ResourcesPage.module.css";

type Resource = Amenity | Restriction | Nearby | BedType;

interface ResourceFormProps {
  editingItem: Resource | null;
  resourceLabel: string;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ResourceForm({
  editingItem,
  resourceLabel,
  onSubmit,
  onCancel,
  isSubmitting,
}: ResourceFormProps) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || "",
    icon: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.icon) {
      data.append("icon", formData.icon);
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={styles.input}
          required
          placeholder={`Enter ${resourceLabel.toLowerCase()} name`}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="icon" className={styles.label}>
          Icon (Optional)
        </label>
        <input
          id="icon"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, icon: e.target.files?.[0] || null })
          }
          className={styles.fileInput}
        />
        {editingItem?.icon && !formData.icon && (
          <div className={styles.currentIcon}>
            <p>Current icon:</p>
            <img src={editingItem.icon} alt="Current" />
          </div>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          <IconX size={18} />
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          <IconCheck size={18} />
          {editingItem ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
