"use client";

import { useState } from "react";
import type { Outfit } from "@/lib/types";
import { useOutfits } from "@/hooks/useOutfits";
import { Header } from "./Header";
import { EmptyState } from "./EmptyState";
import { Fab } from "./Fab";
import { OutfitUploadSheet } from "./OutfitUploadSheet";
import { OutfitViewer } from "./OutfitViewer";
import { Toast, type ToastData } from "./Toast";
import styles from "./OutfitsGallery.module.css";

interface OutfitsGalleryProps {
  initialOutfits: Outfit[];
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  };
}

export function OutfitsGallery({ initialOutfits, user }: OutfitsGalleryProps) {
  const { outfits, addOutfit, removeOutfit, restoreOutfit } = useOutfits(initialOutfits);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadToken, setUploadToken] = useState(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [toastData, setToastData] = useState<ToastData | null>(null);

  function showToast(message: string, onUndo?: () => void) {
    setToastData({ message, onUndo });
  }

  function openUploadSheet() {
    setUploadOpen(true);
    setUploadToken((t) => t + 1);
  }
  function closeUploadSheet() {
    setUploadOpen(false);
  }

  async function handleSave(photo: string) {
    await addOutfit(photo);
    setUploadOpen(false);
    showToast("Outfit agregado ✓");
  }

  function handleDelete(id: string) {
    removeOutfit(id).then((result) => {
      if (!result) return;
      showToast("Outfit eliminado", () => {
        restoreOutfit(result.outfit, result.index);
      });
    });
  }

  return (
    <>
      <Header user={user} />

      <main>
        {outfits.length === 0 ? (
          <EmptyState variant="no-outfits" />
        ) : (
          <div className={styles.grid}>
            {outfits.map((outfit, index) => (
              <div className={styles.card} key={outfit.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.photo}
                  src={outfit.photo}
                  alt="Outfit"
                  onClick={() => setViewerIndex(index)}
                />
                <button
                  className={styles.delete}
                  onClick={() => handleDelete(outfit.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Fab onClick={openUploadSheet} label="Agregar outfit" />

      <OutfitUploadSheet
        key={uploadToken}
        open={uploadOpen}
        onCancel={closeUploadSheet}
        onSave={handleSave}
        onPhotoError={(message) => showToast(message)}
      />

      <OutfitViewer
        outfits={outfits}
        startIndex={viewerIndex}
        onClose={() => setViewerIndex(null)}
      />

      <Toast data={toastData} />
    </>
  );
}
