import Configs from "../src/models/configs";
import Kuvera from "../src/platforms/kuvera";
import Settings from "../src/models/settings";

const configs = new Configs([]);
const settings = new Settings("", []);
const platform = new Kuvera(configs, settings);

describe("when platform is kuvera", () => {
  it("should return correct name", () => {
    expect(platform.name()).toBe("Kuvera");
  });

  it("should return correct id", () => {
    expect(platform.id()).toBe("id-kuvera");
  });
});
