import App from "./app";
import { EnvVars } from "~/types";

declare module "bun" {
  interface Env {
    DB_URL: string;
    TESTING_DB_URL: string;
    ENV: string;
  }
}

const processEnvironment = process.env.ENV as EnvVars;
const localDbURL = process.env.DB_URL;

if (
  (processEnvironment === "dev" || processEnvironment === "test") &&
  !localDbURL
) {
  throw Error("Db setting missing!");
}

function startApplication() {
  const application = App;
  application.listen(process.env.PORT || 3000);
  const env = import.meta.env["ENV"];
  if (env && env === "dev") {
    console.log(
      `🦊 Elysia is running at http://${application.server?.hostname}:${application.server?.port}`
    );
  }
}

startApplication();
