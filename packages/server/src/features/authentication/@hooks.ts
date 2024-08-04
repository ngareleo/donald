import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { readPemFiles, verifyJWT } from "./@utils";
import { loadRepository } from "~/internals/repository";

const { userRepository } = loadRepository();

export const useAuthenticateUser = new Elysia({ name: "useAuthenticateUser" })
    .guard({
        headers: t.Object({
            authorization: t.TemplateLiteral("Bearer ${string}"),
        }),
    })
    .state("keys", readPemFiles)
    .use(bearer())
    .onBeforeHandle(async (context) => {
        const { bearer, set, store } = context;
        if (!bearer) {
            set.status = 401;
            set.headers["WWW-Authenticate"] =
                `Bearer realm='sign', error="invalid_request"`;
            return { message: "not_authenticated" };
        }
        const { publicKey } = await store.keys();
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
    .derive(async (context) => {
        const { bearer, store } = context;
        const { publicKey } = await store.keys();
        const payload = await verifyJWT(publicKey, bearer!);
        if (typeof payload === "string") {
            return {
                user: null,
            };
        }
        const user = await userRepository?.findUserById(Number(payload.sub));
        return {
            user,
        };
    });
