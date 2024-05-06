import { Static, t } from "elysia";

export const UserLoginDTO = t.Object({
  subject: t.Optional(t.String()),
  password: t.String(),
});


export type UserLoginDTOType = Static<typeof UserLoginDTO>;