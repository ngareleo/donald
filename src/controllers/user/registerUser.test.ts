import { afterAll, describe, it, beforeAll } from "bun:test";
import { loginFlowTemplate } from "~/testing";
import { RegisterUsers } from "./registerUser";
import { r, UserRegisterDTOType } from "./registerUser.meta";

const mockUserPersonalCreds: UserRegisterDTOType = {
  email: "test@testaccount.com",
  password: "testPassword",
  username: "testUser0",
};

const template = loginFlowTemplate();

describe("CreateUser", () => {
  beforeAll(template.beforeAll);
  afterAll(template.afterAll);

  it("should create a user", async () => {
    const request = new Request(`http://localhost${r}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockUserPersonalCreds),
    });

    const response = await RegisterUsers.handle(request).then((res) =>
      res.text()
    );
  });

  afterAll(() => {});
});
