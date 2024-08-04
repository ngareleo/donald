import Elysia, { t } from "elysia";
import { useTransactionTypes } from "~/hooks";
import { useAuthenticateUser } from "~/features/authentication/@hooks";
import { loadRepository } from "~/internals/repository";

const { tagsRepository } = loadRepository();

export const GetTag = new Elysia()
    .decorate("repository", tagsRepository)
    .use(useAuthenticateUser)
    .use(useTransactionTypes)
    .get(
        "/:id",
        async (context) => {
            const { user, params, body, repository } = context;
            const res = await repository?.getTagById(user?.id!, [
                ...(params.id ? [params?.id] : []),
                ...(body?.ids || []),
            ]);
            return res;
        },
        {
            params: t.Optional(
                t.Object({
                    id: t.Number(),
                })
            ),
            body: t.Optional(
                t.Object({
                    ids: t.Array(t.Number()),
                })
            ),
        }
    );
