import Elysia from "elysia";
import { useAuthenticateUser, useTransactionTypes } from "~/hooks";
import { insertNewTag } from "~/repository";
import { CreateTagDTO } from "./createTag.meta";

/**
 * Creates a new Tag in `tags` table.
 */
export const CreateTag = new Elysia()
  .use(useAuthenticateUser)
  .use(useTransactionTypes)
  .post(
    "/",
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
      return await insertNewTag(payload);
    },
    {
      body: CreateTagDTO,
    }
  );
