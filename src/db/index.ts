import { releases } from "@/db/schema/releases";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { env } from "@/lib/env";

export const dbSchema = {
  releases,
};

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const dbClient = drizzle(client, {
  schema: dbSchema,
});
