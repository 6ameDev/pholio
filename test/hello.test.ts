import { sayHello } from "../src/hello";

it("should say hello", () => {
  expect(sayHello("typescript")).toBe("Hello from typescript");
});
