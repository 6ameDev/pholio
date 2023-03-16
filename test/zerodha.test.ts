import Configs from "../src/models/configs";
import Zerodha from "../src/platforms/zerodha"
import Settings from "../src/models/settings";

const configs = new Configs([]);
const settings = new Settings({ host: "", securityToken: "" }, []);
const platform = new Zerodha(configs, settings);

it("should return correct id", () => {
  expect(platform.id()).toBe("id-zerodha");
});
