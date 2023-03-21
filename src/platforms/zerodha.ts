import Platform, { NewTxnsWithMeta } from "./platform";
import Validator from "./zerodha_validator";
import Ghostfolio from "../models/ghostfolio";
import AssetConfigs from "../models/asset-configs";
import { GhostfolioType as GfType } from "../models/enums/ghostfolio-type.enum";
import { GhostfolioDataSource as GfDataSource } from "../models/enums/ghostfolio-datasource.enum";
import { GhostfolioActivity } from "../models/interfaces/ghostfolio-activity.interface";
import { AssetConfig } from "../models/interfaces/asset-config.interface";

const CURRENCY = "INR";

const TXN_TYPE_MAP = {
  buy: GfType.BUY,
  sell: GfType.SELL
}

const EXCHANGE_SYMBOL_SUFFIX_MAP = {
  NSE: "NS",
  BSE: "BO"
}

export default class Zerodha extends Platform {

  private _newAssetConfigs: object = {};

  name(): string {
    return "Zerodha";
  }

  txnApi(): URL {
    return new URL("https://console.zerodha.com/api/reports/tradebook");
  }

  txnPageUrl(): string {
    return "https://console.zerodha.com/reports/tradebook";
  }

  resolveSymbol(symbol: string): string {
    return symbol;
  }

  findNewTxns(body: string, lastTxn: any): NewTxnsWithMeta {
      const response = JSON.parse(body);
      try {
        const validated: any = Validator.validate(response);
        const txns = validated.data.result;
        console.debug(`Validated Txns: `, txns);

        if(Array.isArray(txns)) {
          const { transformed, cachedConfigs } = this.transformTxns(txns, this.assetConfigs, this.accountId);
          const newAssetConfigs = this.configsFromCache(cachedConfigs)
          const filteredTxns = this.filterNewTxns(transformed, lastTxn);
          return { ...filteredTxns, toStore: newAssetConfigs };
        }
      } catch (error) {
        console.error(`${this.name()}: Error while finding new txns. \nJson Response: %o`, response);
      }
    return { newTxns: [], latestTxnIndex: -1 };
  }

  private configsFromCache(cachedConfigs: object): AssetConfig[] {
    return Object.entries(cachedConfigs).map((configArr) => {
      const [name, symbol] = configArr;
      return { name, symbol };
    })
  }

  private transformTxns(txns: Array<object>, configs: AssetConfigs, accountId: string) {
    const { transformed, cachedConfigs } = txns.reduce((result: any, txn: any) => {
      const cache = result.cachedConfigs;
      const { activity, toCache } = this.transformTxn(txn, configs, cache, accountId);
      result.transformed.push(activity);

      if (toCache) {
        const { key, value } = toCache;
        result.cachedConfigs[key] = value;
      }

      return result;
    }, {transformed: [], cachedConfigs: {}});
    return { transformed, cachedConfigs };
  }

  private transformTxn(txn: any, configs: AssetConfigs, cache: object, accountId: string):
    { activity: GhostfolioActivity, toCache: any } {

    const { symbol, toCache } = this.toSymbol(txn, configs, cache);
    const activity = Ghostfolio.createActivity(
      symbol,
      TXN_TYPE_MAP[txn.trade_type],
      0,
      CURRENCY,
      txn.quantity,
      txn.price,
      GfDataSource.YAHOO,
      new Date(txn.trade_date),
      TXN_TYPE_MAP[txn.trade_type],
      accountId
    );
    return { activity, toCache };
  }

  private toSymbol(txn: any, configs: AssetConfigs, cache: object): { symbol: string, toCache?: object } {
    const name = txn.tradingsymbol;

    const cachedSymbol = cache[name];
    if (cachedSymbol) return { symbol: cachedSymbol };

    const fetchedSymbol = configs.symbolByName(name);
    if (fetchedSymbol.length > 0) return { symbol: fetchedSymbol };

    const suffix = EXCHANGE_SYMBOL_SUFFIX_MAP[txn.exchange];
    const symbol = `${name}.${suffix}`;
    return { symbol, toCache: { key: name, value: symbol } };
  }
}
