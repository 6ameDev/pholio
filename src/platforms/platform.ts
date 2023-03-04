import Transaction from "../storage/transaction";

export default abstract class Platform {
  abstract name(): string;

  abstract id(): string;

  abstract txnApi(): URL;

  abstract txnPageUrl(): string;

  abstract findNewTxns(
    body: string,
    lastTxn: any
  ): { newTxns: Array<object>; latestTxnIndex: number };

  async setLastTxn(txn: any) {
    return Transaction.set(txn, Transaction.genKey(this.name()));
  }

  getLastTxn() {
    return Transaction.get(Transaction.genKey(this.name()));
  }
}
