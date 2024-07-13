import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle as PostgresJSDrizzle } from "drizzle-orm/postgres-js";
import { drizzle as NeonDrizzle } from "drizzle-orm/neon-http";
import { migrate as NeonMigrator } from "drizzle-orm/neon-http/migrator";
import { migrate as PostgresJSMigrator } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";

// Todo: Decouple this file from server pkg

type Config = {
    processEnvironment: string;
    shortLivedDbUrl: string;
    longLivedDbUrl: string;
    migrationsFolder: string;
    verbose: boolean;
};

type Props = {
    loadConfig: () => Config;
};

export type NeonDBType = ReturnType<typeof NeonDrizzle>;
export type PostgresDBType = ReturnType<typeof PostgresJSDrizzle>;

type PrivateConnectionType = {
    cacheKey: string;
    value: DefaultConnectionType["value"];
    migrate: () => Promise<void>;
};

type DefaultConnectionType =
    | { key: "ll-connection"; value: PostgresDBType }
    | { key: "sl-connection"; value: NeonDBType };

type GenericConnectionType =
    | {
          key: "genericShortLivedConnection";
          value: NeonDBType;
          migrate: () => Promise<void>;
      }
    | {
          key: "genericLongLivedConnection";
          value: PostgresDBType;
          migrate: () => Promise<void>;
      };

function openShortLivedConnection() {}

export type DBConnectionType = [
    // add keys here to cache the db and retrieve later
    "CliDBType", // example
    "PreloadKey",
];
export type CacheDBKeyType =
    | ("testingConnection" | "prodConnection")
    | DBConnectionType[number];

export type CacheValueType = NeonDBType | PostgresDBType;

export class Repository {
    /**
     * Ideally we have two types of DBs (Neon and Postgresql)
     * This information is not abstracted from this module
     * But we know that
     * prod => postgres url
     * dev => supabase url
     * test => neon
     *
     * Each db has a key, by giving a key you get the db. We reuse connections when dealing
     * with duplicate requests
     *
     * To avoid sharing a connection, you can provide an override url to a postgres db and a unique key
     * On a process, only a single instance of repository will exist.
     * This constraint is to avoid dealing with race conditions all together.
     * Ideally, we have only a single object of Prototype ::> Repository.
     */

    // Cache for db instances
    private static connectionsCache = new Map<
        CacheDBKeyType,
        CacheValueType | undefined
    >();
    private static loadConfig: Props["loadConfig"] | undefined;
    private static configs: Config;
    private static instance: Repository;

    private static genericConnections = new Map<
        GenericConnectionType["key"],
        GenericConnectionType["value"]
    >();
    private static privateConnections = new Map();

    constructor({ loadConfig }: Props) {
        Repository.loadConfig = loadConfig;
        Repository.configs = Repository.loadConfig();
    }

    public static getInstance(props: Props): Repository {
        if (!Repository.instance) {
            Repository.instance = new Repository(props);
        }
        return Repository.instance;
    }

    /**
     * Should open a neon db:
     * Neon DB's are intended to be quick short lived throw-away connections
     * Ideal for tests.
     *
     * It takes a url or a key.
     * If its a key, it retrieves a connection.
     *      If a key misses, we return null
     *
     * If its a url, we return a postgres connection to the db
     *      If a url also misses, we return null by default
     *
     * No key or url is provided, it provides a generic open neon db connection.
     * This generic connection is reused, unless closed.
     */
    getShortLivedConnection(args?: {
        overrideURL?: string;
        cacheKey?: CacheDBKeyType;
    }) {
        return args
            ? this.getPrivateConnection({
                  url: args.overrideURL || "",
                  key: args.cacheKey || "",
                  type: "ll-connection",
              })
            : this.getGenericLLConnection();
    }

    /**
     * Should open a stable direct postgres db.
     * These are ideal for
     * Ideal for tests.
     *
     * It takes a url or a key.
     * If its a key, it retrieves a connection.
     *      If a key misses, we return null
     *
     * If its a url, we return a postgres connection to the db
     *      If a url also misses, we return null by default
     *
     * No key or url is provided, it provides a generic open neon db connection.
     * This generic connection is reused, unless closed.
     */
    getLongLivedDBConnection(args?: {
        overrideURL?: string;
        cacheKey?: CacheDBKeyType;
    }) {
        return args
            ? this.getPrivateConnection({
                  url: args.overrideURL || "",
                  key: args.cacheKey || "",
                  type: "sl-connection",
              })
            : this.getGenericSLConnection();
    }

    /**
     * Will log if verbose.
     * ❤️ Recommended to use backtick string formatting ❤️ (``)
     * */
    private static log(args: string) {
        const { verbose } = Repository.configs;
        if (verbose) {
            console.log("[repository]", args);
        }
    }

    private async getGenericLLConnection(): Promise<GenericConnectionType> {
        const key = "genericLongLivedConnection" as const;
        const cache = Repository.genericConnections.get(key);
        const value = cache
            ? cache
            : (() => {
                  const { longLivedDbUrl: url, verbose } = Repository.configs;
                  const db = NeonDrizzle(neon(url), {
                      schema,
                      logger: verbose || false, // Basic logging to the stdout
                  });
                  Repository.log(
                      `New connection to Neon Db established using ${url}`
                  );
                  Repository.genericConnections.set(key, db);
                  return db;
              })();

        const { migrationsFolder } = Repository.configs;
        const migrate = async () => {
            await PostgresJSMigrator(value, { migrationsFolder });
            console.info("🎒 Migrations on PostgresJS Db complete");
        };

        return { key, value, migrate };
    }

    private getGenericSLConnection(): GenericConnectionType {
        const key = "genericShortLivedConnection" as const;
        const cache = Repository.genericConnections.get(key);
        const value = cache
            ? cache
            : (() => {
                  const { shortLivedDbUrl: url } = Repository.configs;
                  const db = PostgresJSDrizzle(postgres(url), {
                      schema,
                  });
                  Repository.log(
                      `New connection to Neon Db established using ${url}`
                  );
                  Repository.genericConnections.set(key, db);

                  return db;
              })();
        const { migrationsFolder } = Repository.configs;
        const migrate = async () => {
            await NeonMigrator(value, { migrationsFolder });
            console.info("🎒 Migrations on NeonDB complete!");
        };

        return { key, value, migrate };
    }

    private getPrivateConnection(args: {
        url: string;
        key: string;
        type: DefaultConnectionType["key"];
    }) {
        const { url, key, type } = args;
        const { migrationsFolder } = Repository.configs;
        const cache = Repository.genericConnections.get(key);
        const value =
            cache ?? type === "sl-connection"
                ? (() => {
                      const { longLivedDbUrl: url, verbose } =
                          Repository.configs;
                      const db = NeonDrizzle(neon(url), {
                          schema,
                          logger: verbose || false, // Basic logging to the stdout
                      });
                      Repository.log(
                          `New connection to Neon Db established using ${url}`
                      );
                      Repository.genericConnections.set(key, db);
                      return db;
                  })()
                : (() => {
                      const db = PostgresJSDrizzle(postgres(url), {
                          schema,
                      });
                      Repository.log(
                          `New connection to Neon Db established using ${url}`
                      );
                      Repository.genericConnections.set(key, db);

                      return db;
                  })();

        const migrate =
            type === "sl-connection"
                ? async () => {
                      await NeonMigrator(value, { migrationsFolder });
                      console.info("🎒 Migrations on NeonDB complete!");
                  }
                : async () => {
                      await PostgresJSMigrator(value, { migrationsFolder });
                      console.info("🎒 Migrations on PostgresJS Db complete");
                  };

        return {
            key,
            value,
            migrate,
        };
    }

    /**
     * Sets up a connection to the Neon Database
     * This db is for testing purposes only.
     */
    setupNeonDatabaseConnection(args?: {
        overrideURL?: string;
        cacheKey?: CacheDBKeyType;
    }): NeonDBType {
        const { shortLivedDbUrl: testingDbURL, verbose } = Repository.configs;
        const connectionsCache = Repository.connectionsCache;
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
     * Creates a database instance, if already invoked, reuses open connection
     */
    getDatabaseInstance(): CacheValueType {
        const { processEnvironment } = Repository.configs;
        if (processEnvironment === "test") {
            // we look for the preload-cache key
            return (
                Repository.connectionsCache.get("PreloadKey") ||
                this.setupNeonDatabaseConnection()
            );
        }
        return this.setupPostgresDatabaseConnection();
    }

    /**
     * Runs migrations on Neon db
     * For better perf run in the same process before `setupNeonDatabaseConnection`
     * because we cache the connection and this runs directly
     */
    async migrateNeonDb(args?: {
        overrideURL?: string;
        cacheKey?: CacheDBKeyType;
    }) {
        const { migrationsFolder } = Repository.configs;
        const neonDb = this.setupNeonDatabaseConnection({
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
    setupPostgresDatabaseConnection(): PostgresDBType {
        const prodKey = "prodConnection";
        const { longLivedDbUrl: localDbURL } = Repository.configs;
        const connectionsCache = Repository.connectionsCache;

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
     * Runs migrations on a PostgresJS Database
     */
    async migratePostgresDb(args: { key: string }) {
        const { migrationsFolder } = Repository.configs;
        const postDb = this.setupPostgresDatabaseConnection();
        await PostgresJSMigrator(postDb, { migrationsFolder });
        console.info("🎒 Migrations on PostgresJS Db complete");
    }
}
