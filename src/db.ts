import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as _migrate } from "drizzle-orm/postgres-js/migrator";

const client = postgres(process.env.DB_URL || "");
export  const db =  drizzle(client);

