import styles from "./Tabs.module.css";

export type StatusTabValue = "Todas" | "Pendientes" | "Compradas";

interface StatusFilterProps {
  active: StatusTabValue;
  counts: Record<StatusTabValue, number>;
  onChange: (value: StatusTabValue) => void;
}

const OPTIONS: StatusTabValue[] = ["Todas", "Pendientes", "Compradas"];

export function StatusFilter({ active, counts, onChange }: StatusFilterProps) {
  return (
    <div className={styles.statusFilter}>
      {OPTIONS.map((label) => (
        <div
          key={label}
          className={`${styles.statusTab} ${active === label ? styles.active : ""}`}
          onClick={() => onChange(label)}
        >
          {label} <span className="mono">{counts[label]}</span>
        </div>
      ))}
    </div>
  );
}
