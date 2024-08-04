import Elysia, { t } from "elysia";
import { type PublicUser } from "server-repository";
import { loadRepository } from "~/internals/repository";

export type R = { user?: PublicUser; message: string };
export const r = "/sign-up";

const { userRepository } = loadRepository();

export const RegisterUsers = new Elysia()
    .decorate("repository", userRepository)
    .post(
        r,
        async (context): Promise<R> => {
            const { body, set, repository } = context;

            const { username, password, email } = body;
            const user = {
                username,
                password,
                email,
            };
            const newUser = await repository?.insertUser(user);
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
