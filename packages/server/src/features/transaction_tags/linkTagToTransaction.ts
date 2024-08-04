import Elysia from "elysia";
import { useAuthenticateUser } from "~/features/authentication/@hooks";
import { t } from "elysia";
import { loadRepository } from "~/internals/repository";

const { tagsRepository } = loadRepository();

export const LinkTagToTransaction = new Elysia()
    .decorate("repository", tagsRepository)
    .use(useAuthenticateUser)
    .post(
        "/link",
        async (context) => {
            const { body, user, repository } = context;

            const payload = {
                ...body,
                userId: user?.id,
            };
            return await repository?.linkTagToTransaction(payload);
        },
        {
            body: t.Object({
                tagId: t.Number(),
                transactionId: t.Number(),
            }),
        }
    );
