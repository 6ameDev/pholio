export default interface Platform {
  name(): String;
  id(): String;
  txnApi(): URL;
  txnPageUrl(): String;
}
