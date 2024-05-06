import { Elysia } from "elysia";
import { UploadBatchTransactions } from "./uploadBatchTransactions";
import { useUploadsControllerErrorHandling } from "./utils";

const UploadsController = new Elysia()
  .use(useUploadsControllerErrorHandling)
  .group("/upload", (app) => app.use(UploadBatchTransactions));

export default UploadsController;
