"use client";

import { useState } from "react";
import {
  addItem as addItemAction,
  deleteItem as deleteItemAction,
  markBought as markBoughtAction,
  restoreItem as restoreItemAction,
  unmarkBought as unmarkBoughtAction,
  updateItem as updateItemAction,
} from "@/actions/items";
import type { Item, ItemDraft } from "@/lib/types";

export function useWishlist(initialItems: Item[]) {
  const [items, setItems] = useState<Item[]>(initialItems);

  async function addItem(draft: ItemDraft): Promise<Item> {
    const created = await addItemAction(draft);
    setItems((prev) => [...prev, created]);
    return created;
  }

  async function updateItem(id: string, draft: ItemDraft): Promise<void> {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...draft } : i)),
    );
    await updateItemAction(id, draft);
  }

  async function removeItem(
    id: string,
  ): Promise<{ item: Item; index: number } | null> {
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    const item = items[index];
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteItemAction(id);
    return { item, index };
  }

  async function restoreItem(item: Item, index: number): Promise<void> {
    setItems((prev) => {
      const next = prev.slice();
      next.splice(Math.min(index, next.length), 0, item);
      return next;
    });
    await restoreItemAction(item);
  }

  async function markBought(id: string, price: number): Promise<void> {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "bought", price } : i)),
    );
    await markBoughtAction(id, price);
  }

  async function unmarkBought(id: string): Promise<void> {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "pending", price: null } : i,
      ),
    );
    await unmarkBoughtAction(id);
  }

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    restoreItem,
    markBought,
    unmarkBought,
  };
}
