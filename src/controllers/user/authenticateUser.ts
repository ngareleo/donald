import Elysia from "elysia";
import { getJWT } from "../../utils";
import { findUserByUsername } from "../../repository/user.repository";
import { UserLoginDTO } from "./authenticateUser.meta";
import { useGlobalUserControllerPlugins } from "./utils";

export const AuthenticateUser = new Elysia()
  .use(useGlobalUserControllerPlugins)
  .post(
    "/sign-in",
    async ({ body, set, store: { keys } }) => {
      const { subject, password } = body;
      if (!subject) {
        set.status = 400;
        return { message: "Email or Phone Number or Email is required" };
      }

      const response = await findUserByUsername(subject, password);

      if (typeof response === "string") {
        set.status = 400;
        return { message: response };
      }

      const { privateKey } = await keys();
      const token = await getJWT(privateKey, String(response.id));
      return { ...response, token };
    },
    {
      body: UserLoginDTO,
    }
  );
