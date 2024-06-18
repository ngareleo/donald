import Elysia, { t } from "elysia";
import { useAuthenticateUser, useTransactionTypes } from "../../hooks";
import { getTagById } from "../../repository";

export const GetTag = new Elysia()
  .use(useAuthenticateUser)
  .use(useTransactionTypes)
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
        }),
      ),
      body: t.Optional(
        t.Object({
          ids: t.Array(t.Number()),
        }),
      ),
    },
  );
