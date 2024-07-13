import Elysia from "elysia";
import bearer from "@elysiajs/bearer";
import { readPemFiles } from "~/utils/jwt";
import { insertUser } from "~/repository";
import { type Returns, r, UserRegisterDTO } from "./registerUser.meta";

export const RegisterUsers = new Elysia()
    .use(bearer())
    .state("keys", readPemFiles)
    .post(
        r,
        async ({ body, set }): Promise<Returns> => {
            const { username, password, email } = body;
            const user = {
                username,
                password,
                email,
            };

            const newUser = await insertUser(user);

            if (!newUser) {
                set.status = 400;
                return { message: "User already exists" };
            }

            return { user: newUser, message: "OK" };
        },
        { body: UserRegisterDTO },
    );
