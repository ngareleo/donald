//  NOTE: Please do not include in index file. It is exclusive to the bunfig.toml for tests preloading
import { afterAll, beforeAll } from "bun:test";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { EnvVars, loadConfigs } from "~/config";
import { setupNeonDatabaseConnection, migrateNeonDb } from "~/repository";
import { seedTransactionTypes } from "~/repository/seed";
import {
  createNeonBranch,
  loadNeonProject,
  destroyNeonTestingBranchDB,
  type NeonProject,
  CreatedBranchResponse,
} from "~/repository/neon";

const { neonApiKey, processEnvironment } = loadConfigs();

if (!neonApiKey) {
  console.error("❗️ Missing Neon API Key. Stopping tests.");
  process.exit(-1);
}

const { setup, cleanup } = usePreload({ env: processEnvironment, neonApiKey });
beforeAll(setup);
afterAll(cleanup);

// sets up env before tests and cleans up after running tests consistently even after failure
function usePreload(args: { neonApiKey: string; env: EnvVars }) {
  const { neonApiKey, env } = args;
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });
  const temp = "test-dev-db";
  let branch: CreatedBranchResponse | undefined;
  let mapesaProject: NeonProject | undefined | null;

  // TODO: Allow tests to run without network
  // TODO: Reuse this work to setup our dev flow

  const cleanup = async () => {
    // delete the database

    await destroyNeonTestingBranchDB({
      apiKey: neonApiKey!,
      branchID,
      projectID: mapesaProject?.id || "",
      dbName: neonDB?.id || "",
    }).catch((e) => {
      console.error(`❗️ Couldn't cleanup the Neon DB!\n${JSON.stringify(e)}`);
    });
  };

  const setup = async () => {
    console.log("🔌 Setting up connection with Neon DB");

    // Load the Mapesa project from Neon
    mapesaProject = await loadNeonProject({ apiKey: neonApiKey! }).catch(
      (e) => {
        console.error(
          `❗️ Couldn't load the Neon project! Stopping tests\n${JSON.stringify(e)}`,
        );
        // no cleanup needed
        process.exit(-1);
      },
    );

    console.info(
      "🐳 Mapesa project loaded \n",
      env != "ci" ? mapesaProject : "", // hide this log in ci to avoid data leak
    );

    // We create a branch ID inside the project
    branch = await createNeonBranch({
      id: mapesaProject?.id || "",
      name: temp, // TODO: Replace with generated names to avoid conflicts
      apiKey: neonApiKey!,
    }).catch((e) => {
      console.error(
        `❗️ Couldn't create a Neon branch for testing! Stopping tests\n${JSON.stringify(
          e,
        )}`,
      );
      // no cleanup needed
      process.exit(-1);
    });

    console.info("🐳 Branch db setup ", branch);

    // connect to the database
    const neonDbConnection = setupNeonDatabaseConnection();

    // run migrations
    await migrateNeonDb().catch((e) => {
      console.error(
        `❗️ Couldn't run migrations on Neon! Stopping tests\n${JSON.stringify(
          e,
        )}`,
      );
      console.error("🧹 Cleaning up");
      // TODO: Write cleanup needed to this point
      process.exit(-1);
    });

    // seed the database
    await seedTransactionTypes(neonDbConnection).catch((e) => {
      console.error(
        `❗️ Couldn't run seed the Neon DB! Stopping tests\n${JSON.stringify(e)}`,
      );
      console.error("🧹 Cleaning up");
      // TODO: Write cleanup needed to this point
      process.exit(-1);
    });
  };

  return {
    setup,
    cleanup,
  };
}
