import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle as PostgresJSDrizzle } from "drizzle-orm/postgres-js";
import { drizzle as NeonDrizzle } from "drizzle-orm/neon-http";
import { migrate as NeonMigrator } from "drizzle-orm/neon-http/migrator";
import { migrate as PostgresJSMigrator } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";
import type {
    CacheDBKeyType,
    CacheValueType,
    Config,
    DefaultConnectionType,
    GenericConnectionType,
    NeonDBType,
    PostgresDBType,
    PrivateConnectionType,
} from "./types";

type Props = {
    loadConfig: () => Config;
};

export class Connections {
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
    private static instance: Connections;

    private static genericLongLivedConnection: PostgresDBType;
    private static genericShortLivedConnection: NeonDBType;

    private static privateConnections = new Map();

    private constructor({ loadConfig }: Props) {
        Connections.loadConfig = loadConfig;
        Connections.configs = Connections.loadConfig();
    }

    public static getInstance(props?: Props): Connections | null {
        if (!Connections.instance && props) {
            Connections.instance = new Connections(props);
        }
        return Connections.instance;
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
            : this.getGenericShortLivedConnection();
    }

    /**
     * Should open a stable direct postgres db.
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
            : this.getGenericLongLivedConnection();
    }

    /**
     * Will log if verbose.
     * ❤️ Recommended to use backtick string formatting ❤️ (``)
     * */
    private static log(args: string) {
        const { verbose } = Connections.configs;
        if (verbose) {
            console.log("[repository]", args);
        }
    }

    private async getGenericLongLivedConnection(): Promise<GenericConnectionType> {
        const key = "genericLongLivedConnection" as const;
        const value =
            Connections.genericLongLivedConnection ||
            (() => {
                const { longLivedDbUrl, verbose } = Connections.configs;
                const db = Connections.createLongLivedDbConnection(
                    longLivedDbUrl,
                    verbose
                );
                Connections.genericLongLivedConnection = db;
                return db;
            })();

        return {
            key,
            value,
            migrate: async () => Connections.migrateLongLivedDb(value),
        };
    }

    private getGenericShortLivedConnection(): GenericConnectionType {
        const key = "genericShortLivedConnection" as const;
        const value =
            Connections.genericShortLivedConnection ||
            (() => {
                const { shortLivedDbUrl } = Connections.configs;
                const db =
                    Connections.createShortLivedDbConnection(shortLivedDbUrl);
                Connections.genericShortLivedConnection = db;
                return db;
            })();

        return {
            key,
            value,
            migrate: async () => Connections.migrateShortLivedDb(value),
        };
    }

    private getPrivateConnection(args: {
        url: string;
        key: string;
        type: DefaultConnectionType["key"];
    }): PrivateConnectionType {
        const { url, key, type } = args;
        const cache = Connections.privateConnections.get(key);
        const { verbose } = Connections.configs;
        const value = cache
            ? {
                  value: cache,
                  migrate:
                      type === "sl-connection"
                          ? async () =>
                                await Connections.migrateShortLivedDb(cache)
                          : async () =>
                                await Connections.migrateLongLivedDb(cache),
              }
            : type === "sl-connection"
              ? (() => {
                    const db = Connections.createShortLivedDbConnection(
                        url,
                        verbose
                    );
                    Connections.privateConnections.set(key, db);
                    return {
                        value: db,
                        migrate: async () =>
                            await Connections.migrateShortLivedDb(db),
                    };
                })()
              : (() => {
                    const db = Connections.createLongLivedDbConnection(
                        url,
                        verbose
                    );
                    Connections.privateConnections.set(key, db);
                    return {
                        value: db,
                        migrate: async () =>
                            await Connections.migrateLongLivedDb(db),
                    };
                })();

        return {
            ...value,
            key,
        };
    }

    private static createShortLivedDbConnection(url: string, verbose = false) {
        const db = NeonDrizzle(neon(url), {
            schema,
            logger: verbose || false, // Basic logging to the stdout
        });
        Connections.log(`New connection to Neon Db established using ${url}`);

        return db;
    }

    private static createLongLivedDbConnection(url: string, verbose = false) {
        const db = PostgresJSDrizzle(postgres(url), {
            schema,
            logger: verbose,
        });
        Connections.log(`New connection to Neon Db established using ${url}`);
        return db;
    }

    private static async migrateLongLivedDb(db: PostgresDBType) {
        const { migrationsFolder } = Connections.configs;
        await PostgresJSMigrator(db, {
            migrationsFolder,
        });
        console.info("🎒 Migrations on PostgresJS Db complete");
    }

    private static async migrateShortLivedDb(db: NeonDBType) {
        const { migrationsFolder } = Connections.configs;
        await NeonMigrator(db, { migrationsFolder });
        console.info("🎒 Migrations on NeonDB complete!");
    }

    /**
     * * @ deprecated
     * Sets up a connection to the Neon Database
     * This db is for testing purposes only.
     */
    setupNeonDatabaseConnection(args?: {
        overrideURL?: string;
        cacheKey?: CacheDBKeyType;
    }): NeonDBType {
        const { shortLivedDbUrl: testingDbURL, verbose } = Connections.configs;
        const connectionsCache = Connections.connectionsCache;
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
     * * @ deprecated
     * Creates a database instance, if already invoked, reuses open connection
     */
    getDatabaseInstance(): CacheValueType {
        const { processEnvironment } = Connections.configs;
        if (processEnvironment === "test") {
            // we look for the preload-cache key
            return (
                Connections.connectionsCache.get("PreloadKey") ||
                this.setupNeonDatabaseConnection()
            );
        }
        return this.setupPostgresDatabaseConnection();
    }

    /**
     * * @ deprecated
     * Runs migrations on Neon db
     * For better perf run in the same process before `setupNeonDatabaseConnection`
     * because we cache the connection and this runs directly
     */
    async migrateNeonDb(args?: {
        overrideURL?: string;
        cacheKey?: CacheDBKeyType;
    }) {
        const { migrationsFolder } = Connections.configs;
        const neonDb = this.setupNeonDatabaseConnection({
            overrideURL: args?.overrideURL,
            cacheKey: args?.cacheKey,
        });
        await NeonMigrator(neonDb, { migrationsFolder });
        console.info("🎒 Migrations on NeonDB complete!");
    }

    /**
     * @ deprecated
     * Sets up a connection to `DB_URL` using PostgresJS.
     * Currently used for prod, dev
     */
    setupPostgresDatabaseConnection(): PostgresDBType {
        const prodKey = "prodConnection";
        const { longLivedDbUrl: localDbURL } = Connections.configs;
        const connectionsCache = Connections.connectionsCache;

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
     * * @ deprecated
     * Runs migrations on a PostgresJS Database
     */
    async migratePostgresDb() {
        const { migrationsFolder } = Connections.configs;
        const postDb = this.setupPostgresDatabaseConnection();
        await PostgresJSMigrator(postDb, { migrationsFolder });
        console.info("🎒 Migrations on PostgresJS Db complete");
    }
}
