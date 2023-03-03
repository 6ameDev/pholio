import Platform from "./platform";

export default class Zerodha implements Platform {
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

  findNewTxns(body: string, lastTxn: any): { newTxns: object[]; latestTxnIndex: number } {
    return { newTxns: [], latestTxnIndex: -1 };
  }
}
