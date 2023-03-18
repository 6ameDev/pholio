import Zerodha from "../src/platforms/zerodha"
import AssetConfigs from "../src/models/asset-configs";
import PlatformConfigs from "../src/models/platform-configs";

const assetConfigs = new AssetConfigs([]);
const platformConfigs = new PlatformConfigs([]);
const platform = new Zerodha(platformConfigs, assetConfigs);

describe("when platform is zerodha", () => {
  it("should return correct name", () => {
    expect(platform.name()).toBe("Zerodha");
  });
})
