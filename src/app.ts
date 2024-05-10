import { Elysia } from "elysia";
import { logger } from "@grotto/logysia";
import UsersController from "~/controllers/user/@main";
import UploadController from "~/controllers/upload/@main";
import TagsController from "~/controllers/tag/@main";
import { useMainApplicationErrorHandling } from "~/hooks";

const greeting = "Hello Traveller!";

const App = new Elysia()
  .use(logger({ logIP: true }))
  .use(useMainApplicationErrorHandling)
  .get("/", () => greeting)
  .use(UsersController)
  .use(UploadController)
  .use(TagsController);

export default App;
