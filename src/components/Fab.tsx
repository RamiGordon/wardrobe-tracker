import styles from "./Fab.module.css";

export function Fab({ onClick }: { onClick: () => void }) {
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
        Agregar a la wishlist
      </button>
    </div>
  );
}
