import { useState } from "react";

export interface ValidationFilters {
  search: string;
  role: string;
}

export function useValidationFilters() {
  const [filters, setFilters] = useState<ValidationFilters>({
    search: "",
    role: "",
  });

  const setFilter = <K extends keyof ValidationFilters>(
    key: K,
    value: ValidationFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return { filters, setFilter };
}
