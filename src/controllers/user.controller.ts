import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { findUserByUsername, insertUser } from "../repository/user.repository";
import { getJWT, verifyJWT } from "../utils/index.utils";

const readPemFiles = async () => {
  return {
    publicKey: await Bun.file("./bin/public_key.pem").text(),
    privateKey: await Bun.file("./bin/private_key.pem").text(),
  };
};

export const users = new Elysia().group("/users", (app) =>
  app
    .use(bearer())
    .state("keys", readPemFiles)
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
        body: t.Object({
          username: t.String(),
          password: t.String(),
          email: t.String(),
        }),
      }
    )
    .post(
      "/sign-in",
      async ({ body, set, store: { keys } }) => {
        const { subject, password } = body;
        if (!subject) {
          set.status = 400;
          return { message: "Email or Phone Number or Email is required" };
        }

        const response = await findUserByUsername(subject, password);

        console.log(response);

        if (typeof response === "string") {
          set.status = 400;
          return { message: response };
        }

        const { privateKey } = await keys();
        const token = await getJWT(privateKey, String(response.id));
        return { ...response, token };
      },
      {
        body: t.Object({
          subject: t.Optional(t.String()),
          password: t.String(),
        }),
      }
    )
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
    })
);
