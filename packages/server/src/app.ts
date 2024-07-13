import { Elysia } from "elysia";
import UsersController from "~/features/authentication/@main";
import UploadController from "~/features/upload/@main";
import TagController from "~/features/transaction_tags/@main";
import {
    useApplicationConfigs,
    useMainApplicationErrorHandling,
} from "~/hooks";

const greeting = "Hello Traveler!";

const App = new Elysia()
    .use(useMainApplicationErrorHandling)
    .use(useApplicationConfigs)
    .get("/", () => greeting)
    .use(UsersController)
    .use(UploadController)
    .use(TagController);

export default App;
