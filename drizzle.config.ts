import type { Config } from "drizzle-kit";
import "dotenv/config";
import { DATABASE_URL } from "@/db";

export default {
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
