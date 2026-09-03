import styles from "./Fab.module.css";

interface FabProps {
  onClick: () => void;
  label?: string;
}

export function Fab({ onClick, label = "Agregar a la wishlist" }: FabProps) {
  return (
    <div className={styles.fab}>
      <button onClick={onClick}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        {label}
      </button>
    </div>
  );
}
