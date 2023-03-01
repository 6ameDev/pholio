import { sayHello } from "../src/greet";

it("should say hello", () => {
  expect(sayHello("typescript")).toBe("Hello from typescript");
});
