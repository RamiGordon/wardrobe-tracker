"use client";

import styles from "./PhotoLightbox.module.css";

interface PhotoLightboxProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

export function PhotoLightbox({ src, alt, onClose }: PhotoLightboxProps) {
  return (
    <div
      className={`${styles.lightbox} ${src ? styles.open : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className={styles.close} onClick={onClose}>
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt={alt} />}
    </div>
  );
}
