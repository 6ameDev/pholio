import Platform from "./platform";

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
}
