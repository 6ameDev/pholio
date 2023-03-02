import Platform from "./platform";

export default class Zerodha implements Platform {
  name(): String {
    return "Zerodha";
  }
  id(): String {
    return "id".concat("-", this.name().toLowerCase());
  }
  txnApi(): URL {
    return new URL("https://console.zerodha.com/reports/tradebook");
  }
  txnPageUrl(): String {
    return "https://console.zerodha.com/reports/tradebook";
  }
}
