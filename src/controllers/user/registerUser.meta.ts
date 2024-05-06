import { Static, t } from "elysia";

export const UserRegisterDTO = t.Object({
  username: t.String(),
  password: t.String(),
  email: t.String(),
});

export type UserRegisterDTOType = Static<typeof UserRegisterDTO>;
