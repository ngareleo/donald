import { Elysia } from "elysia";
import { AuthenticateUser, RegisterUsers, VerifyAccessToken } from ".";

const UsersController = new Elysia().group("/users", (app) =>
    app

        .use(AuthenticateUser)
        .use(RegisterUsers)
        .use(VerifyAccessToken)
        .onError(({ code, error, set }) => {
            if (code === "VALIDATION") {
                console.error(
                    "❗️ Caught by auth error handling ",
                    error.message
                );
                set.status = 400;
                return {
                    message: error,
                    suggest: "Check your values for null values",
                };
            }
            if (code === "INTERNAL_SERVER_ERROR") {
                console.error(
                    "❗️ Caught by auth error handling ",
                    error.message
                );
                set.status = 500;
                return {
                    message: "Internal server error",
                    error: error.message,
                };
            }
        })
);

export default UsersController;
