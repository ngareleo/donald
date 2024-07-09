import Elysia from "elysia";
import bearer from "@elysiajs/bearer";
import { verifyJWT, readPemFiles } from "~/utils/jwt";
import { Returns, r } from "./verifyAccessToken.meta";

export const VerifyAccessToken = new Elysia()
  .use(bearer())
  .state("keys", readPemFiles)
  .get(r, async ({ bearer, set, store: { keys } }): Promise<Returns> => {
    if (!bearer) {
      set.status = 400;
      set.headers["WWW-Authenticate"] =
        `Bearer realm='sign', error="invalid_request"`;

      return "FAIL";
    }

    const { publicKey } = await keys();
    const payload = await verifyJWT(publicKey, bearer);

    if (typeof payload === "string") {
      set.status = 400;
      set.headers["WWW-Authenticate"] =
        `Bearer realm='sign', error="invalid_token"`;
      switch (payload) {
        case "Invalid":
        case "Expired":
        case "User not found":
          return "FAIL";
      }
    }

    return "OK";
  });
