import { Elysia, t } from "elysia";
import bearer from "@elysiajs/bearer";
import { findUserById, getDatabaseInstance } from "../repository";
import { readPemFiles, verifyJWT } from "../utils/jwt";
import { loadConfigs } from "../config";

const connection = getDatabaseInstance();

export const useMainApplicationErrorHandling = new Elysia().onError(
  ({ code, error, set }) => {
    if (code === "VALIDATION") {
    }
    console.error(error);
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        return "Not Found :(";

      case "INTERNAL_SERVER_ERROR":
        set.status = 500;
        return "Internal Server Error :(";

      default:
        set.status = 400;
        return "Bad Request :(";
    }
  },
);

export const useApplicationConfigs = new Elysia().state(
  "config",
  loadConfigs(),
);

export const useTransactionTypes = new Elysia().state(
  "transactionTypes",
  await (async () => {
    return await connection!.query.transactionTypeTable.findMany();
  })(),
);

export const useAuthenticateUser = new Elysia()
  .guard({
    headers: t.Object({
      authorization: t.TemplateLiteral("Bearer ${string}"),
    }),
  })
  .use(bearer())
  .state("keys", readPemFiles)
  .onBeforeHandle(async ({ bearer, set, store: { keys } }) => {
    if (!bearer) {
      set.status = 401;
      set.headers["WWW-Authenticate"] =
        `Bearer realm='sign', error="invalid_request"`;

      return { message: "not_authenticated" };
    }

    const { publicKey } = await keys();
    const payload = await verifyJWT(publicKey, bearer);

    if (typeof payload === "string") {
      set.status = 401;
      set.headers["WWW-Authenticate"] =
        `Bearer realm='sign', error="invalid_token"`;
      switch (payload) {
        case "User not found":
        case "Invalid":
          return { message: "invalid_token" };
        case "Expired":
          return { message: "expired_token" };
      }
    }
  })
  .derive(async ({ bearer, store: { keys } }) => {
    const { publicKey } = await keys();
    const payload = await verifyJWT(publicKey, bearer!);

    if (typeof payload === "string") {
      return {};
    }

    const user = await findUserById(Number(payload.sub));

    return {
      user,
    };
  });
