/**The environment of the current running process. Its controlled by env variables */
export type Environment = "production" | "development" | "testing";
export type EnvVars = "prod" | "dev" | "test";

declare module "bun" {
  interface Env {
    DB_URL: string;
    TESTING_DB_URL: string;
    ENV: string;
    MIGRATIONS_FOLDER: string;
  }
}

export const loadConfigs = () => {
  const processEnvironment = process.env.ENV as EnvVars;
  const localDbURL = process.env.DB_URL;
  const testingDbUrl = process.env.TESTING_DB_URL;
  const migrationsFolder = process.env.MIGRATIONS_FOLDER;

  if (!processEnvironment) {
    console.error("⛔️ Missing process environment. Add ENV=dev|test|prod ");
    process.exit(-1);
  }

  return {
    migrationsFolder,
    processEnvironment,
    localDbURL,
    testingDbUrl,
  };
};

export type ApplicationConfigs = Readonly<ReturnType<typeof loadConfigs>>;
