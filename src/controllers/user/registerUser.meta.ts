import { Static, t } from "elysia";
import { PublicUser } from "~/repository";

export const r = "/sign-up";

export const UserRegisterDTO = t.Object({
  username: t.String(),
  password: t.String(),
  email: t.String(),
});

export type Returns = { user?: PublicUser; message: string };

export type UserRegisterDTOType = Static<typeof UserRegisterDTO>;
