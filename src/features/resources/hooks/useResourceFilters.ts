import { useState, useCallback } from "react";

export type ResourceType = "amenities" | "restrictions" | "nearby" | "beds";

export interface ResourceFilters {
  activeTab: ResourceType;
}

export function useResourceFilters() {
  const [activeTab, setActiveTab] = useState<ResourceType>("amenities");

  const filters: ResourceFilters = {
    activeTab,
  };

  const setFilter = useCallback((key: keyof ResourceFilters, value: any) => {
    if (key === "activeTab") {
      setActiveTab(value as ResourceType);
    }
  }, []);

  return {
    filters,
    activeTab,
    setActiveTab,
    setFilter,
  };
}
