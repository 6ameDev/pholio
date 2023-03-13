import Platform from "./platform";
import Validator from "./kuvera_validator";
import { Ghostfolio } from "../ghostfolio";
import Configs from "../configs";
import AssetConfig from "../asset_config";

const CURRENCY = "INR";

const TXN_TYPE_MAP = {
  buy: Ghostfolio.Type.BUY,
  sell: Ghostfolio.Type.SELL
}

export default class Kuvera extends Platform {
  name(): string {
    return "Kuvera";
  }

  id(): string {
    return "id".concat("-", this.name().toLowerCase());
  }

  txnApi(): URL {
    return new URL("https://api.kuvera.in/api/v3/portfolio/transactions.json");
  }

  txnPageUrl(): string {
    return "https://kuvera.in/reports/transactions";
  }

  resolveSymbol(symbol: string): string {
    return this._configs.nameBySymbol(symbol);
  }

  findNewTxns(body: string, lastTxn: any):
    { newTxns?: object[]; latestTxnIndex?: number, missing?: {name: string, values: object[]}[] } {
    const response = JSON.parse(body);
    try {
      const txns = Validator.validate(response);
      console.debug(`Validated Txns: `, txns);

      if(Array.isArray(txns)) {
        const account = this._settings.accountByPlatform(this.name());
        const { transformed, missingAssetNames } = this.transformTxns(txns, this._configs, account.id);

        if (missingAssetNames.size > 0)
          return { missing: [{ name: "Configs.Asset", values: this.missingAssetConfigs(missingAssetNames) }] };

        return this.filterNewTxns(transformed, lastTxn);
      }
    } catch (error) {
      console.error(`${this.name()}: Error while finding new txns. \nJson Response: %o`, response);
    }
    return { newTxns: [], latestTxnIndex: -1 };
  }

  private missingAssetConfigs(assetNames: Set<string>): AssetConfig[] {
    return Array.from(assetNames).map((name) => {
      return new AssetConfig(name, "");
    })
  }

  private transformTxns(txns: Array<object>, configs: Configs, accountId: string) {
    const { transformed, missingAssetNames } = txns.reduce((result: any, txn: any) => {
      const transformed = this.transformTxn(txn, configs, accountId);
      if (transformed.symbol.length > 0) {
        result.transformed.push(this.transformTxn(txn, configs, accountId));
      } else {
        result.missingAssetNames.add(txn.scheme_name);
      }
      return result;
    }, {transformed: [], missingAssetNames: new Set()});
    return { transformed, missingAssetNames };
  }

  private transformTxn(txn: any, configs: Configs, accountId: string) {
    return Ghostfolio.toTransaction(
      configs.symbolByName(txn.scheme_name),
      TXN_TYPE_MAP[txn.trans_type],
      0,
      CURRENCY,
      txn.units,
      txn.nav,
      Ghostfolio.DataSource.YAHOO,
      new Date(txn.order_date),
      TXN_TYPE_MAP[txn.trans_type],
      accountId
    );
  }
}
