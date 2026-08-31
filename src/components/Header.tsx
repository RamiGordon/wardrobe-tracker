import { fmtMoney } from "@/lib/money";
import { signOutAction } from "@/actions/auth";
import styles from "./Header.module.css";

interface HeaderProps {
  total: number;
  boughtCount: number;
  itemCount: number;
}

export function Header({ total, boughtCount, itemCount }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.eyebrowRow}>
        <p className={styles.eyebrow}>Miami · Wishlist</p>
        <form action={signOutAction}>
          <button className={styles.signOut} type="submit">
            Salir
          </button>
        </form>
      </div>
      <div className={styles.totalRow}>
        <div>
          <div className={styles.totalLabel}>Total gastado</div>
          <div className={`${styles.totalValue} mono`}>{fmtMoney(total)}</div>
        </div>
        <div className={styles.progressPill}>
          {boughtCount}
          <span className="mono">/{itemCount}</span> compradas
        </div>
      </div>
    </header>
  );
}
