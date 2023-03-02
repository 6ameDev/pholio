export default interface Platform {
  name(): string;
  id(): string;
  txnApi(): URL;
  txnPageUrl(): string;
}
