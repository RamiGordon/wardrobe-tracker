import styles from "./EmptyState.module.css";

export function EmptyState({ variant }: { variant: "no-items" | "no-matches" }) {
  if (variant === "no-items") {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyTag}>🏷️</div>
        <h3>Armá tu wishlist</h3>
        <p>
          Cargá las prendas que querés comprar con su foto. Cuando estés en
          Miami, las vas marcando como compradas.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.empty}>
      <div className={styles.emptyTag}>✓</div>
      <h3>Nada acá</h3>
      <p>No hay prendas en este filtro todavía.</p>
    </div>
  );
}
