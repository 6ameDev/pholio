import Platform from "./platform";

export default class Kuvera implements Platform {
  name(): String {
    return "Kuvera";
  }
  id(): String {
    return "id".concat("-", this.name().toLowerCase());
  }
  txnApi(): URL {
    return new URL("https://api.kuvera.in/api/v3/portfolio/transactions.json");
  }
  txnPageUrl(): String {
    return "https://kuvera.in/reports/transactions";
  }
}
