import Elysia from "elysia";
import { TagsRepository } from "server-repository";
import { useAuthenticateUser } from "~/features/authentication/@hooks";
import { t } from "elysia";

/**
 * Link to a tag to an existing transaction
 */
export const LinkTagToTransaction = new Elysia().use(useAuthenticateUser).post(
    "/link",
    async ({ body, user }) => {
        const repository = TagsRepository.getInstance();
        const payload = {
            ...body,
            userId: user?.id,
        };
        return await repository.linkTagToTransaction(payload);
    },
    {
        body: t.Object({
            tagId: t.Number(),
            transactionId: t.Number(),
        }),
    }
);
