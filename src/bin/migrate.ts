import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "../db";

await migrate(db, { migrationsFolder: "supabase/migrations" });
await client.end();
