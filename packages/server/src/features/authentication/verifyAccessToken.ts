import Elysia from "elysia";
import bearer from "@elysiajs/bearer";
import { verifyJWT, readPemFiles } from "./@utils";
import { useAuthenticateUser } from "./@hooks";

export const r = "/verify";

export type R = { response: "OK" } | { response: "FAIL"; reason: string };

export const VerifyAccessToken = new Elysia()
    .use(useAuthenticateUser)
    .use(bearer())
    .state("keys", readPemFiles)
    .get(r, async (context): Promise<R> => {
        const { bearer, set, store } = context;
        const { publicKey } = await store.keys();
        const payload = await verifyJWT(publicKey, bearer || "");
        if (typeof payload === "string") {
            set.status = 400;
            set.headers["WWW-Authenticate"] =
                `Bearer realm='sign', error="invalid_token"`;
            switch (payload) {
                case "invalid_token":
                case "expired_token":
                case "user_not_found":
                    return { response: "FAIL", reason: payload };
            }
        }
        return { response: "OK" };
    });
