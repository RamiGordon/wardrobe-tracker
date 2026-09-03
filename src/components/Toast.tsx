"use client";

import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

export interface ToastData {
  message: string;
  onUndo?: () => void;
}

export function Toast({ data }: { data: ToastData | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!data) return;
    // El pequeño delay antes de mostrar fuerza el reflow necesario para que
    // la transición de opacidad/traslado de CSS dispare (en vez de arrancar
    // ya visible sin animación de entrada).
    const showTimer = setTimeout(() => setVisible(true), 10);
    const duration = data.onUndo ? 4000 : 1800;
    const hideTimer = setTimeout(() => setVisible(false), duration + 10);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className={`${styles.toast} ${visible ? styles.show : ""}`}>
      <span>{data.message}</span>
      {data.onUndo && (
        <button
          className={styles.undoBtn}
          onClick={() => {
            setVisible(false);
            data.onUndo?.();
          }}
        >
          Deshacer
        </button>
      )}
    </div>
  );
}
