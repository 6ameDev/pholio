import Platform from "./platform";
import Validator from "./zerodha_validator";
import Ghostfolio from "../models/ghostfolio";
import AssetConfigs from "../models/asset-configs";
import { GhostfolioType as GfType } from "../models/enums/ghostfolio-type.enum";
import { GhostfolioDataSource as GfDataSource } from "../models/enums/ghostfolio-datasource.enum";
import { GhostfolioActivity } from "../models/interfaces/ghostfolio-activity.interface";
import { AssetConfig } from "../models/interfaces/asset-config.interface";
import Depaginator, { DepaginationResult } from "../models/depaginator";
import PlatformConfigs from "../models/platform-configs";
import { TransformResult } from "../models/interfaces/transform-result.interface";
import { GhostfolioActivity as Activity } from "../models/interfaces/ghostfolio-activity.interface";
import { FilterNewResult } from "../models/interfaces/filter-new-result.interface";

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

  constructor() {
    super(new Depaginator());
  }

  name(): string {
    return "Zerodha";
  }

  txnApi(): URL {
    return new URL("https://console.zerodha.com/api/reports/tradebook");
  }

  txnPageUrl(): string {
    return "https://console.zerodha.com/reports/tradebook";
  }

  resolveSymbol(symbol: string, configs: AssetConfigs): string {
    return configs.nameBySymbol(symbol);
  }

  dePaginate(body: any): DepaginationResult {
    const response = JSON.parse(body);
    if (response.data.state === "SUCCESS") {
      const validated = Validator.validate(response) as any;
      const { data: { pagination, result } } = validated;
      console.debug(`Validated transactions: `, result);

      const { page, total_pages } = pagination;

      const newPagination = { page, totalPages: total_pages };
      return this.depaginator.dePaginate(result, newPagination);
    } else {
      return { status: "skipped" };
    }
  }

  transform(transactions: any[]): Promise<TransformResult> {
    return this.transformTxns(transactions).then(
      (result) => {
        const { transformed, cachedConfigs } = result;
        const newAssetConfigs = this.configsFromCache(cachedConfigs);
        return { activities: transformed, toStore: newAssetConfigs };
      },
      (reason) => {
        console.error(`Failed to transform. Reason: %o`, reason);
        return {};
      }
    );
  }

  filterNew(activities: Activity[], last?: Activity): FilterNewResult {
    const { newTxns, latestTxnIndex } = this.filterNewTxns(activities, last);
    return { activities: newTxns as Activity[], latestIndex: latestTxnIndex };
  }

  private configsFromCache(cachedConfigs: object): AssetConfig[] {
    return Object.entries(cachedConfigs).map((configArr) => {
      const [name, symbol] = configArr;
      return { name, symbol };
    })
  }

  private async transformTxns(txns: Array<object>) {
    const assetConfigs = await AssetConfigs.fetch();
    const platformConfigs = await PlatformConfigs.fetch();
    const accountId = platformConfigs.configByPlatform(this.name()).id;

    const { transformed, cachedConfigs } = txns.reduce((result: any, txn: any) => {
      const cache = result.cachedConfigs;
      const { activity, toCache } = this.transformTxn(txn, assetConfigs, cache, accountId);
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
