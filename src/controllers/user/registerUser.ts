import Elysia from "elysia";
import { insertUser } from "~/repository";
import { Returns, r, UserRegisterDTO } from "./registerUser.meta";
import { useGlobalUserControllerPlugins } from ".";

export const RegisterUsers = new Elysia()
  .use(useGlobalUserControllerPlugins)
  .post(
    r,
    async ({ body, set }): Promise<Returns> => {
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

      return { user: newUser, message: "OK" };
    },
    { body: UserRegisterDTO }
  );
