import Elysia, { t } from "elysia";
import bearer from "@elysiajs/bearer";
import { readPemFiles } from "./@utils";
import { UserRepository, type PublicUser } from "server-repository";

export type R = { user?: PublicUser; message: string };
export const r = "/sign-up";

export const RegisterUsers = new Elysia()
    .use(bearer())
    .state("keys", readPemFiles)
    .post(
        r,
        async ({ body, set }): Promise<R> => {
            const { username, password, email } = body;
            const user = {
                username,
                password,
                email,
            };
            const newUser = await new UserRepository().insertUser(user);
            if (!newUser) {
                set.status = 400;
                return { message: "User already exists" };
            }
            return { user: newUser, message: "OK" };
        },
        {
            body: t.Object({
                username: t.String(),
                password: t.String(),
                email: t.String(),
            }),
        }
    );
