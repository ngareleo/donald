import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle as PostgresJSDrizzle } from "drizzle-orm/postgres-js";
import { drizzle as NeonDrizzle } from "drizzle-orm/neon-http";
import { migrate as NeonMigrator } from "drizzle-orm/neon-http/migrator";
import { migrate as PostgresJSMigrator } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";
import { loadConfigs } from "../config";

export type NeonDBType = ReturnType<typeof NeonDrizzle>;
export type PostgresDBType = ReturnType<typeof PostgresJSDrizzle>;
export type DBConnectionType = [
  // add keys here to cache the db and retrieve later
  "CliDBType", // example
  "PreloadKey",
];
export type CacheDBKeyType =
  | ("testingConnection" | "prodConnection")
  | DBConnectionType[number];

export type CacheValueType = NeonDBType | PostgresDBType;

const {
  processEnvironment,
  testingDbURL,
  localDbURL,
  migrationsFolder,
  verbose,
} = loadConfigs();

// Cache for db instances
const connectionsCache = new Map<CacheDBKeyType, CacheValueType | undefined>();

/**
 * Creates a database instance, if already invoked, reuses open connection
 */
export function getDatabaseInstance(): CacheValueType {
  if (processEnvironment === "test") {
    // we look for the preload-cache key
    return connectionsCache.get("PreloadKey") || setupNeonDatabaseConnection();
  }
  return setupPostgresDatabaseConnection();
}

/**
 * Sets up a connection to the Neon Database
 * This db is for testing purposes only.
 */
export function setupNeonDatabaseConnection(args?: {
  overrideURL?: string;
  cacheKey?: CacheDBKeyType;
}): NeonDBType {
  const key = args?.cacheKey || "testingConnection";
  console.log("Key used ", key);

  // Look into cache for open connection
  const cachedConnection = connectionsCache.get(key);
  if (cachedConnection) {
    console.info("👍 Read from cache");
    return cachedConnection as unknown as NeonDBType; // I know more than you typescript butt out!
  }

  // missing connection so setting up with Neon Db
  // use a fallback in the env file if missing override URL to connect to
  const url = args?.overrideURL || testingDbURL;
  const neonDb = NeonDrizzle(neon(url), {
    schema,
    logger: verbose || false, // Basic logging to the stdout
  });

  console.info(`✅ New connection to Neon Db established using ${url}`);
  connectionsCache.set(key, neonDb);
  return connectionsCache.get(key) as unknown as NeonDBType; // I know more than you typescript butt out!
}

/**
 * Runs migrations on Neon db
 * For better perf run in the same process before `setupNeonDatabaseConnection`
 * because we cache the connection and this runs directly
 */
export async function migrateNeonDb(args?: {
  overrideURL?: string;
  cacheKey?: CacheDBKeyType;
}) {
  const neonDb = setupNeonDatabaseConnection({
    overrideURL: args?.overrideURL,
    cacheKey: args?.cacheKey,
  });
  await NeonMigrator(neonDb, { migrationsFolder });
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

  const postgresDb = PostgresJSDrizzle(postgres(localDbURL), {
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
  await PostgresJSMigrator(postDb, { migrationsFolder });

  console.info("🎒 Migrations on PostgresJS Db complete");
}
