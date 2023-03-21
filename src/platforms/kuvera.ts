import Platform, { NewTxnsWithMeta } from "./platform";
import Validator from "./kuvera_validator";
import AssetConfigs from "../models/asset-configs";
import Ghostfolio from "../models/ghostfolio";
import { GhostfolioType as GfType } from "../models/enums/ghostfolio-type.enum";
import { GhostfolioDataSource as GfDataSource } from "../models/enums/ghostfolio-datasource.enum";
import { AssetConfig } from "../models/interfaces/asset-config.interface";

const CURRENCY = "INR";

const TXN_TYPE_MAP = {
  buy: GfType.BUY,
  sell: GfType.SELL
}

export default class Kuvera extends Platform {
  name(): string {
    return "Kuvera";
  }

  txnApi(): URL {
    return new URL("https://api.kuvera.in/api/v3/portfolio/transactions.json");
  }

  txnPageUrl(): string {
    return "https://kuvera.in/reports/transactions";
  }

  resolveSymbol(symbol: string): string {
    return this.assetConfigs.nameBySymbol(symbol);
  }

  findNewTxns(body: string, lastTxn: any): NewTxnsWithMeta {
    const response = JSON.parse(body);
    try {
      const txns = Validator.validate(response);
      console.debug(`Validated Txns: `, txns);

      if(Array.isArray(txns)) {
        const { transformed, missingAssetNames } = this.transformTxns(txns, this.assetConfigs, this.accountId);

        if (missingAssetNames.size > 0)
          return { missing: [{ name: "AssetConfig", values: this.missingAssetConfigs(missingAssetNames) }] };

        return this.filterNewTxns(transformed, lastTxn);
      }
    } catch (error) {
      console.error(`${this.name()}: Error while finding new txns. \nJson Response: %o`, response);
    }
    return { newTxns: [], latestTxnIndex: -1 };
  }

  private missingAssetConfigs(assetNames: Set<string>): AssetConfig[] {
    return Array.from(assetNames).map((name) => {
      return { name, symbol: ""};
    });
  }

  private transformTxns(txns: Array<object>, configs: AssetConfigs, accountId: string) {
    const { transformed, missingAssetNames } = txns.reduce((result: any, txn: any) => {
      const transformed = this.transformTxn(txn, configs, accountId);
      if (transformed.symbol.trim().length > 0) {
        result.transformed.push(this.transformTxn(txn, configs, accountId));
      } else {
        result.missingAssetNames.add(txn.scheme_name);
      }
      return result;
    }, {transformed: [], missingAssetNames: new Set()});
    return { transformed, missingAssetNames };
  }

  private transformTxn(txn: any, configs: AssetConfigs, accountId: string) {
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
