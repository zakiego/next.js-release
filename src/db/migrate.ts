import { migrate } from "drizzle-orm/libsql/migrator";
import { dbClient } from "./index";

const main = async () => {
  try {
    // This will run migrations on the database, skipping the ones already applied
    await migrate(dbClient, { migrationsFolder: "./src/db/migrations" });

    console.log("Migration successful");
  } catch (error) {
    console.log("Migration failed", error);
  }
};

main();
