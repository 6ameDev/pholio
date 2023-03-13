import Platform from "./platform";
import Validator from "./kuvera_validator";
import { Ghostfolio } from "../ghostfolio";
import Jsun from "../utils/jsun";

const CURRENCY = "INR";

const TXN_TYPE_MAP = {
  buy: Ghostfolio.Type.BUY,
  sell: Ghostfolio.Type.SELL
}

const SCHEME_TO_SYMBOL = {
  "UTI Nifty 50 Index Growth Direct Plan": "0P0000XVU2.BO",
  "UTI Nifty Next 50 Index Growth Direct Plan": "0P0001DI4I.BO",
  "Parag Parikh Flexi Cap Growth Direct Plan": "0P0000YWL1.BO",
  "ICICI Prudential Money Market Growth Direct Plan": "0P0000XUYQ.BO",
  "HDFC Money Market Growth Direct Plan": "0P0000XW6V.BO",
  "ICICI Prudential Gilt Growth Direct Plan": "0P0000XUXV.BO",
}

var SYMBOL_TO_SCHEME: object;

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
    if (SYMBOL_TO_SCHEME) {
      return SYMBOL_TO_SCHEME[symbol];
    }
    console.debug(`Populating SYMBOL_TO_SCHEME cache.`);
    SYMBOL_TO_SCHEME = Jsun.flip(SCHEME_TO_SYMBOL);
    return this.resolveSymbol(symbol);
  }

  findNewTxns(body: string, lastTxn: any, accountId: string): { newTxns: object[]; latestTxnIndex: number } {
    const response = JSON.parse(body);
    try {
      const txns = Validator.validate(response);
      console.debug(`Validated Txns: `, txns);

      if(Array.isArray(txns)) {
        const transformed = this.transformTxns(txns, accountId);
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
    return Ghostfolio.toTransaction(
      SCHEME_TO_SYMBOL[txn.scheme_name],
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
