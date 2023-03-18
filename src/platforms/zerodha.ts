import Platform from "./platform";

export default class Zerodha extends Platform {
  name(): string {
    return "Zerodha";
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

  findNewTxns(body: string, lastTxn: any):
    { newTxns?: object[]; latestTxnIndex?: number, missing?: {name: string, values: object[]}[] } {
    return { newTxns: [], latestTxnIndex: -1 };
  }
}
