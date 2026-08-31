"use client";

import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

export interface ToastData {
  id: number;
  message: string;
  onUndo?: () => void;
}

// Se remonta con `key={data.id}` cada vez que se pide un toast nuevo, así
// arranca visible al toque (la animación de entrada corre siempre al montar)
// sin necesitar un setState sincrónico dentro de un efecto.
function ToastBubble({ data }: { data: ToastData }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = data.onUndo ? 4000 : 1800;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [data]);

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

export function Toast({ data }: { data: ToastData | null }) {
  if (!data) return null;
  return <ToastBubble key={data.id} data={data} />;
}
