import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle as PostgresJSDrizzle } from "drizzle-orm/postgres-js";
import { drizzle as NeonDrizzle } from "drizzle-orm/neon-http";
import { migrate as NeonMigrator } from "drizzle-orm/neon-http/migrator";
import { migrate as PostgresJSMigrator } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";
import { EnvVars } from "~/types";

const testingDbUrl = process.env.TESTING_DB_URL;
const localDbUrl = process.env.DB_URL;
const processEnvironment = process.env.ENV as EnvVars;

export type NeonDBType = ReturnType<typeof NeonDrizzle>;
export type PostgresDBType = ReturnType<typeof PostgresJSDrizzle>;

// Our cache for db connections
const connectionsCache = new Map<
  "testingConnection" | "prodConnection",
  NeonDBType | PostgresDBType | undefined
>();

/**
 * Creates a database instance, if already invoked, reuses open connection
 */
export function getDatabaseInstance() {
  return processEnvironment === "test"
    ? setupNeonDatabaseConnection()
    : setupPostgresDatabaseConnection();
}

/**
 * Sets up a connection to the Neon Database
 * This db is for testing purposes only.
 */
export function setupNeonDatabaseConnection(): NeonDBType {
  const testKey = "testingConnection";

  // Look into cache for open connection
  const cachedConnection = connectionsCache.get(testKey);
  if (cachedConnection) {
    return cachedConnection as unknown as NeonDBType; // I know more than you typescript butt out!
  }

  // missing connection so setting up with Neon Db
  const neonDb = NeonDrizzle(neon(testingDbUrl), {
    schema,
    logger: true, // Basic logging to the stdout
  });
  console.info("✅ Connection to Neon Db established");

  connectionsCache.set(testKey, neonDb);
  return connectionsCache.get(testKey) as unknown as NeonDBType; // I know more than you typescript butt out!
}

/**
 * Runs migrations on Neon db
 * For better perf run in the same process before `setupNeonDatabaseConnection`
 * because we cache the connection and this runs directly
 */
export async function migrateNeonDb() {
  const neonDb = setupNeonDatabaseConnection();
  await NeonMigrator(neonDb, { migrationsFolder: "supabase/migrations" });
  console.info("🎒 Migrations on NeonDB complete!");
}

/**
 * Sets up a connection to `DB_URL` using PostgresJS.
 * Currently used for prod, dev
 */
export function setupPostgresDatabaseConnection(): PostgresDBType {
  const prodKey = "prodConnection";

  const cachedConnection = connectionsCache.get(prodKey);
  if (cachedConnection) {
    return cachedConnection as unknown as PostgresDBType;
  }

  const postgresDb = PostgresJSDrizzle(postgres(localDbUrl), {
    schema,
  });
  console.info("✅ Connection to Postgres database established");

  connectionsCache.set(prodKey, postgresDb);
  return connectionsCache.get(prodKey) as unknown as PostgresDBType;
}

/**
 * Runs migrations on the PostgresJS Database
 */
export async function migratePostgresDb() {
  const postDb = setupPostgresDatabaseConnection();
  await PostgresJSMigrator(postDb, { migrationsFolder: "supabase/migrations" });

  console.info("🎒 Migrations on PostgresJS Db complete");
}
