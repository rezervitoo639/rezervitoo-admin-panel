import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  IconCheck,
  IconX,
  IconMapPin,
  IconBed,
  IconPlus,
} from "@tabler/icons-react";
import RoleTabs from "../../components/RoleTabs/RoleTabs";
import StatCard from "../../components/StatCard/StatCard";
import ResourcesListFeature, {
  type ResourcesListRef,
} from "../../features/resources/components/ResourcesListFeature";
import { useResourceFilters } from "../../features/resources/hooks/useResourceFilters";
import { useResources } from "../../features/resources/hooks/useResources";
import styles from "./ResourcesPage.module.css";

export default function ResourcesPage() {
  const { t } = useTranslation();
  const resourceTabs = [
    { value: "amenities", label: t("resources.tabs.amenities") },
    { value: "restrictions", label: t("resources.tabs.restrictions") },
    { value: "nearby", label: t("resources.tabs.nearby") },
    { value: "beds", label: t("resources.tabs.beds") },
  ];
  const { filters, setActiveTab } = useResourceFilters();
  const { data: resources = [] } = useResources(filters.activeTab);
  const resourcesListRef = useRef<ResourcesListRef>(null);

  const getResourceIcon = () => {
    const icons = {
      amenities: <IconCheck size={20} />,
      restrictions: <IconX size={20} />,
      nearby: <IconMapPin size={20} />,
      beds: <IconBed size={20} />,
    };
    return icons[filters.activeTab];
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "amenities" | "restrictions" | "nearby" | "beds");
  };

  const handleAdd = () => {
    resourcesListRef.current?.openModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{t("resources.pageTitle")}</h1>
            <p className={styles.subtitle}>{t("resources.pageSubtitle")}</p>
          </div>
          <StatCard
            title={t(`resources.tabs.${filters.activeTab}`)}
            value={resources.length}
            icon={getResourceIcon()}
            orientation="row"
          />
        </div>
      </div>

      <RoleTabs
        tabs={resourceTabs}
        activeTab={filters.activeTab}
        onChange={handleTabChange}
        actionButton={
          <button
            className={styles.addTabButton}
            onClick={handleAdd}
            aria-label="Add Resource"
          >
            <IconPlus size={20} />
          </button>
        }
      />

      <div className={styles.content}>
        <ResourcesListFeature
          ref={resourcesListRef}
          resourceType={filters.activeTab}
        />
      </div>
    </div>
  );
}
