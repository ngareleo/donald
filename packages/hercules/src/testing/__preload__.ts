//  NOTE: Please do not include in index file. It is exclusive to the bunfig.toml for tests preloading
import { afterAll, beforeAll } from "bun:test";
import { EnvVars, loadConfigs } from "~/config";
import { setupNeonDatabaseConnection, migrateNeonDb } from "~/repository";
import { seedTransactionTypes } from "~/repository/seed";
import {
  createNeonBranch,
  loadNeonProject,
  destroyNeonTestingBranchDB,
  type NeonProject,
  CreatedBranchResponse,
  applyNeonTemplate,
} from "~/repository/neon";
import { authTemplate } from "./authTestingTemplate";

// TODO: Allow tests to run without network
// TODO: Reuse this work to setup our dev flow
// load env var from .env
const { neonApiKey, processEnvironment, neonDBConnectionTemplate, verbose } =
  loadConfigs();

if (!neonApiKey || !neonDBConnectionTemplate) {
  console.error("❗️ Missing Neon API Key. Stopping tests.");
  process.exit(-1);
}

const { preload } = authTemplate();
// Run post and pre
const { setup, cleanup } = usePreload({
  env: processEnvironment,
  apiKey: neonApiKey,
  verbose,
});

beforeAll(setup);
afterAll(cleanup);

/**
    Sets up testing environment before tests
    and cleans up after running tests consistently even after failure
*/
function usePreload(args: { apiKey: string; env: EnvVars; verbose?: boolean }) {
  const { apiKey, env, verbose } = args;
  let branch: CreatedBranchResponse | undefined;
  let mapesaProject: NeonProject | undefined | null;

  const cleanup = async () => {
    // delete the database
    const info = await destroyNeonTestingBranchDB({
      apiKey: apiKey!,
      branch: branch?.branch?.id || "",
      project: mapesaProject?.id || "",
    }).catch((e) => {
      console.error(`❗️ Couldn't cleanup the Neon DB!\n${JSON.stringify(e)}`);
    });
    console.info("✅ Cleanup successful. Cleanup info\n", verbose ? info : "");
  };

  const setup = async () => {
    console.log("🔌 Setting up connection with Neon DB");
    console.log("🔗 Pre-test cleanups executing");

    // Load the Mapesa project from Neon
    // TODO: Read from neon-cache.json
    mapesaProject = await loadNeonProject({ apiKey: apiKey! }).catch((e) => {
      console.error(
        `❗️ Couldn't load the Neon project! Stopping tests\n${JSON.stringify(e)}`,
      );
      // no cleanup needed
      process.exit(-1);
    });

    console.info(
      "🐳 Mapesa project loaded \n",
      verbose && env != "ci" ? mapesaProject : "", // hide this log in ci to avoid data leak
    );

    // We create a branch ID inside the project
    branch = await createNeonBranch({
      id: mapesaProject?.id || "",
      apiKey: apiKey!,
    }).catch((e) => {
      console.error(
        `❗️ Couldn't create a Neon branch for testing! Stopping tests\n${JSON.stringify(
          e,
        )}`,
      );
      // no cleanup needed
      process.exit(-1);
    });

    console.info("🐳 Branch db setup ", verbose ? branch : "");

    // connect to the database
    const [endpoint] = branch?.endpoints;
    const neonDbConnection = setupNeonDatabaseConnection({
      overrideURL: applyNeonTemplate(neonDBConnectionTemplate!, {
        key: "connection",
        value: endpoint?.host,
      }),
      cacheKey: "PreloadKey",
    });

    // run migrations
    await migrateNeonDb({ cacheKey: "PreloadKey" }).catch((e) => {
      console.error(
        `❗️ Couldn't run migrations on Neon!Tests will continue without seed data. Chance is the data already exists\n${JSON.stringify(
          e,
        )}`,
      );
    });

    // seed the database
    await seedTransactionTypes(neonDbConnection).catch((e) => {
      console.error(
        `❗️Couldn't run seed the Neon DB! Tests will continue without seed data. Chance is the data already exists\n${JSON.stringify(e)}`,
      );
    });

    // for auth template to work
    await preload();
  };

  return {
    setup,
    cleanup,
  };
}
