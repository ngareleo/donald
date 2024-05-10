// Do not include in index file

import { migrateNeonDb } from "~/repository";

console.log("🔌 Setting up connection with Neon db and running migrations");

await migrateNeonDb().catch((e) => {
  console.error(
    `❗️ Couldn't run migrations on Neon! Stopping tests\n${JSON.stringify(e)}`
  );
});
