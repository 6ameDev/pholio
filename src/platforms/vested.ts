import Platform from "./platform";

export default class Vested implements Platform {
  name(): String {
    return "Vested";
  }
  id(): String {
    return "id".concat("-", this.name().toLowerCase());
  }
  txnApi(): URL {
    return new URL("https://app.vestedfinance.com/transaction-history");
  }
  txnPageUrl(): String {
    return "https://app.vestedfinance.com/transaction-history";
  }
}
