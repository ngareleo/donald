//  NOTE: Please do not include in index file. It is exclusive to the bunfig.toml for tests preloading

import { beforeAll, afterAll } from "bun:test";
import { setupNeonDatabaseConnection, migrateNeonDb } from "~/repository";
import { seedTransactionTypes } from "~/repository/seed";

console.log("🔌 Setting up connection with Neon DB");

const neonDbConnection = setupNeonDatabaseConnection();

beforeAll(async () => {
  await migrateNeonDb().catch((e) => {
    console.error(
      `❗️ Couldn't run migrations on Neon! Stopping tests\n${JSON.stringify(
        e
      )}`
    );
    process.exit(-1);
  });

  await seedTransactionTypes(neonDbConnection).catch((e) => {
    console.error(
      `❗️ Couldn't run seed the Neon DB! Stopping tests\n${JSON.stringify(e)}`
    );
    process.exit(-1);
  });
});

afterAll(async () => {});
