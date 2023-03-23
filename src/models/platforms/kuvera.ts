import Platform from "./platform";
import Validator from "../validators/kuvera_validator";
import AssetConfigs from "../asset-configs";
import Ghostfolio from "../ghostfolio";
import { GhostfolioType as GfType } from "../enums/ghostfolio-type.enum";
import { GhostfolioDataSource as GfDataSource } from "../enums/ghostfolio-datasource.enum";
import { AssetConfig } from "../interfaces/asset-config.interface";
import Depaginator, { DepaginationResult } from "../depaginator";
import PlatformConfigs from "../platform-configs";
import { TransformResult } from "../interfaces/transform-result.interface";
import Filter from "../filter";
import Transaction from "../interfaces/platforms/kuvera-transaction.interface";

const CURRENCY = "INR";

const TXN_TYPE_MAP = {
  buy: GfType.BUY,
  sell: GfType.SELL
}

export default class Kuvera extends Platform {

  constructor() {
    super(new Depaginator<Transaction>(), new Filter());
  }

  name(): string {
    return "Kuvera";
  }

  txnApi(): URL {
    return new URL("https://api.kuvera.in/api/v3/portfolio/transactions.json");
  }

  txnPageUrl(): string {
    return "https://kuvera.in/reports/transactions";
  }

  resolveSymbol(symbol: string, configs: AssetConfigs): string {
    return configs.nameBySymbol(symbol);
  }

  dePaginate(body: string): DepaginationResult<Transaction> {
    const response = JSON.parse(body);
    const transactions = Validator.validate(response) as Transaction[];
    console.debug(`Validated transactions: `, transactions);

    return this.depaginator.dePaginate(transactions);
  }

  transform(transactions: Transaction[]): Promise<TransformResult> {
    return this.transformTxns(transactions).then(
      (result) => {
        const { transformed, missingAssetNames } = result;
        const missing = this.missingAssetConfigs(missingAssetNames);
        return { activities: transformed, missing };
      },
      (reason) => {
        console.error(`Failed to transform. Reason: %o`, reason);
        return {};
      }
    );
  }

  private missingAssetConfigs(assetNames: Set<string>): AssetConfig[] {
    return Array.from(assetNames).map((name) => {
      return { name, symbol: ""};
    });
  }

  private async transformTxns(transactions: Transaction[]) {
    const assetConfigs = await AssetConfigs.fetch();
    const platformConfigs = await PlatformConfigs.fetch();
    const accountId = platformConfigs.configByPlatform(this.name()).id;

    const { transformed, missingAssetNames } = transactions.reduce((result, txn) => {
      const transformed = this.transformTxn(txn, assetConfigs, accountId);
      if (transformed.symbol.trim().length > 0) {
        result.transformed.push(this.transformTxn(txn, assetConfigs, accountId));
      } else {
        result.missingAssetNames.add(txn.scheme_name);
      }
      return result;
    }, {transformed: [], missingAssetNames: new Set<string>()});
    return { transformed, missingAssetNames };
  }

  private transformTxn(txn: Transaction, configs: AssetConfigs, accountId: string) {
    return Ghostfolio.createActivity(
      configs.symbolByName(txn.scheme_name),
      TXN_TYPE_MAP[txn.trans_type],
      0,
      CURRENCY,
      txn.units,
      txn.nav,
      GfDataSource.YAHOO,
      new Date(txn.order_date),
      TXN_TYPE_MAP[txn.trans_type],
      accountId
    );
  }
}
