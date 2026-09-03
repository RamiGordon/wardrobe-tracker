"use client";

import { useState } from "react";
import {
  addOutfit as addOutfitAction,
  deleteOutfit as deleteOutfitAction,
  restoreOutfit as restoreOutfitAction,
} from "@/actions/outfits";
import type { Outfit } from "@/lib/types";

export function useOutfits(initialOutfits: Outfit[]) {
  const [outfits, setOutfits] = useState<Outfit[]>(initialOutfits);

  async function addOutfit(photo: string): Promise<void> {
    const created = await addOutfitAction(photo);
    setOutfits((prev) => [created, ...prev]);
  }

  async function removeOutfit(
    id: string,
  ): Promise<{ outfit: Outfit; index: number } | null> {
    const index = outfits.findIndex((o) => o.id === id);
    if (index === -1) return null;
    const outfit = outfits[index];
    setOutfits((prev) => prev.filter((o) => o.id !== id));
    await deleteOutfitAction(id);
    return { outfit, index };
  }

  async function restoreOutfit(outfit: Outfit, index: number): Promise<void> {
    setOutfits((prev) => {
      const next = prev.slice();
      next.splice(Math.min(index, next.length), 0, outfit);
      return next;
    });
    await restoreOutfitAction(outfit);
  }

  return { outfits, addOutfit, removeOutfit, restoreOutfit };
}
