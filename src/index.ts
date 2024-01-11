import { Elysia } from "elysia";
import { logger } from "@grotto/logysia";
import { rateLimit } from "elysia-rate-limit";

import { users } from "./controllers/user.controller";
import { upload } from "./controllers/upload.controller";

const app = new Elysia()
  .use(logger({ logIP: true }))
  .use(rateLimit())
  .get("/", () => "Hello Traveller!")
  .use(users)
  .use(upload)
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
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
