import { Elysia } from "elysia";
import UsersController from "~/controllers/user/@main";
import UploadController from "~/controllers/upload/@main";
import TagsController from "~/controllers/tag/@main";
import {
  useApplicationConfigs,
  useMainApplicationErrorHandling,
} from "~/hooks";

const greeting = "Hello Traveller!";

const App = new Elysia()
  .use(useMainApplicationErrorHandling)
  .use(useApplicationConfigs)
  .get("/", () => greeting)
  .use(UsersController)
  .use(UploadController)
  .use(TagsController);

export default App;
