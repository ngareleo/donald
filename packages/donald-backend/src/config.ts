import { stringToBoolean } from "./utils";

/**The environment of the current running process. Its controlled by env variables */
export type EnvVars = "prod" | "dev" | "test" | "ci";

declare module "bun" {
  interface Env {
    DB_URL: string;
    TESTING_DB_URL: string;
    ENV: string;
    MIGRATIONS_FOLDER: string;
    NEON_API_KEY: string;
    NEON_DB_CONNECTION_TEMPLATE: string;
    VERBOSE: string;
  }
}

/** Application-wide configurations derived from the .env file */
export type ApplicationConfigs = Readonly<
  Required<{
    // if a config is needed in every environment add it here
    processEnvironment: EnvVars;
    localDbURL: string;
    testingDbURL: string;
    migrationsFolder: string;
    verbose: boolean;
  }> &
    Partial<{
      // if its not needed in every environment put here
      neonApiKey: string;
      neonDBConnectionTemplate: string;
    }>
>;

export function loadConfigs(): ApplicationConfigs {
  const processEnvironment = process.env.ENV as EnvVars;
  const localDbURL = process.env.DB_URL;
  const testingDbURL = process.env.TESTING_DB_URL;
  const migrationsFolder = process.env.MIGRATIONS_FOLDER;
  const neonDBConnectionTemplate = process.env.NEON_DB_CONNECTION_TEMPLATE;
  const verbose = process.env.VERBOSE;

  const basic = {
    migrationsFolder,
    processEnvironment,
    localDbURL,
    testingDbURL,
    verbose: stringToBoolean(verbose),
  };

  if (!processEnvironment) {
    console.error("⛔️ Missing process environment. Add ENV=dev|test|prod ");
    process.exit(-1);
  }

  if (processEnvironment === "test") {
    const testConfigs = {
      ...basic,
      neonApiKey: process.env.NEON_API_KEY,
      neonDBConnectionTemplate,
    };

    console.info("🌥️ Test env configs loaded ", verbose ? testConfigs : "");
    return testConfigs;
  }

  return basic;
}
