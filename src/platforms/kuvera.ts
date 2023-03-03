import Platform from "./platform";

export default class Kuvera implements Platform {
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

  findNewTxns(body: string,lastTxn: any): { newTxns: object[]; latestTxnIndex: number } {
    return { newTxns: [], latestTxnIndex: -1 };
  }
}
