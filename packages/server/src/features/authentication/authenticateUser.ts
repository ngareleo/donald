import Elysia from "elysia";
import { readPemFiles, getJWT } from "./@utils";
import { t } from "elysia";
import { type PublicUser } from "server-repository";
import { loadRepository } from "~/internals/repository";

export type R = {
    user?: PublicUser;
    token?: string;
    message: string;
};

export const r = "/sign-in";

const { userRepository } = loadRepository();

export const AuthenticateUser = new Elysia()
    .state("keys", readPemFiles)
    .decorate("repository", userRepository)
    .post(
        r,
        async (context): Promise<R> => {
            const { body, set, store, repository } = context;
            const { subject, password } = body;
            if (!subject) {
                set.status = 400;
                return {
                    message: "Email or Phone Number or Email is required",
                };
            }
            const response = await repository?.findUserByUsername(
                subject,
                password
            );
            if (typeof response === "string") {
                set.status = 400;
                return { message: response };
            }
            const { privateKey } = await store.keys();
            const token = await getJWT(privateKey, String(response?.id));
            return { user: response, token, message: "OK" };
        },
        {
            body: t.Object({
                subject: t.Optional(t.String()),
                password: t.String(),
            }),
        }
    );
