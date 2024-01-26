import { Elysia, t } from "elysia";
import bearer from "@elysiajs/bearer";

import { db } from "../db/index.db";
import { readPemFiles, verifyJWT } from "../utils/index.utils";
import { findUserById } from "../repository/user.repository";

export const loadTransactionTypes = new Elysia().state(
  "transactionTypes",
  await (async () => {
    return await db.query.transactionTypeTable.findMany();
  })()
);

export const authenticateUser = new Elysia()
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
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm='sign', error="invalid_request"`;

      return { message: "not_authenticated" };
    }

    const { publicKey } = await keys();
    const payload = await verifyJWT(publicKey, bearer);

    if (typeof payload === "string") {
      set.status = 401;
      set.headers[
        "WWW-Authenticate"
      ] = `Bearer realm='sign', error="invalid_token"`;
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
