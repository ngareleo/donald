import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, adminConnection } from "../db";

await migrate(db, { migrationsFolder: "supabase/migrations" });
await adminConnection.end();
