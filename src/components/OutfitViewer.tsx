"use client";

import { useEffect, useRef } from "react";
import type { Outfit } from "@/lib/types";
import styles from "./OutfitViewer.module.css";

interface OutfitViewerProps {
  outfits: Outfit[];
  startIndex: number | null;
  onClose: () => void;
}

// Se monta solo cuando hay un índice para mostrar — cada apertura es un mount
// fresco, así el scroll al slide inicial siempre corre limpio sin depender
// de una key artificial.
export function OutfitViewer({ outfits, startIndex, onClose }: OutfitViewerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startIndex === null) return;
    const slide = scrollerRef.current?.children[startIndex] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [startIndex]);

  if (startIndex === null) return null;

  return (
    <div className={styles.overlay}>
      <button className={styles.close} onClick={onClose}>
        ✕
      </button>
      <div className={styles.scroller} ref={scrollerRef}>
        {outfits.map((outfit) => (
          <div className={styles.slide} key={outfit.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={outfit.photo} alt="Outfit" />
          </div>
        ))}
      </div>
    </div>
  );
}
