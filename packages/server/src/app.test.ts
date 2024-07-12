import { describe, expect, it } from "bun:test"
import App from "./app"

describe("ApplicationTest", () => {
    it("Should  log a greeting", async () => {
        const response = await App.handle(
            new Request("http://localhost/"),
        ).then((res) => res.text())
        expect(response).toBe("Hello Traveller!")
    })
})
