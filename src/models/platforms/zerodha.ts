import Platform from "./platform";
import Validator from "../validators/zerodha_validator";
import Ghostfolio from "../ghostfolio";
import AssetConfigs from "../asset-configs";
import { GhostfolioType as GfType } from "../enums/ghostfolio-type.enum";
import { GhostfolioDataSource as GfDataSource } from "../enums/ghostfolio-datasource.enum";
import { GhostfolioActivity } from "../interfaces/ghostfolio/ghostfolio-activity.interface";
import { AssetConfig } from "../interfaces/asset-config.interface";
import Depaginator, { DepaginationResult } from "../depaginator";
import PlatformConfigs from "../platform-configs";
import { TransformResult } from "../interfaces/transform-result.interface";
import Filter from "../filter";
import Transaction from "../interfaces/platforms/zerodha-transaction.interface";

const CURRENCY = "INR";

const TXN_TYPE_MAP = {
  buy: GfType.BUY,
  sell: GfType.SELL
}

const EXCHANGE_SYMBOL_SUFFIX_MAP = {
  NSE: "NS",
  BSE: "BO"
}

interface toCache {
  key: string;
  value: string
}

export default class Zerodha extends Platform {

  constructor() {
    super(new Depaginator<Transaction>(), new Filter());
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

  dePaginate(body: string): DepaginationResult<Transaction> {
    const response = JSON.parse(body);
    if (response.data.state === "SUCCESS") {
      const validated = Validator.validate(response) as any;
      const { data: { pagination, result } } = validated;
      console.debug(`Validated transactions: `, result);

      const { page, total_pages } = pagination;

      const transactions = result as Transaction[];
      const newPagination = { page, totalPages: total_pages };
      return this.depaginator.dePaginate(transactions, newPagination);
    } else {
      return { status: "skipped" };
    }
  }

  transform(transactions: Transaction[]): Promise<TransformResult> {
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

  private configsFromCache(cachedConfigs: object): AssetConfig[] {
    return Object.entries(cachedConfigs).map((configArr) => {
      const [name, symbol] = configArr;
      return { name, symbol };
    })
  }

  private async transformTxns(transactions: Transaction[]) {
    const assetConfigs = await AssetConfigs.fetch();
    const platformConfigs = await PlatformConfigs.fetch();
    const accountId = platformConfigs.configByPlatform(this.name()).id;

    const { transformed, cachedConfigs } = transactions.reduce((result, txn) => {
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

  private transformTxn(txn: Transaction, configs: AssetConfigs, cache: object, accountId: string):
    { activity: GhostfolioActivity, toCache: toCache } {

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

  private toSymbol(txn: Transaction, configs: AssetConfigs, cache: object): { symbol: string, toCache?: toCache } {
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
