import Elysia from "elysia";
import bearer from "@elysiajs/bearer";
import { readPemFiles } from "~/utils/jwt";

export const useGlobalUserControllerPlugins = new Elysia()
  .use(bearer())
  .state("keys", readPemFiles);
