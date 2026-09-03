"use client";

import { useState, type ChangeEvent } from "react";
import { compressImage } from "@/lib/compressImage";
import styles from "./Sheet.module.css";

interface OutfitUploadSheetProps {
  open: boolean;
  onCancel: () => void;
  onSave: (photo: string) => void;
  onPhotoError: (message: string) => void;
}

// Se remonta con una `key` distinta cada vez que se abre (ver OutfitsGallery),
// así el estado arranca limpio sin necesitar resetearlo en un efecto.
export function OutfitUploadSheet({
  open,
  onCancel,
  onSave,
  onPhotoError,
}: OutfitUploadSheetProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [processingPhoto, setProcessingPhoto] = useState(false);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setProcessingPhoto(true);
      const dataUrl = await compressImage(file);
      setPhoto(dataUrl);
    } catch {
      onPhotoError("No se pudo procesar la foto");
    } finally {
      setProcessingPhoto(false);
      e.target.value = "";
    }
  }

  function handleSave() {
    if (!photo) return;
    onSave(photo);
  }

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={styles.sheet}>
        <div className={styles.sheetHandle} />
        <h2>Nuevo outfit</h2>
        <p className={styles.sheetSub}>
          Subí una foto de referencia del outfit que armaste.
        </p>

        <div className={styles.field}>
          <label>Foto</label>
          <div className={styles.photoPicker}>
            <label className={styles.photoPreview}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.photoImg} src={photo} alt="" />
              ) : (
                <span>{processingPhoto ? "…" : "＋"}</span>
              )}
              <input
                className={styles.photoInput}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div className={styles.sheetActions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.btnSave} disabled={!photo} onClick={handleSave}>
            Agregar outfit
          </button>
        </div>
      </div>
    </div>
  );
}
