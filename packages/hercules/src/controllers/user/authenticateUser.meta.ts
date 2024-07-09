import { Static, t } from "elysia";
import { PublicUser } from "~/repository";

export const UserLoginDTO = t.Object({
  subject: t.Optional(t.String()),
  password: t.String(),
});

export type Returns = {
  user?: PublicUser;
  token?: string;
  message: string;
};

export const r = "/sign-in";

export type UserLoginDTOType = Static<typeof UserLoginDTO>;
