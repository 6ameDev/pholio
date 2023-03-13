import Configs from "../src/configs";
import Zerodha from "../src/platforms/zerodha"
import Settings from "../src/settings";

const configs = new Configs([]);
const settings = new Settings("", []);
const platform = new Zerodha(configs, settings);

it("should return correct id", () => {
  expect(platform.id()).toBe("id-zerodha");
});
