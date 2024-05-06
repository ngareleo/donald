import Elysia from "elysia";
import { useAuthenticateUser, useTransactionTypes } from "../../middleware";
import { insertNewTag } from "../../repository";
import { CreateTagDTO } from "./createTag.meta";

export const CreateTag = new Elysia()
  .use(useAuthenticateUser)
  .use(useTransactionTypes)
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
      body: CreateTagDTO,
    }
  );
