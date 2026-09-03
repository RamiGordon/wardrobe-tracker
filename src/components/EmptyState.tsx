import styles from "./EmptyState.module.css";

type Variant = "no-items" | "no-matches" | "no-outfits";

export function EmptyState({ variant }: { variant: Variant }) {
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

  if (variant === "no-outfits") {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyTag}>📷</div>
        <h3>Todavía no hay outfits</h3>
        <p>Subí fotos de referencia de los outfits que querés armar.</p>
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
