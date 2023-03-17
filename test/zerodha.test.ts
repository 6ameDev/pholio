import Zerodha from "../src/platforms/zerodha"
import Settings from "../src/models/settings";
import AssetConfigs from "../src/models/asset-configs";

const configs = new AssetConfigs([]);
const settings = new Settings({ host: "", securityToken: "" }, []);
const platform = new Zerodha(configs, settings);

it("should return correct id", () => {
  expect(platform.id()).toBe("id-zerodha");
});
