import { Elysia, t } from "elysia";
import { authenticateUser, loadTransactionTypes } from "../middleware";
import {
  getTagById,
  insertNewTag,
  linkTagToTransaction,
} from "../repository/tags.repository";

const TagDTO = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
});

export const tags = new Elysia()
  .use(authenticateUser)
  .use(loadTransactionTypes)
  .group("/tag", (app) =>
    app
      .post(
        "/",
        async ({ body, user }) => {
          // Create a new tag
          const payload = Array.isArray(body)
            ? body.map((tag) => ({
                ...tag,
                userId: user?.id,
              }))
            : {
                ...body,
                userId: user?.id,
              };
          return await insertNewTag(payload);
        },
        {
          body: t.Union([TagDTO, t.Array(TagDTO)]),
        }
      )
      .get(
        "/:id",
        async ({ user, params: { id }, body: { ids } }) => {
          // Should return deep nests of tags with transactions
          const res = await getTagById(user?.id!, [id, ...ids]);
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
      )
      .post(
        "/link",
        async ({ body, user }) => {
          // Link a tag to a transaction
          const payload = {
            ...body,
            userId: user?.id,
          };
          return await linkTagToTransaction(payload);
        },
        {
          body: t.Object({
            tagId: t.Number(),
            transactionId: t.Number(),
          }),
        }
      )
  );
