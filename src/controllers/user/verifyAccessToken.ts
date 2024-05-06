import Elysia from "elysia";
import { verifyJWT } from "../../utils";
import { useGlobalUserControllerPlugins } from "./utils";

export const VerifyAccessToken = new Elysia()
  .use(useGlobalUserControllerPlugins)
  .get("/verify", async ({ bearer, set, store: { keys } }) => {
    if (!bearer) {
      set.status = 400;
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm='sign', error="invalid_request"`;

      return "FAIL";
    }

    const { publicKey } = await keys();
    const payload = await verifyJWT(publicKey, bearer);

    if (typeof payload === "string") {
      set.status = 400;
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm='sign', error="invalid_token"`;
      switch (payload) {
        case "Invalid":
        case "Expired":
        case "User not found":
          return "FAIL";
      }
    }

    return "OK";
  });