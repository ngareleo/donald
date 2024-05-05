import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

const adminDbConnection = postgres(process.env.ADMIN_DB_URL || "");
const client = drizzle(adminDbConnection, { schema });

migrate(client, { migrationsFolder: "supabase/migrations" }).then(() =>
  adminDbConnection.end()
);
