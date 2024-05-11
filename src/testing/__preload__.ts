//  NOTE: Please do not include in index file. It is exclusive to the bunfig.toml for tests preloading
import { beforeAll, afterAll } from "bun:test";
import { loadConfigs } from "~/config";
import { setupNeonDatabaseConnection, migrateNeonDb } from "~/repository";
import { seedTransactionTypes } from "~/repository/seed";
import {
  makeNeonTestingBranchDB,
  loadNeonProject,
  destroyNeonTestingBranchDB,
  type NeonDB,
  type NeonProject,
} from "~/utils/neonApi";

console.log("🔌 Setting up connection with Neon DB");

const { neonApiKey } = loadConfigs();

if (!neonApiKey) {
  console.error("❗️ Missing Neon API Key. Stopping tests.");
  process.exit(-1);
}

const branchID = "congenial-waddle";
let neonDB: NeonDB | undefined;
let mapesaProject: NeonProject | undefined;

// TODO: Allow tests to run without network
// TODO: Reuse this work to setup our dev flow

beforeAll(async () => {
  // Load the Mapesa project from Neon
  mapesaProject = await loadNeonProject({ apiKey: neonApiKey! }).catch((e) => {
    console.error(
      `❗️ Couldn't load the Neon project! Stopping tests\n${JSON.stringify(e)}`
    );
    process.exit(-1);
  });

  // We create a branch ID inside the project
  neonDB = await makeNeonTestingBranchDB({
    apiKey: neonApiKey!,
    branchID,
    projectID: mapesaProject?.id || "",
  }).catch((e) => {
    console.error(
      `❗️ Couldn't create a Neon DB for testing! Stopping tests\n${JSON.stringify(
        e
      )}`
    );
    process.exit(-1);
  });

  // connect to the database
  const neonDbConnection = setupNeonDatabaseConnection();

  // run migrations

  await migrateNeonDb().catch((e) => {
    console.error(
      `❗️ Couldn't run migrations on Neon! Stopping tests\n${JSON.stringify(
        e
      )}`
    );
    process.exit(-1);
  });

  // seed the database

  await seedTransactionTypes(neonDbConnection).catch((e) => {
    console.error(
      `❗️ Couldn't run seed the Neon DB! Stopping tests\n${JSON.stringify(e)}`
    );
    process.exit(-1);
  });
});

afterAll(async () => {
  // delete the database

  await destroyNeonTestingBranchDB({
    apiKey: neonApiKey!,
    branchID,
    projectID: mapesaProject?.id || "",
    dbName: neonDB?.id || "",
  }).catch((e) => {
    console.error(`❗️ Couldn't cleanup the Neon DB!\n${JSON.stringify(e)}`);
  });
});
