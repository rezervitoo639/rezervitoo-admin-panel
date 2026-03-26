import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name_en: editingItem?.name_en || "",
    name_ar: editingItem?.name_ar || "",
    name_fr: editingItem?.name_fr || "",
    icon: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name_en", formData.name_en);
    data.append("name_ar", formData.name_ar);
    data.append("name_fr", formData.name_fr);
    if (formData.icon) {
      data.append("icon", formData.icon);
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name_en" className={styles.label}>
          {t("resources.form.nameEn")} *
        </label>
        <input
          id="name_en"
          type="text"
          value={formData.name_en}
          onChange={(e) =>
            setFormData({ ...formData, name_en: e.target.value })
          }
          className={styles.input}
          required
          placeholder={t("resources.form.nameEnPlaceholder")}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name_ar" className={styles.label}>
          {t("resources.form.nameAr")}
        </label>
        <input
          id="name_ar"
          type="text"
          value={formData.name_ar}
          onChange={(e) =>
            setFormData({ ...formData, name_ar: e.target.value })
          }
          className={styles.input}
          placeholder={t("resources.form.nameArPlaceholder")}
          dir="rtl"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name_fr" className={styles.label}>
          {t("resources.form.nameFr")}
        </label>
        <input
          id="name_fr"
          type="text"
          value={formData.name_fr}
          onChange={(e) =>
            setFormData({ ...formData, name_fr: e.target.value })
          }
          className={styles.input}
          placeholder={t("resources.form.nameFrPlaceholder")}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="icon" className={styles.label}>
          {t("resources.form.icon")}
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
            <p>{t("resources.form.currentIcon")}</p>
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
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          <IconCheck size={18} />
          {editingItem ? t("common.update") : t("common.create")}
        </button>
      </div>
    </form>
  );
}
