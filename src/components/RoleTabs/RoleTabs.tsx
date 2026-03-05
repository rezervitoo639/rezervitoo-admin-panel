import styles from "./RoleTabs.module.css";

export interface RoleTab {
  value: string;
  label: string;
  count?: number;
}

interface RoleTabsProps {
  tabs: RoleTab[];
  activeTab: string;
  onChange: (value: string) => void;
  actionButton?: React.ReactNode;
}

export default function RoleTabs({
  tabs,
  activeTab,
  onChange,
  actionButton,
}: RoleTabsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.roleTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${
              activeTab === tab.value ? styles.active : ""
            }`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={styles.count}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      {actionButton && (
        <div className={styles.actionButton}>{actionButton}</div>
      )}
    </div>
  );
}
