import { Ghostfolio } from "../ghostfolio";
import Jsun from "../utils/jsun";
import Str from "../utils/str";
import Platform from "./platform";

const TXN_RESPONSE_PATH = ["props", "initialReduxState", "transactionHistory", "userTransHistory"];
const RESPONSE_BOUNDS = ['<script id="__NEXT_DATA__" type="application/json">', "</script>"];

const TXN_TYPE_MAP = {
  SPUR: { type: Ghostfolio.Type.BUY, comment: 'BUY' },
  SSAL: { type: Ghostfolio.Type.SELL, comment: 'SELL' },
  DIV: { type: Ghostfolio.Type.DIVIDEND, comment: 'DIVIDEND' },
  DIVTAX: { type: Ghostfolio.Type.ITEM, comment: 'DIVIDEND TAX' }
}

const TXN_TYPE_FILTER = (txn) => {
  const VALID_TXN_TYPES = Object.keys(TXN_TYPE_MAP);
  return VALID_TXN_TYPES.includes(txn.type);
};

const CURRENCY = 'USD';

export default class Vested extends Platform {
  name(): string {
    return "Vested";
  }

  id(): string {
    return "id".concat("-", this.name().toLowerCase());
  }

  txnApi(): URL {
    return new URL("https://app.vestedfinance.com/transaction-history");
  }

  txnPageUrl(): string {
    return "https://app.vestedfinance.com/transaction-history";
  }

  findNewTxns(body: string, lastTxn: any): { newTxns: object[]; latestTxnIndex: number } {
    try {
      const response = this.toJsonResponse(body);
      const txns = Jsun.walk(response, TXN_RESPONSE_PATH);

      if (Array.isArray(txns)) {
        const transformed = this.transformTxns(txns, TXN_TYPE_FILTER);
        return this.filterNewTxns(transformed, lastTxn);
      }
    } catch (error) {
      console.error(`${this.name()}: Failed to find new txns`);
    }
    return { newTxns: [], latestTxnIndex: -1 };
  }

  private transformTxns(txns: Array<object>, filter: (txn: object) => boolean) {
    let ignored = new Set();
    const transformed = txns.reduce((result: any, txn: any) => {
      if (filter(txn)) {
        result.push(this.transformTxn(txn))
      } else {
        ignored.add(txn.type)
      }
      return result;
    }, []);

    if (ignored.size > 0)
      console.log(`${this.name()}: Transactions of type ${Array.from(ignored)} were ignored`)

    return transformed;
  }

  private transformTxn(txn: any, accountId?: string) {
    return Ghostfolio.toTransaction(
      txn.symbol,
      this.resolveType(txn),
      txn.commission,
      CURRENCY,
      this.resolveQuantity(txn),
      this.resolveUnitPrice(txn),
      Ghostfolio.DataSource.YAHOO,
      new Date(txn.date),
      this.resolveComment(txn),
      accountId
    );
  }

  private resolveQuantity(txn) {
    const type = this.resolveType(txn);
    if (type === Ghostfolio.Type.DIVIDEND || type === Ghostfolio.Type.ITEM) {
      return 1;
    }
    return parseFloat(txn.quantity);
  }

  private resolveUnitPrice(txn) {
    const type = this.resolveType(txn);
    if (type === Ghostfolio.Type.DIVIDEND || type === Ghostfolio.Type.ITEM) {
      return parseFloat(txn.amount);
    }
    return parseFloat(txn.fillPrice);
  }

  private resolveType(txn) {
    return TXN_TYPE_MAP[txn.type].type
  }

  private resolveComment(txn) {
    return TXN_TYPE_MAP[txn.type].comment
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
