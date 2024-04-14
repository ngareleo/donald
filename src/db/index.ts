import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.db";

export const db = drizzle(postgres(process.env.DB_URL || ""), { schema });
