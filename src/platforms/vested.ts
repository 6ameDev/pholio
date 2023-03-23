import Jsun from "../utils/jsun";
import Str from "../utils/str";
import Platform from "./platform";
import Validator from "./vested_validator";
import { GhostfolioType as GfType } from "../models/enums/ghostfolio-type.enum";
import Ghostfolio from "../models/ghostfolio";
import { GhostfolioDataSource as GfDataSource } from "../models/enums/ghostfolio-datasource.enum";
import Depaginator, { DepaginationResult } from "../models/depaginator";
import PlatformConfigs from "../models/platform-configs";
import { TransformResult } from "../models/interfaces/transform-result.interface";
import AssetConfigs from "../models/asset-configs";
import Filter from "../models/filter";

const TXN_RESPONSE_PATH = ["props", "initialReduxState", "transactionHistory", "userTransHistory"];
const RESPONSE_BOUNDS = ['<script id="__NEXT_DATA__" type="application/json">', "</script>"];

const TXN_TYPE_MAP = {
  SPUR: { type: GfType.BUY, comment: 'BUY' },
  SSAL: { type: GfType.SELL, comment: 'SELL' },
  DIV: { type: GfType.DIVIDEND, comment: 'DIVIDEND' },
  DIVTAX: { type: GfType.ITEM, comment: 'DIVIDEND TAX' }
}

const CURRENCY = 'USD';

export default class Vested extends Platform {

  constructor() {
    super(new Depaginator(), new Filter());
  }

  name(): string {
    return "Vested";
  }

  txnApi(): URL {
    return new URL("https://app.vestedfinance.com/transaction-history");
  }

  txnPageUrl(): string {
    return "https://app.vestedfinance.com/transaction-history";
  }

  resolveSymbol(symbol: string, configs: AssetConfigs): string {
    return symbol;
  }

  dePaginate(body: any): DepaginationResult {
    const response = this.jsonParse(body);
    const validated = Validator.validate(response);
    console.debug(`Validated Response: `, validated);

    const transactions = Jsun.walk(validated, TXN_RESPONSE_PATH) as any[];
    return this.depaginator.dePaginate(transactions);
  }

  transform(transactions: any[]): Promise<TransformResult> {
    return this.transformTxns(transactions).then(
      (transformed) => {
        return { activities: transformed };
      },
      (reason) => {
        console.error(`Failed to transform. Reason: %o`, reason);
        return {};
      }
    );
  }

  private async transformTxns(txns: Array<object>) {
    const platformConfigs = await PlatformConfigs.fetch();
    const accountId = platformConfigs.configByPlatform(this.name()).id;

    return txns.reduce((result: any, txn: any) => {
      result.push(this.transformTxn(txn, accountId));
      return result;
    }, []);
  }

  private transformTxn(txn: any, accountId: string) {
    return Ghostfolio.createActivity(
      txn.symbol,
      TXN_TYPE_MAP[txn.type].type,
      txn.commission,
      CURRENCY,
      txn.quantity,
      txn.fillPrice || txn.amount,
      GfDataSource.YAHOO,
      new Date(txn.date),
      TXN_TYPE_MAP[txn.type].comment,
      accountId
    );
  }

  private jsonParse(body: string): object {
    const response = Str.subString(body, RESPONSE_BOUNDS);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error(`${this.name()}: Failed to parse transactions. Body: ${body}`);
    }
  }
}
