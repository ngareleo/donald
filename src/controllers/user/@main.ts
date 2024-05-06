import { Elysia } from "elysia";
import { AuthenticateUser } from "./authenticateUser";
import { RegisterUsers } from "./registerUser";
import { VerifyAccessToken } from "./verifyAccessToken";

const UsersController = new Elysia().group("/users", (app) =>
  app.use(AuthenticateUser).use(RegisterUsers).use(VerifyAccessToken)
);

export default UsersController;
