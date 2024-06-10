import { Elysia } from "elysia";
import { CreateTag, GetTag, LinkTagToTransaction } from ".";

const TagController = new Elysia().group("/tag", (app) =>
  app.use(CreateTag).use(GetTag).use(LinkTagToTransaction)
);

export default TagController;
