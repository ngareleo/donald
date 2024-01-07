import { Elysia } from "elysia";
import { db } from "./db";
import { users } from "./schema";

const allUsers = await db.select().from(users);
console.log(allUsers);

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
