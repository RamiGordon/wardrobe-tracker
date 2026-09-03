export type Category =
  | "Pantalones"
  | "Remeras"
  | "Sweaters y camisas"
  | "Camperas y abrigos"
  | "Calzado"
  | "Accesorios"
  | "Otros";

export type Status = "pending" | "bought";

export interface Item {
  id: string;
  name: string;
  category: Category;
  brand: string;
  estPrice: number | null;
  price: number | null;
  status: Status;
  photo: string | null;
  createdAt: number;
}

export interface ItemDraft {
  name: string;
  category: Category;
  brand: string;
  estPrice: number | null;
  photo: string | null;
}

export interface Outfit {
  id: string;
  photo: string;
  createdAt: number;
}
