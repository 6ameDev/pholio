import Kuvera from "../src/platforms/kuvera";

const platform = new Kuvera();

describe("when platform is kuvera", () => {
  it("should return correct name", () => {
    expect(platform.name()).toBe("Kuvera");
  });

  it("should return correct id", () => {
    expect(platform.id()).toBe("id-kuvera");
  });
});
