import Elysia from "elysia";
import { getJWT } from "~/utils/jwt";
import { findUserByUsername } from "~/repository";
import { Returns, UserLoginDTO } from "./authenticateUser.meta";
import { useGlobalUserControllerPlugins } from ".";

export const AuthenticateUser = new Elysia()
  .use(useGlobalUserControllerPlugins)
  .post(
    "/sign-in",
    async ({ body, set, store: { keys } }): Promise<Returns> => {
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
      return { user: response, token, message: "OK" };
    },
    {
      body: UserLoginDTO,
      beforeHandle({ request: { body } }) {
        console.log("[info] Body received ++> ", body);
      },
    }
  );
