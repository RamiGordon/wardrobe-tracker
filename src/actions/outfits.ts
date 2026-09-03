"use server";

import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { outfits as outfitsTable } from "@/db/schema";
import type { Outfit } from "@/lib/types";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No autenticado");
  return userId;
}

function toOutfit(row: typeof outfitsTable.$inferSelect): Outfit {
  return {
    id: row.id,
    photo: row.photo,
    createdAt: row.createdAt.getTime(),
  };
}

export async function getOutfits(): Promise<Outfit[]> {
  const userId = await requireUserId();
  const rows = await db
    .select()
    .from(outfitsTable)
    .where(eq(outfitsTable.userId, userId))
    .orderBy(desc(outfitsTable.createdAt));
  return rows.map(toOutfit);
}

export async function addOutfit(photo: string): Promise<Outfit> {
  const userId = await requireUserId();
  const [row] = await db
    .insert(outfitsTable)
    .values({ userId, photo })
    .returning();
  return toOutfit(row);
}

export async function deleteOutfit(id: string): Promise<void> {
  const userId = await requireUserId();
  await db
    .delete(outfitsTable)
    .where(and(eq(outfitsTable.id, id), eq(outfitsTable.userId, userId)));
}

// Reinserta un outfit ya borrado (usado por "Deshacer"), preservando su id y foto.
export async function restoreOutfit(outfit: Outfit): Promise<Outfit> {
  const userId = await requireUserId();
  const [row] = await db
    .insert(outfitsTable)
    .values({
      id: outfit.id,
      userId,
      photo: outfit.photo,
      createdAt: new Date(outfit.createdAt),
    })
    .returning();
  return toOutfit(row);
}
