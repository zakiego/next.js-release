import type { Config } from "drizzle-kit";
import "dotenv/config";
import { env } from "@/lib/env";

export default {
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  driver: "libsql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
