import Zerodha from "../src/models/platforms/zerodha";

const platform = new Zerodha();

describe("when platform is zerodha", () => {
  it("should return correct name", () => {
    expect(platform.name()).toBe("Zerodha");
  });
})
