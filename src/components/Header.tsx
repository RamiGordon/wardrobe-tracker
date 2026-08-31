import { fmtMoney } from "@/lib/money";
import { UserAvatar } from "./UserAvatar";
import styles from "./Header.module.css";

interface HeaderProps {
  total: number;
  boughtCount: number;
  itemCount: number;
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  };
}

export function Header({ total, boughtCount, itemCount, user }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.avatarSlot}>
        <UserAvatar name={user.name} email={user.email} image={user.image} />
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
