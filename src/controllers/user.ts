import { Elysia, t } from "elysia";
import { insertUser } from "../repository/user";
import { getJWT } from "../utils";

const readPemFiles = async () => {
  return {
    publicKey: await Bun.file("./bin/public_key.pem").text(),
    privateKey: await Bun.file("./bin/private_key.pem").text(),
  };
};

export const users = new Elysia().group("/users", (app) =>
  app
    .state("keys", readPemFiles)
    .post(
      "/sign-up",
      async ({ body, set, store: { keys } }) => {
        const { username, password, email, phone } = body;
        const user = {
          username,
          password: await Bun.password.hash(password),
          email,
          phoneNumber: phone,
        };
        const newUser = await insertUser(user);
        if (!newUser) {
          set.status = 400;
          return { message: "User already exists" };
        }
        const { privateKey } = await keys();
        const token = await getJWT(privateKey, String(newUser.id));
        return { ...newUser, token };
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
          email: t.String(),
          phone: t.String(),
        }),
      }
    )
    .post("/sign-in", () => {})
);
