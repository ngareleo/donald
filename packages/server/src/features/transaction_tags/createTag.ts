import Elysia from "elysia";
import { useTransactionTypes } from "~/hooks";
import { TagsRepository } from "server-repository";
import { useAuthenticateUser } from "~/features/authentication/@hooks";
import { t } from "elysia";

export const r = "/";

/**
 * Creates a new Tag in `tags` table.
 */
export const CreateTag = new Elysia()
    .use(useAuthenticateUser)
    .use(useTransactionTypes)
    .post(
        r,
        async ({ body, user }) => {
            const payload = Array.isArray(body)
                ? body.map((tag) => ({
                      ...tag,
                      userId: user?.id,
                  }))
                : {
                      ...body,
                      userId: user?.id,
                  };
            const tag = await new TagsRepository().insertNewTag(payload);
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
