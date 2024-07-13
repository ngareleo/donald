import Elysia from "elysia";
import { useTransactionTypes } from "~/hooks";
import { insertNewTag } from "server-repository";
import { CreateTagDTO, r } from "./createTag.meta";
import { useAuthenticateUser } from "~/features/authentication/@hooks";

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
            const tag = await insertNewTag(payload);
            return { tag, message: "OK" };
        },
        {
            body: CreateTagDTO,
        }
    );
