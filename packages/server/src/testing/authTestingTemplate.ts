import { type NewUser } from "server-repository";
import { AuthenticateUser } from "~/features/authentication/handlers/authenticateUser";
import { RegisterUsers } from "~/features/authentication/handlers/registerUser";
import { r as RegisterUserR } from "~/features/authentication/handlers/registerUser.meta";
import { r as AuthenticateUserR } from "~/features/authentication/handlers/authenticateUser.meta";

export function authTemplate() {
    let accessToken: string | undefined;
    let userId: string | undefined;
    let createdUser: NewUser | undefined;
    const user = {
        email: "testuser3@testaccount.com",
        password: "testPassword3",
        username: "testUser3",
    };

    /** Use inside preload to create user */
    const preload = async () => {
        // routine run during preload
        // register user

        const request = new Request(`http://localhost${RegisterUserR}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        await RegisterUsers.handle(request)
            .then((res) => res.json())
            .catch((e) => console.error(e));
    };

    /** Call inside `beforeAll` to login and get accessToken */
    const login = async () => {
        const body = {
            subject: user.username,
            password: user.password,
        };

        const request = new Request(`http://localhost${AuthenticateUserR}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const response = await AuthenticateUser.handle(request)
            .then((res) => res.json())
            .catch((e) => console.error(e));

        accessToken = response.token;
        userId = response.user["id"];
        createdUser = response.user;
    };

    /** Use to get local state */
    const getState = () => {
        return { accessToken, userId, user, createdUser };
    };

    return {
        preload,
        login,
        getState, // our state
    };
}
