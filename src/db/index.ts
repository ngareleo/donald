import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema.db";

export const connection = postgres(process.env.DB_URL || "");
export const adminConnection = postgres(process.env.ADMIN_DB_URL || "");
export const db = drizzle(connection, { schema });
