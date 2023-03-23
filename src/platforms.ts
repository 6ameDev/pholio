import Kuvera from "./platforms/kuvera";
import Zerodha from "./platforms/zerodha";
import Vested from "./platforms/vested";
import Platform from "./platforms/platform";
import AssetConfigs from "./models/asset-configs";
import PlatformConfigs from "./models/platform-configs";

export default class Platforms {
  private static instance: Platforms;

  private _platforms: Platform[];

  private constructor() {
    this._platforms = [new Kuvera(), new Vested(), new Zerodha()];
  }

  static getInstance(): Platforms {
    if (!Platforms.instance) {
      Platforms.instance = new Platforms();
    }
    return Platforms.instance;
  }

  static allNames(): string[] {
    return ["Kuvera", "Vested", "Zerodha"];
  }

  all(): Array<Platform> {
    return this._platforms;
  }

  byApi(api: URL): Platform {
    const { hostname: apiHost, pathname: apiPath } = api;
    return this._platforms.find((platform) => {
      const { hostname, pathname } = platform.txnApi();
      return hostname === apiHost && pathname === apiPath;
    });
  }
}
