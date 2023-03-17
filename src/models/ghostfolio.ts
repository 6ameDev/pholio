import Storage from "./storage";
import { GhostfolioType as Type } from "./enums/ghostfolio-type.enum";
import { GhostfolioConfig as Config } from "./interfaces/ghostfolio-config.interface";
import { GhostfolioActivity as Activity } from "./interfaces/ghostfolio-activity.interface";
import { GhostfolioDataSource as DataSource } from "./enums/ghostfolio-datasource.enum";
import { GhostfolioImport as Import } from "./interfaces/ghostfolio-import.interface";

const STORAGE_KEY = "key-ghostfolio-config";

const parse = (serialised: string) => {
  const json = JSON.parse(serialised);
  return json as Config;
};

const stringify = (config: Config): string => {
  return JSON.stringify(config, ["host", "securityToken"], ' ');
};

export default class Ghostfolio {
  static fetchConfig(): Promise<Config> {
    console.debug(`Received request to retrieve Ghostfolio Config.`);
    return Storage.get<Config>(STORAGE_KEY, parse);
  }

  static saveConfig(config: Config) {
    console.debug(`Received request to store Ghostfolio Config.`);
    return Storage.set<Config>(STORAGE_KEY, config, stringify);
  }

  static saveAccessToken(token: string, config: Config) {
    console.debug(`Received request to store Ghostfolio Access Token.`);
    config.accessToken = token;
    return Storage.set<Config>(STORAGE_KEY, config, stringify);
  }

  static createActivity(
    symbol: string, type: Type, fee: number, currency: string,
    quantity: number, unitPrice: number, dataSource: DataSource,
    date: Date, comment?: string, accountId?: string
    ): Activity {
      return {
        symbol, type, fee, currency, quantity, unitPrice,
        dataSource: this.resolveSource(type, dataSource),
        date, comment, accountId
      };
  }

  static createImport(activities: Activity[]): Import {
    return {
      meta: { date: new Date(), version: "production" },
      activities: activities,
    };
  }

  private static resolveSource(type: Type, dataSource: DataSource) {
    return (type === Type.ITEM) ? DataSource.MANUAL : dataSource;
  }
}
