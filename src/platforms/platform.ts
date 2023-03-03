export default interface Platform {
  name(): string;

  id(): string;

  txnApi(): URL;

  txnPageUrl(): string;

  findNewTxns(
    body: string,
    lastTxn: any
  ): { newTxns: Array<object>; latestTxnIndex: number };
}
