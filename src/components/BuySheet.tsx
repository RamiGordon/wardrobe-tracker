"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";
import styles from "./Sheet.module.css";

interface BuySheetProps {
  open: boolean;
  item: Item | null;
  onCancel: () => void;
  onConfirm: (price: number) => void;
  onUnmark: () => void;
}

// Se remonta con una `key` distinta cada vez que se abre (ver WardrobeApp),
// así el precio arranca limpio sin necesitar resetearlo en un efecto.
export function BuySheet({ open, item, onCancel, onConfirm, onUnmark }: BuySheetProps) {
  const [price, setPrice] = useState(() =>
    item?.price != null
      ? String(item.price)
      : item?.estPrice != null
        ? String(item.estPrice)
        : "",
  );

  if (!item) {
    return <div className={styles.backdrop} />;
  }

  const isBought = item.status === "bought";
  const canConfirm = price !== "";

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={styles.sheet}>
        <div className={styles.sheetHandle} />
        <h2>{isBought ? "Editar compra" : "Marcar como comprada"}</h2>
        <p className={styles.sheetSub}>Cargá lo que pagaste realmente.</p>

        <div className={styles.buyCardPreview}>
          {item.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.photo} alt="" />
          ) : (
            <div className={styles.ph}>🏷️</div>
          )}
          <div>
            <div className={styles.bcpName}>{item.name}</div>
            <div className={styles.bcpCat}>{item.category}</div>
          </div>
        </div>

        <div className={styles.field}>
          <label>Precio pagado</label>
          <div className={styles.priceInputWrap}>
            <span>$</span>
            <input
              type="number"
              placeholder="0"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.sheetActions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
          <button
            className={`${styles.btnSave} ${styles.green}`}
            disabled={!canConfirm}
            onClick={() => onConfirm(parseFloat(price) || 0)}
          >
            Confirmar compra
          </button>
        </div>
        {isBought && (
          <button className={styles.btnUnmark} onClick={onUnmark}>
            Desmarcar como comprada
          </button>
        )}
      </div>
    </div>
  );
}
