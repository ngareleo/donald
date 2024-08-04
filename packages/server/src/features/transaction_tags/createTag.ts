import Elysia from "elysia";
import { useTransactionTypes } from "~/hooks";
import { useAuthenticateUser } from "~/features/authentication/@hooks";
import { t } from "elysia";
import { loadRepository } from "~/internals/repository";

export const r = "/";

const { tagsRepository } = loadRepository();

export const CreateTag = new Elysia()
    .decorate("repository", tagsRepository)
    .use(useAuthenticateUser)
    .use(useTransactionTypes)
    .post(
        r,
        async (context) => {
            const { body, user, repository } = context;
            const payload = Array.isArray(body)
                ? body.map((tag) => ({
                      ...tag,
                      userId: user?.id,
                  }))
                : {
                      ...body,
                      userId: user?.id,
                  };
            const tag = await repository?.insertNewTag(payload);
            return { tag, message: "OK" };
        },
        {
            body: t.Union([
                t.Object({
                    name: t.String(),
                    description: t.Optional(t.String()),
                }),
                t.Array(
                    t.Object({
                        name: t.String(),
                        description: t.Optional(t.String()),
                    })
                ),
            ]),
        }
    );
