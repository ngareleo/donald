import { beforeAll, describe, expect, it } from "bun:test";
import { CreateTag } from "./createTag";

describe("CreateTagTests", () => {
  beforeAll(() => {});
  it("returns a response", async () => {
    const response = await CreateTag.handle(
      new Request("http://localhost/", { method: "POST" })
    ).then((res) => res.text());
    expect(response).toBe("Hello");
  });
});
