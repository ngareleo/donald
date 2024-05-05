import Elysia, { t } from "elysia";
import { linkTagToTransaction } from "../../repository";
import { useAuthenticateUser } from "../../middleware";
import { LinkItemDTO } from "./linkTagToTransaction.meta";

export const LinkTagToTransaction = new Elysia().use(useAuthenticateUser).post(
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
    body: LinkItemDTO,
  }
);
