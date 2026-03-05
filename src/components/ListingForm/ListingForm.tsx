import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ListingForm.module.css";

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  city: string;
  country: string;
  bedrooms: string;
  bathrooms: string;
}

interface ListingFormProps {
  initialData?: Partial<ListingFormData>;
  onSubmit: (data: ListingFormData) => void;
  onCancel: () => void;
}

/**
 * Example component demonstrating i18n best practices
 *
 * Key features:
 * - useTranslation() hook for all text
 * - CSS logical properties in module.css
 * - RTL-friendly layout (no manual RTL handling needed)
 * - Interpolation for validation messages
 */
export default function ListingForm({
  initialData,
  onSubmit,
  onCancel,
}: ListingFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ListingFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    bedrooms: initialData?.bedrooms || "",
    bathrooms: initialData?.bathrooms || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ListingFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ListingFormData, string>> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = t("validation.required");
    } else if (formData.title.length < 5) {
      newErrors.title = t("validation.minLength", { min: 5 });
    } else if (formData.title.length > 100) {
      newErrors.title = t("validation.maxLength", { max: 100 });
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = t("validation.required");
    } else if (formData.description.length < 20) {
      newErrors.description = t("validation.minLength", { min: 20 });
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = t("validation.required");
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = t("validation.invalidNumber");
    } else if (Number(formData.price) < 10) {
      newErrors.price = t("validation.minValue", { min: 10 });
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = t("validation.required");
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = t("validation.required");
    }

    // Bedrooms validation
    if (!formData.bedrooms) {
      newErrors.bedrooms = t("validation.required");
    } else if (
      isNaN(Number(formData.bedrooms)) ||
      Number(formData.bedrooms) < 1
    ) {
      newErrors.bedrooms = t("validation.minValue", { min: 1 });
    }

    // Bathrooms validation
    if (!formData.bathrooms) {
      newErrors.bathrooms = t("validation.required");
    } else if (
      isNaN(Number(formData.bathrooms)) ||
      Number(formData.bathrooms) < 1
    ) {
      newErrors.bathrooms = t("validation.minValue", { min: 1 });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ListingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>
        {initialData ? t("listings.editListing") : t("listings.createListing")}
      </h2>

      {/* Title Field */}
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="title">
          {t("listings.title")} <span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          type="text"
          className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={t("listings.title")}
        />
        {errors.title && <p className={styles.errorText}>{errors.title}</p>}
      </div>

      {/* Description Field */}
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">
          {t("listings.description")} <span className={styles.required}>*</span>
        </label>
        <textarea
          id="description"
          className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder={t("listings.description")}
          rows={4}
        />
        {errors.description && (
          <p className={styles.errorText}>{errors.description}</p>
        )}
      </div>

      {/* Price Field */}
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="price">
          {t("listings.pricePerNight")}{" "}
          <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputGroup}>
          <input
            id="price"
            type="number"
            className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          <span className={styles.inputAddon}>$</span>
        </div>
        {errors.price && <p className={styles.errorText}>{errors.price}</p>}
      </div>

      {/* Location Fields - Inline */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="city">
            {t("listings.city")} <span className={styles.required}>*</span>
          </label>
          <input
            id="city"
            type="text"
            className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder={t("listings.city")}
          />
          {errors.city && <p className={styles.errorText}>{errors.city}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="country">
            {t("listings.country")} <span className={styles.required}>*</span>
          </label>
          <input
            id="country"
            type="text"
            className={`${styles.input} ${errors.country ? styles.inputError : ""}`}
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
            placeholder={t("listings.country")}
          />
          {errors.country && (
            <p className={styles.errorText}>{errors.country}</p>
          )}
        </div>
      </div>

      {/* Capacity Fields - Inline */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="bedrooms">
            {t("listings.bedrooms")} <span className={styles.required}>*</span>
          </label>
          <input
            id="bedrooms"
            type="number"
            className={`${styles.input} ${errors.bedrooms ? styles.inputError : ""}`}
            value={formData.bedrooms}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
            placeholder="0"
            min="1"
          />
          {errors.bedrooms && (
            <p className={styles.errorText}>{errors.bedrooms}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="bathrooms">
            {t("listings.bathrooms")} <span className={styles.required}>*</span>
          </label>
          <input
            id="bathrooms"
            type="number"
            className={`${styles.input} ${errors.bathrooms ? styles.inputError : ""}`}
            value={formData.bathrooms}
            onChange={(e) => handleChange("bathrooms", e.target.value)}
            placeholder="0"
            min="1"
          />
          {errors.bathrooms && (
            <p className={styles.errorText}>{errors.bathrooms}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={onCancel}
        >
          {t("common.cancel")}
        </button>
        <button type="submit" className={styles.btnPrimary}>
          {initialData ? t("common.update") : t("common.create")}
        </button>
      </div>
    </form>
  );
}
