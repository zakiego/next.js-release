import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { releases } from "@/db/schema/releases";

export const DATABASE_URL = "sqlite.db";

export const dbSchema = {
  releases,
};

export const sqlite = new Database(DATABASE_URL);

export const dbClient = drizzle(sqlite, {
  schema: dbSchema,
});
