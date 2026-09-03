import { fmtMoney } from "@/lib/money";
import { UserAvatar } from "./UserAvatar";
import { SectionNav } from "./SectionNav";
import styles from "./Header.module.css";

interface HeaderProps {
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  };
  wishlistSummary?: {
    total: number;
    boughtCount: number;
    itemCount: number;
  };
}

export function Header({ user, wishlistSummary }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.avatarSlot}>
        <UserAvatar name={user.name} email={user.email} image={user.image} />
      </div>
      <SectionNav />
      {wishlistSummary && (
        <div className={styles.totalRow}>
          <div>
            <div className={styles.totalLabel}>Total gastado</div>
            <div className={`${styles.totalValue} mono`}>
              {fmtMoney(wishlistSummary.total)}
            </div>
          </div>
          <div className={styles.progressPill}>
            {wishlistSummary.boughtCount}
            <span className="mono">/{wishlistSummary.itemCount}</span> compradas
          </div>
        </div>
      )}
    </header>
  );
}
