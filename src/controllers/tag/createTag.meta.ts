import { Static, t } from "elysia";

export const NewTagDTO = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
});

export type NewTagDTOType = Static<typeof NewTagDTO>;

export const CreateTagDTO = t.Union([NewTagDTO, t.Array(NewTagDTO)]);

export const r = "/";
