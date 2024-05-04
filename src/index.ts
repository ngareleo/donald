import { Elysia } from "elysia";
import { logger } from "@grotto/logysia";
import UsersController from "./controllers/user/@main";
import UploadController from "./controllers/upload/@main";
import { tags as TagsController } from "./controllers/tag.controller";
import { useMainApplicationErrorHandling } from "./utils";

const app = new Elysia()
  .use(logger({ logIP: true }))
  .use(useMainApplicationErrorHandling)
  .get("/", () => "Hello Traveller!")
  .use(UsersController)
  .use(UploadController)
  .use(TagsController)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
