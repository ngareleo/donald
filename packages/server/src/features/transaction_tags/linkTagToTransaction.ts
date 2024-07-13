import Elysia from "elysia";
import { linkTagToTransaction } from "server-repository";
import { useAuthenticateUser } from "~/features/authentication/@hooks";
import { LinkItemDTO } from "./linkTagToTransaction.meta";

/**
 * Link to a tag to an existing transaction
 */
export const LinkTagToTransaction = new Elysia().use(useAuthenticateUser).post(
    "/link",
    async ({ body, user }) => {
        const payload = {
            ...body,
            userId: user?.id,
        };
        return await linkTagToTransaction(payload);
    },
    {
        body: LinkItemDTO,
    }
);
