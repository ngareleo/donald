import Elysia from "elysia";

export const useMainApplicationErrorHandling = new Elysia().onError(
  ({ code, error, set }) => {
    console.error(error);
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        return "Not Found :(";

      case "INTERNAL_SERVER_ERROR":
        set.status = 500;
        return "Internal Server Error :(";

      default:
        set.status = 400;
        return "Bad Request :(";
    }
  }
);
