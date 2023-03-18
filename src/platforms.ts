import Kuvera from "./platforms/kuvera";
import Zerodha from "./platforms/zerodha";
import Vested from "./platforms/vested";
import Platform from "./platforms/platform";
import AssetConfigs from "./models/asset-configs";
import PlatformConfigs from "./models/platform-configs";

export default class Platforms {
  private _assetConfigs: AssetConfigs;
  private _platformConfigs: PlatformConfigs;
  private _platforms: Platform[];

  constructor(assetConfigs: AssetConfigs, platformConfigs: PlatformConfigs) {
    this._assetConfigs = assetConfigs;
    this._platformConfigs = platformConfigs;
    this._platforms = [
      new Kuvera(this._platformConfigs, this._assetConfigs),
      new Vested(this._platformConfigs, this._assetConfigs),
      new Zerodha(this._platformConfigs, this._assetConfigs),
    ]
  }

  all(): Array<Platform> {
    return this._platforms;
  }

  static allNames(): string[] {
    return ["Kuvera", "Vested", "Zerodha"];
  }

  byApi(api: URL): Platform {
    const { hostname: apiHost, pathname: apiPath } = api;
    return this._platforms.find((platform) => {
      const { hostname, pathname } = platform.txnApi();
      return hostname === apiHost && pathname === apiPath;
    });
  }
}
