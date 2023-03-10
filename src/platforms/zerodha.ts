import { z } from "zod";
import Platform from "./platform";

export default class Zerodha extends Platform {
  name(): string {
    return "Zerodha";
  }

  id(): string {
    return "id".concat("-", this.name().toLowerCase());
  }

  txnApi(): URL {
    return new URL("https://console.zerodha.com/reports/tradebook");
  }

  txnPageUrl(): string {
    return "https://console.zerodha.com/reports/tradebook";
  }

  resolveSymbol(symbol: string): string {
    return symbol;
  }

  findNewTxns(body: string, lastTxn: any, accountId: string): { newTxns: object[]; latestTxnIndex: number } {
    return { newTxns: [], latestTxnIndex: -1 };
  }
}
