import Elysia from "elysia";

export const useUploadsControllerErrorHandling = new Elysia().onError(
  ({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { message: error, suggest: "Check your values for null values" };
    }
    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = 500;
      return { message: "Internal server error", error: error.message };
    }
  }
);
