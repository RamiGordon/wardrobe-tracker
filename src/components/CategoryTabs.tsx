import styles from "./Tabs.module.css";

interface CategoryTabsProps {
  tabs: { label: string; count: number }[];
  active: string;
  onChange: (value: string) => void;
}

export function CategoryTabs({ tabs, active, onChange }: CategoryTabsProps) {
  return (
    <div className={styles.tabs}>
      {tabs.map(({ label, count }) => (
        <button
          key={label}
          className={`${styles.tab} ${active === label ? styles.active : ""}`}
          onClick={() => onChange(label)}
        >
          {label} <span className={`${styles.count} mono`}>{count}</span>
        </button>
      ))}
    </div>
  );
}
