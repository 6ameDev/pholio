import Kuvera from "./platforms/kuvera";
import Zerodha from "./platforms/zerodha";
import Vested from "./platforms/vested";
import Platform from "./platforms/platform";
import AssetConfigs from "./models/asset-configs";
import Settings from "./models/settings";

export default class Platforms {
  private _configs: AssetConfigs;
  private _settings: Settings;
  private _platforms: Platform[];

  constructor(configs: AssetConfigs, settings: Settings) {
    this._configs = configs;
    this._settings = settings;
    this._platforms = [
      new Kuvera(this._configs, this._settings),
      new Vested(this._configs, this._settings),
      new Zerodha(this._configs, this._settings),
    ]
  }

  all(): Array<Platform> {
    return this._platforms;
  }

  static allNames(): string[] {
    let _;
    const platforms = [new Kuvera(_, _), new Vested(_, _), new Zerodha(_, _)];
    return platforms.map(platform => platform.name());
  }

  byApi(api: URL): Platform {
    const { hostname: apiHost, pathname: apiPath } = api;
    return this._platforms.find((platform) => {
      const { hostname, pathname } = platform.txnApi();
      return hostname === apiHost && pathname === apiPath;
    });
  }
}
