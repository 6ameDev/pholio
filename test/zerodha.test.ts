import Zerodha from "../src/platforms/zerodha"

it("should return correct id", () => {
  const platform = new Zerodha();
  expect(platform.id()).toBe("id-zerodha");
});
