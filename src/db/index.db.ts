import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema.db";

const client = postgres(process.env.DB_URL || "");
export const db = drizzle(client, { schema });
