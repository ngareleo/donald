import { beforeAll, describe, expect, it } from "bun:test";
import { authTemplate } from "~/testing";
import { r, type NewTagDTOType } from "./createTag.meta";
import { CreateTag } from "./createTag";

const { login, getState } = authTemplate();

describe("Test after login", async () => {
  beforeAll(async () => {
    await login();
  });

  it("should create a tag", async () => {
    const { accessToken } = getState();

    const body: NewTagDTOType = {
      name: "food",
      description: "Food items including groceries",
    };
    const request = new Request(`http://localhost${r}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const response = await CreateTag.handle(request)
      .then((res) => res.json())
      .catch((e) => console.error(e));

    expect(response.message).toBe("OK");
  });
});
