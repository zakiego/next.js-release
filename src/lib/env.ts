import { z } from "zod";
import "dotenv/config";

export const env = z
  .object({
    DATABASE_URL: z.string(),
    DATABASE_AUTH_TOKEN: z.string(),
  })
  .parse(process.env);
