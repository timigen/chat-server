import { Server } from "../src/server/server";

test("Server", () => {
  expect(new Server()).not.toBe(null);
});
