import Jsun from "../utils/jsun";
import Str from "../utils/str";
import Platform from "./platform";
import Validator from "./vested_validator";
import { GhostfolioType as GfType } from "../models/enums/ghostfolio-type.enum";
import Ghostfolio from "../models/ghostfolio";
import { GhostfolioDataSource as GfDataSource } from "../models/enums/ghostfolio-datasource.enum";

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
  name(): string {
    return "Vested";
  }

  txnApi(): URL {
    return new URL("https://app.vestedfinance.com/transaction-history");
  }

  txnPageUrl(): string {
    return "https://app.vestedfinance.com/transaction-history";
  }

  resolveSymbol(symbol: string): string {
    return symbol;
  }

  findNewTxns(body: string, lastTxn: any):
    { newTxns?: object[]; latestTxnIndex?: number, missing?: {name: string, values: object[]}[] } {
    const response = this.toJsonResponse(body);
    try {
      const validated = Validator.validate(response);
      console.debug(`Validated Response: `, validated);
      const txns = Jsun.walk(validated, TXN_RESPONSE_PATH);

      if (Array.isArray(txns)) {
        const transformed = this.transformTxns(txns, this.accountId);
        return this.filterNewTxns(transformed, lastTxn);
      }
    } catch (error) {
      console.error(`${this.name()}: Error while finding new txns. \nJson Response: %o`, response);
    }
    return { newTxns: [], latestTxnIndex: -1 };
  }

  private transformTxns(txns: Array<object>, accountId: string) {
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

  private toJsonResponse(body: string): object {
    const response = Str.subString(body, RESPONSE_BOUNDS);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error(`${this.name()}: Failed to parse transactions. Body: ${body}`);
    }
  }
}
