import Jsun from "../utils/jsun";
import Str from "../utils/str";
import Platform from "./platform";

const TXN_RESPONSE_PATH = [
  "props",
  "initialReduxState",
  "transactionHistory",
  "userTransHistory",
];
const RESPONSE_BOUNDS = [
  '<script id="__NEXT_DATA__" type="application/json">',
  "</script>",
];

export default class Vested implements Platform {
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
        return { newTxns: txns, latestTxnIndex: -1 };
      }
    } catch (error) {
      console.error(`${this.name()}: Failed to find new txns`);
      return { newTxns: [], latestTxnIndex: -1 };
    }
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
