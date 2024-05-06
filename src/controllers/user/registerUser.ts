import Elysia from "elysia";
import { insertUser } from "../../repository";
import { UserRegisterDTO } from "./registerUser.meta";
import { useGlobalUserControllerPlugins } from "./utils";

export const RegisterUsers = new Elysia()
  .use(useGlobalUserControllerPlugins)
  .post(
    "/sign-up",
    async ({ body, set }) => {
      const { username, password, email } = body;
      const user = {
        username,
        password,
        email,
      };
      const newUser = await insertUser(user);
      if (!newUser) {
        set.status = 400;
        return { message: "User already exists" };
      }
      return newUser;
    },
    {
      body: UserRegisterDTO,
    }
  );
