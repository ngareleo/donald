import Elysia from "elysia";
import { readPemFiles, getJWT } from "./@utils";
import { t } from "elysia";
import { UserRepository, type PublicUser } from "server-repository";

export type R = {
    user?: PublicUser;
    token?: string;
    message: string;
};

export const r = "/sign-in";

export const AuthenticateUser = new Elysia().state("keys", readPemFiles).post(
    r,
    async ({ body, set, store: { keys } }): Promise<R> => {
        const { subject, password } = body;
        if (!subject) {
            set.status = 400;
            return {
                message: "Email or Phone Number or Email is required",
            };
        }

        const response = await new UserRepository().findUserByUsername(
            subject,
            password
        );

        if (typeof response === "string") {
            set.status = 400;
            return { message: response };
        }

        const { privateKey } = await keys();
        const token = await getJWT(privateKey, String(response.id));
        return { user: response, token, message: "OK" };
    },
    {
        body: t.Object({
            subject: t.Optional(t.String()),
            password: t.String(),
        }),
    }
);
