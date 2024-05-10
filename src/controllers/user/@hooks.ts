import Elysia from "elysia";
import bearer from "@elysiajs/bearer";
import { readPemFiles } from "~/utils";

export const useGlobalUserControllerPlugins = new Elysia()
  .use(bearer())
  .state("keys", readPemFiles);
