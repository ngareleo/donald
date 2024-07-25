import { describe, expect, it } from "bun:test";
import { type NewUser } from "server-repository";
import { RegisterUsers, r as RegisterUserR } from "./registerUser";
import { AuthenticateUser, r as AuthenticateUserR } from "./authenticateUser";
import { VerifyAccessToken, r as VerifyAccessR } from "./verifyAccessToken";

const user = {
    email: "test@testaccount.com",
    password: "testPassword",
    username: "testUser0",
};

// Test the entire controller as a unit
describe("Test user controller", () => {
    let created: NewUser | undefined;
    let accessToken: string | undefined;
    it("should create a user", async () => {
        const request = new Request(`http://localhost${RegisterUserR}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        const response = await RegisterUsers.handle(request)
            .then((res) => res.json())
            .catch((e) => console.error(e));

        expect(response.message).toBe("OK");
        expect(response.user).toBeObject();
        expect(response.user["email"]).toBe(user.email);
        expect(response.user["username"]).toBe(user.username);

        created = response.user;
    });

    it("should log in successfully with correct credentials", async () => {
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

        expect(response.message).toBe("OK");
        expect(response.user).toStrictEqual(created);
        accessToken = response.token;
    });

    it("should flag an invalid user", async () => {
        const body = {
            subject: `red${user.username}`,
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

        expect(response.message).toBe("user_not_found");
    });

    it("should flag an invalid password", async () => {
        const body = {
            subject: user.username,
            password: `red${user.password}`,
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

        expect(response.message).toBe("incorrect_password");
    });

    it("should provide a valid token after login", async () => {
        const request = new Request(`http://localhost${VerifyAccessR}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const response = await VerifyAccessToken.handle(request)
            .then((res) => res.text())
            .catch((e) => console.error(e));

        expect(response).toBe("OK");
    });
});
