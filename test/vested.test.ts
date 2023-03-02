import Vested from "../src/platforms/vested"

it("should return correct id", () => {
  const platform = new Vested();
  expect(platform.id()).toBe("id-vested");
});
