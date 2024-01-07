import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "supabase/migrations",
  driver: "pg",
  verbose: true,
  strict: true,
});
