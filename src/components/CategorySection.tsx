import type { Item } from "@/lib/types";
import { fmtMoney } from "@/lib/money";
import { ItemCard } from "./ItemCard";
import styles from "./CategorySection.module.css";

interface CategorySectionProps {
  category: string | null;
  items: Item[];
  onEdit: (id: string) => void;
  onPhotoClick: (photo: string, name: string) => void;
  onMarkBought: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CategorySection({
  category,
  items,
  onEdit,
  onPhotoClick,
  onMarkBought,
  onDelete,
}: CategorySectionProps) {
  const subtotal = category
    ? items
        .filter((i) => i.status === "bought")
        .reduce((s, i) => s + (Number(i.price) || 0), 0)
    : 0;

  return (
    <>
      {category && (
        <div className={styles.categoryHeading}>
          <span>{category}</span>
          {subtotal > 0 ? (
            <span className={`${styles.catTotal} mono`}>{fmtMoney(subtotal)}</span>
          ) : null}
        </div>
      )}
      {items
        .slice()
        .reverse()
        .map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onPhotoClick={onPhotoClick}
            onMarkBought={onMarkBought}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}
