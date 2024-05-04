import Elysia from "elysia";
import { readPemFiles } from "../../utils";
import bearer from "@elysiajs/bearer";

export const useGlobalUserControllerPlugins = new Elysia()
  .use(bearer())
  .state("keys", readPemFiles);
