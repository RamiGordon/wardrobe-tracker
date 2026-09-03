"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { Category, Item, ItemDraft } from "@/lib/types";
import { useWishlist } from "@/hooks/useWishlist";
import { Header } from "./Header";
import { StatusFilter, type StatusTabValue } from "./StatusFilter";
import { CategoryTabs } from "./CategoryTabs";
import { CategorySection } from "./CategorySection";
import { EmptyState } from "./EmptyState";
import { Fab } from "./Fab";
import { AddEditSheet } from "./AddEditSheet";
import { BuySheet } from "./BuySheet";
import { PhotoLightbox } from "./PhotoLightbox";
import { Toast, type ToastData } from "./Toast";

interface WardrobeAppProps {
  initialItems: Item[];
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  };
}

export function WardrobeApp({ initialItems, user }: WardrobeAppProps) {
  const {
    items,
    addItem,
    updateItem,
    removeItem,
    restoreItem,
    markBought,
    unmarkBought,
  } = useWishlist(initialItems);

  const [activeStatusTab, setActiveStatusTab] = useState<StatusTabValue>("Todas");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("Todas");

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [addEditToken, setAddEditToken] = useState(0);
  const [buySheetItemId, setBuySheetItemId] = useState<string | null>(null);
  const [buySheetToken, setBuySheetToken] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [toastData, setToastData] = useState<ToastData | null>(null);

  function showToast(message: string, onUndo?: () => void) {
    setToastData({ message, onUndo });
  }

  // ---------- derived state ----------
  const bought = items.filter((i) => i.status === "bought");
  const total = bought.reduce((s, i) => s + (Number(i.price) || 0), 0);

  function statusFiltered(list: Item[]) {
    if (activeStatusTab === "Pendientes") return list.filter((i) => i.status !== "bought");
    if (activeStatusTab === "Compradas") return list.filter((i) => i.status === "bought");
    return list;
  }

  const pool = statusFiltered(items);
  const categoryCounts: Record<string, number> = { Todas: pool.length };
  CATEGORIES.forEach((c) => {
    categoryCounts[c] = pool.filter((i) => i.category === c).length;
  });

  const categoryTabLabels = [
    "Todas",
    ...CATEGORIES.filter((c) => categoryCounts[c] > 0 || c === activeCategoryTab),
  ];
  const effectiveCategoryTab = categoryTabLabels.includes(activeCategoryTab)
    ? activeCategoryTab
    : "Todas";
  const categoryTabs = categoryTabLabels.map((label) => ({
    label,
    count: categoryCounts[label] ?? 0,
  }));

  const filtered =
    effectiveCategoryTab === "Todas"
      ? pool
      : pool.filter((i) => i.category === effectiveCategoryTab);

  const editingItem = editingItemId ? (items.find((i) => i.id === editingItemId) ?? null) : null;
  const buySheetItem = buySheetItemId ? (items.find((i) => i.id === buySheetItemId) ?? null) : null;

  // ---------- add / edit sheet ----------
  function openAddSheet() {
    setEditingItemId(null);
    setAddEditOpen(true);
    setAddEditToken((t) => t + 1);
  }
  function openEditSheet(id: string) {
    setEditingItemId(id);
    setAddEditOpen(true);
    setAddEditToken((t) => t + 1);
  }
  function closeAddEditSheet() {
    setAddEditOpen(false);
  }

  async function handleSaveItem(draft: ItemDraft) {
    if (editingItemId) {
      await updateItem(editingItemId, draft);
      setAddEditOpen(false);
      showToast("Cambios guardados ✓");
    } else {
      await addItem(draft);
      setActiveCategoryTab(draft.category);
      setActiveStatusTab("Todas");
      setAddEditOpen(false);
      showToast("Agregada a la wishlist ✓");
    }
  }

  // ---------- delete + undo ----------
  function handleDelete(id: string) {
    removeItem(id).then((result) => {
      if (!result) return;
      showToast("Prenda eliminada", () => {
        restoreItem(result.item, result.index);
      });
    });
  }

  // ---------- buy sheet ----------
  function openBuySheet(id: string) {
    setBuySheetItemId(id);
    setBuySheetToken((t) => t + 1);
  }
  function closeBuySheet() {
    setBuySheetItemId(null);
  }
  async function handleConfirmBuy(price: number) {
    if (!buySheetItemId) return;
    await markBought(buySheetItemId, price);
    setBuySheetItemId(null);
    showToast("Compra confirmada ✓");
  }
  async function handleUnmark() {
    if (!buySheetItemId) return;
    await unmarkBought(buySheetItemId);
    setBuySheetItemId(null);
    showToast("Desmarcada");
  }

  // ---------- lightbox ----------
  function openLightbox(src: string, name: string) {
    setLightbox({ src, alt: name });
  }
  function closeLightbox() {
    setLightbox(null);
  }

  return (
    <>
      <Header
        user={user}
        wishlistSummary={{ total, boughtCount: bought.length, itemCount: items.length }}
      />

      <StatusFilter
        active={activeStatusTab}
        counts={{
          Todas: items.length,
          Pendientes: items.filter((i) => i.status !== "bought").length,
          Compradas: items.filter((i) => i.status === "bought").length,
        }}
        onChange={setActiveStatusTab}
      />

      <CategoryTabs
        tabs={categoryTabs}
        active={effectiveCategoryTab}
        onChange={setActiveCategoryTab}
      />

      <main>
        {items.length === 0 ? (
          <EmptyState variant="no-items" />
        ) : filtered.length === 0 ? (
          <EmptyState variant="no-matches" />
        ) : effectiveCategoryTab === "Todas" ? (
          CATEGORIES.map((cat) => {
            const catItems = filtered.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <CategorySection
                key={cat}
                category={cat}
                items={catItems}
                onEdit={openEditSheet}
                onPhotoClick={openLightbox}
                onMarkBought={openBuySheet}
                onDelete={handleDelete}
              />
            );
          })
        ) : (
          <CategorySection
            category={null}
            items={filtered}
            onEdit={openEditSheet}
            onPhotoClick={openLightbox}
            onMarkBought={openBuySheet}
            onDelete={handleDelete}
          />
        )}
      </main>

      <Fab onClick={openAddSheet} />

      <AddEditSheet
        key={addEditToken}
        open={addEditOpen}
        mode={editingItemId ? "edit" : "add"}
        initial={
          editingItem
            ? {
                name: editingItem.name,
                category: editingItem.category,
                brand: editingItem.brand,
                estPrice: editingItem.estPrice,
                photo: editingItem.photo,
              }
            : null
        }
        defaultCategory={
          (effectiveCategoryTab !== "Todas" ? effectiveCategoryTab : "Pantalones") as Category
        }
        onCancel={closeAddEditSheet}
        onSave={handleSaveItem}
        onPhotoError={(message) => showToast(message)}
      />

      <BuySheet
        key={buySheetToken}
        open={buySheetItemId !== null}
        item={buySheetItem}
        onCancel={closeBuySheet}
        onConfirm={handleConfirmBuy}
        onUnmark={handleUnmark}
      />

      <PhotoLightbox src={lightbox?.src ?? null} alt={lightbox?.alt ?? ""} onClose={closeLightbox} />

      <Toast data={toastData} />
    </>
  );
}
