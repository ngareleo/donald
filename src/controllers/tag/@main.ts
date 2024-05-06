import { Elysia, t } from "elysia";
import { CreateTag } from "./createTag";
import { GetTag } from "./getTag";
import { LinkTagToTransaction } from "./linkTagToTransaction";

const TagController = new Elysia().group("/tag", (app) =>
  app.use(CreateTag).use(GetTag).use(LinkTagToTransaction)
);

export default TagController ;
