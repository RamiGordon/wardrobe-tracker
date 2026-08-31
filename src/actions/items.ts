"use server";

import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { items as itemsTable } from "@/db/schema";
import type { Item, ItemDraft } from "@/lib/types";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No autenticado");
  return userId;
}

function toItem(row: typeof itemsTable.$inferSelect): Item {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Item["category"],
    brand: row.brand,
    estPrice: row.estPrice,
    price: row.price,
    status: row.status as Item["status"],
    photo: row.photo,
    createdAt: row.createdAt.getTime(),
  };
}

export async function getItems(): Promise<Item[]> {
  const userId = await requireUserId();
  const rows = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.userId, userId));
  return rows.map(toItem);
}

export async function addItem(draft: ItemDraft): Promise<Item> {
  const userId = await requireUserId();
  const [row] = await db
    .insert(itemsTable)
    .values({
      userId,
      name: draft.name,
      category: draft.category,
      brand: draft.brand,
      estPrice: draft.estPrice,
      price: null,
      status: "pending",
      photo: draft.photo,
    })
    .returning();
  return toItem(row);
}

export async function updateItem(
  id: string,
  patch: ItemDraft,
): Promise<void> {
  const userId = await requireUserId();
  await db
    .update(itemsTable)
    .set({
      name: patch.name,
      category: patch.category,
      brand: patch.brand,
      estPrice: patch.estPrice,
      photo: patch.photo,
    })
    .where(and(eq(itemsTable.id, id), eq(itemsTable.userId, userId)));
}

export async function deleteItem(id: string): Promise<void> {
  const userId = await requireUserId();
  await db
    .delete(itemsTable)
    .where(and(eq(itemsTable.id, id), eq(itemsTable.userId, userId)));
}

// Reinserta un item ya borrado (usado por "Deshacer"), preservando su id y datos originales.
export async function restoreItem(item: Item): Promise<Item> {
  const userId = await requireUserId();
  const [row] = await db
    .insert(itemsTable)
    .values({
      id: item.id,
      userId,
      name: item.name,
      category: item.category,
      brand: item.brand,
      estPrice: item.estPrice,
      price: item.price,
      status: item.status,
      photo: item.photo,
      createdAt: new Date(item.createdAt),
    })
    .returning();
  return toItem(row);
}

export async function markBought(id: string, price: number): Promise<void> {
  const userId = await requireUserId();
  await db
    .update(itemsTable)
    .set({ status: "bought", price })
    .where(and(eq(itemsTable.id, id), eq(itemsTable.userId, userId)));
}

export async function unmarkBought(id: string): Promise<void> {
  const userId = await requireUserId();
  await db
    .update(itemsTable)
    .set({ status: "pending", price: null })
    .where(and(eq(itemsTable.id, id), eq(itemsTable.userId, userId)));
}
