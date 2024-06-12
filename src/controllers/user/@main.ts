import { Elysia } from "elysia";
import { AuthenticateUser, RegisterUsers, VerifyAccessToken } from ".";

const UsersController = new Elysia().group("/users", (app) =>
  app.use(AuthenticateUser).use(RegisterUsers).use(VerifyAccessToken),
);

export default UsersController;
