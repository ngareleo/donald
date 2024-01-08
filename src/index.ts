import { Elysia } from "elysia";
import { users } from "./controllers/user";

const app = new Elysia()
  .use(users)
  .get("/", () => "Hello Traveller!")
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
