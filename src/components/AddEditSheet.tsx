"use client";

import { useState, type ChangeEvent } from "react";
import { CATEGORIES } from "@/lib/categories";
import { compressImage } from "@/lib/compressImage";
import type { Category, ItemDraft } from "@/lib/types";
import styles from "./Sheet.module.css";

interface AddEditSheetProps {
  open: boolean;
  mode: "add" | "edit";
  initial: {
    name: string;
    category: Category;
    brand: string;
    estPrice: number | null;
    photo: string | null;
  } | null;
  defaultCategory: Category;
  onCancel: () => void;
  onSave: (draft: ItemDraft) => void;
  onPhotoError: (message: string) => void;
}

// Se remonta con una `key` distinta cada vez que se abre (ver WardrobeApp),
// así el estado del form arranca limpio sin necesitar resetearlo en un efecto.
export function AddEditSheet({
  open,
  mode,
  initial,
  defaultCategory,
  onCancel,
  onSave,
  onPhotoError,
}: AddEditSheetProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? defaultCategory);
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [estPrice, setEstPrice] = useState(
    initial?.estPrice != null ? String(initial.estPrice) : "",
  );
  const [photo, setPhoto] = useState<string | null>(initial?.photo ?? null);
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
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      category,
      brand: brand.trim(),
      estPrice: estPrice ? parseFloat(estPrice) : null,
      photo,
    });
  }

  const canSave = name.trim().length > 0;

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={styles.sheet}>
        <div className={styles.sheetHandle} />
        <h2>{mode === "edit" ? "Editar prenda" : "Nueva prenda"}</h2>
        <p className={styles.sheetSub}>
          {mode === "edit"
            ? "Modificá los datos de la prenda."
            : "La agregás a la wishlist. El precio real lo cargás cuando la compres."}
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

        <div className={styles.field}>
          <label>Prenda</label>
          <input
            type="text"
            placeholder="Ej: Pantalón sastrero negro"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Marca / tienda (opcional)</label>
          <input
            type="text"
            placeholder="Ej: Abercrombie & Fitch"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Precio estimado (opcional)</label>
          <div className={styles.priceInputWrap}>
            <span>$</span>
            <input
              type="number"
              placeholder="0"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={estPrice}
              onChange={(e) => setEstPrice(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.sheetActions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
          <button
            className={styles.btnSave}
            disabled={!canSave}
            onClick={handleSave}
          >
            {mode === "edit" ? "Guardar cambios" : "Agregar a wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
