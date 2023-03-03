import Kuvera from "./platforms/kuvera";
import Zerodha from "./platforms/zerodha";
import Vested from "./platforms/vested";
import Platform from "./platforms/platform";

const PLATFORMS = [new Kuvera(), new Vested(), new Zerodha()];

export default class Platforms {
  static all(): Array<Platform> {
    return PLATFORMS;
  }

  static byId(id: String): Platform {
    return PLATFORMS.find((platform) => platform.id() === id);
  }

  static byApi(api: URL): Platform {
    const apiHost = api.hostname;
    return PLATFORMS.find((platform) => platform.txnApi().hostname === apiHost);
  }
}
