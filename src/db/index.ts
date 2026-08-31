import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "Falta la variable de entorno DATABASE_URL (o POSTGRES_URL) para conectar a la base de datos.",
  );
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
