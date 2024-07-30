import { drizzle as PostgresJSDrizzle } from "drizzle-orm/postgres-js";
import { drizzle as NeonDrizzle } from "drizzle-orm/neon-http";

export type Config = {
    processEnvironment: string;
    shortLivedDbUrl: string;
    longLivedDbUrl: string;
    migrationsFolder: string;
    verbose: boolean;
};
export type NeonDBType = ReturnType<typeof NeonDrizzle>;
export type PostgresDBType = ReturnType<typeof PostgresJSDrizzle>;
export type PrivateConnectionType = {
    key: string;
    value: DefaultConnectionType["value"];
    migrate: () => Promise<void>;
};
export type DefaultConnectionType =
    | { key: "ll-connection"; value: PostgresDBType }
    | { key: "sl-connection"; value: NeonDBType };
export type GenericConnectionType =
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
export type DBConnectionType = [
    // add keys here to cache the db and retrieve later
    "CliDBType", // example
    "PreloadKey",
];
export type CacheDBKeyType =
    | ("testingConnection" | "prodConnection")
    | DBConnectionType[number];
export type CacheValueType = NeonDBType | PostgresDBType;
