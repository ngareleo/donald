import { Elysia } from "elysia";
import UsersController from "~/features/authentication/@main";
import UploadController from "~/features/upload/@main";
import TagController from "~/features/transaction_tags/@main";

const greeting = "Hello Traveler!";

const App = new Elysia()
    .onAfterResponse((context) => {
        console.log(context.response);
    })
    .onError(({ code, error, set }) => {
        console.error(error);
        switch (code) {
            case "NOT_FOUND":
                set.status = 404;
                return "Not Found :(";

            case "INTERNAL_SERVER_ERROR":
                set.status = 500;
                return "Internal Server Error :(";

            default:
                set.status = 400;
                return "Bad Request :(";
        }
    })
    .get("/", () => greeting)
    .use(UsersController)
    .use(UploadController)
    .use(TagController);

export default App;
