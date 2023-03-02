import Kuvera from "../src/platforms/kuvera"

it("should return correct id", () => {
  const platform = new Kuvera();
  expect(platform.id()).toBe("id-kuvera");
});
