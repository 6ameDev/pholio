import Transaction from "../storage/transaction";
import Alert from "../utils/alert";
import { isEqual } from "lodash";

export default abstract class Platform {
  abstract name(): string;

  abstract id(): string;

  abstract txnApi(): URL;

  abstract txnPageUrl(): string;

  abstract findNewTxns(
    body: string,
    lastTxn: any,
    accountId: string
  ): { newTxns: Array<object>; latestTxnIndex: number };

  async setLastTxn(txn: any) {
    return Transaction.set(txn, Transaction.genKey(this.name()));
  }

  getLastTxn() {
    return Transaction.get(Transaction.genKey(this.name()));
  }

  resetLastTxn() {
    return Transaction.reset(Transaction.genKey(this.name()));
  }

  filterNewTxns(allTxns: Array<any>, lastTxn: any): { newTxns: object[]; latestTxnIndex: number } {
    if (lastTxn) {
      lastTxn["accountId"] = lastTxn["accountId"]; // assists isEqual matching when accountId is undefined
      const index = allTxns.findIndex(txn => isEqual(txn, lastTxn));
      const preLastTxn = allTxns.slice(0, index);
      const postLastTxn = allTxns.slice(index + 1);
      const lastPostLastTxn = postLastTxn.slice(-1)[0];

      if (preLastTxn.length > 0 && preLastTxn[0].date > lastTxn.date) {
        return {newTxns: preLastTxn, latestTxnIndex: 0};
      }
      if (postLastTxn.length > 0 && lastPostLastTxn.date > lastTxn.date) {
        return {newTxns: postLastTxn, latestTxnIndex: postLastTxn.length - 1};
      }

      console.warn(
        `Unable to identify new set of txns.
         Last Txn Index: ${index}.
         Last Txn: %o.
         Pre-LastTxn: %o.
         Post-LastTxn: %o`,
         lastTxn, preLastTxn, postLastTxn
      );

      return { newTxns: [], latestTxnIndex: -1 };
    } else {
      return {
        newTxns: allTxns,
        latestTxnIndex: this.findLatestIndex(allTxns),
      };
    }
  }

  private findLatestIndex(txns) {
    const first = txns[0];
    const last = txns.slice(-1)[0];
    if (first !== last && first.date === last.date) {
      Alert.error(`Failed to identify latest txn`);
      return -1;
    }
    return first.date > last.date ? 0 : txns.length - 1;
  }
}
