import type { MouseEvent } from "react";
import type { Item } from "@/lib/types";
import { fmtMoney } from "@/lib/money";
import styles from "./ItemCard.module.css";

interface ItemCardProps {
  item: Item;
  onEdit: (id: string) => void;
  onPhotoClick: (photo: string, name: string) => void;
  onMarkBought: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ItemCard({
  item,
  onEdit,
  onPhotoClick,
  onMarkBought,
  onDelete,
}: ItemCardProps) {
  const isBought = item.status === "bought";

  function stop(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      className={`${styles.itemCard} ${isBought ? styles.isBought : ""} ${
        !isBought ? styles.isEditable : ""
      }`}
      onClick={!isBought ? () => onEdit(item.id) : undefined}
    >
      {item.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.itemPhoto}
          src={item.photo}
          alt={item.name}
          onClick={(e) => {
            stop(e);
            onPhotoClick(item.photo as string, item.name);
          }}
        />
      ) : (
        <div className={`${styles.itemPhoto} ${styles.placeholder}`}>🏷️</div>
      )}

      <div className={styles.itemDivider} />

      <div className={styles.itemInfo}>
        <div className={styles.itemName}>{item.name || "Sin nombre"}</div>
        <div className={styles.itemMeta}>{item.brand || item.category}</div>
        <div
          className={`${styles.itemStatusRow} ${isBought ? styles.clickable : ""}`}
          onClick={
            isBought
              ? (e) => {
                  stop(e);
                  onMarkBought(item.id);
                }
              : undefined
          }
        >
          {isBought ? (
            <>
              <span className={styles.boughtBadge}>✓ COMPRADA</span>
              <span className={`${styles.itemPrice} mono`}>
                {fmtMoney(Number(item.price) || 0)}
              </span>
            </>
          ) : (
            <>
              <button
                className={styles.buyBtn}
                onClick={(e) => {
                  stop(e);
                  onMarkBought(item.id);
                }}
              >
                Marcar comprada
              </button>
              {item.estPrice ? (
                <span className={`${styles.estPrice} mono`}>
                  est. {fmtMoney(Number(item.estPrice))}
                </span>
              ) : null}
            </>
          )}
        </div>
      </div>

      <button
        className={styles.itemDelete}
        onClick={(e) => {
          stop(e);
          onDelete(item.id);
        }}
      >
        ✕
      </button>
    </div>
  );
}
