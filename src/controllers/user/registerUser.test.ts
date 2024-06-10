import { it } from "bun:test";
import { describe } from "~/testing";
import { RegisterUsers } from "./registerUser";
import { r, UserRegisterDTOType } from "./registerUser.meta";

const mockUserPersonalCreds: UserRegisterDTOType = {
  email: "test@testaccount.com",
  password: "testPassword",
  username: "testUser0",
};

describe("CreateUser", () => {
  it("should create a user", async () => {
    const request = new Request(`http://localhost${r}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockUserPersonalCreds),
    });

    const response = await RegisterUsers.handle(request).then((res) =>
      res.text(),
    );

    console.log("Response from route : ", response);
  });
});
