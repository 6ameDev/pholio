import Transaction from "../models/transaction";
import Alert from "../utils/alert";
import { isEqual } from "lodash";
import AssetConfigs from "../models/asset-configs";
import PlatformConfigs from "../models/platform-configs";
import { AssetConfig } from "../models/interfaces/asset-config.interface";
import { DePagination } from "../models/types/depagination.type";
import { DePaginationStatus } from "../models/types/depagination-status.type";
import Depaginator, { DepaginationResult } from "../models/depaginator";
import { GhostfolioActivity } from "../models/interfaces/ghostfolio-activity.interface";
import { TransformResult } from "../models/interfaces/transform-result.interface";
import { FilterNewResult } from "../models/interfaces/filter-new-result.interface";

interface NewTxnsWithIndex {
  newTxns: object[];
  latestTxnIndex: number;
}

export interface NewTxnsWithMeta {
  newTxns?: object[];
  latestTxnIndex?: number;
  toStore?: AssetConfig[];
  missing?: { name: string; values: object[] }[];
}

export default abstract class Platform {

  depaginator: Depaginator;

  constructor(depaginator: Depaginator) {
    this.depaginator = depaginator;
  }

  abstract name(): string;

  abstract txnApi(): URL;

  abstract txnPageUrl(): string;

  abstract resolveSymbol(symbol: string, configs: AssetConfigs): string;

  abstract dePaginate(response: any): DepaginationResult;

  abstract transform(transactions: any[]): Promise<TransformResult>;

  abstract filterNew(activities: GhostfolioActivity[], last?: GhostfolioActivity): FilterNewResult;

  async setLastTxn(txn: any) {
    return Transaction.set(txn, Transaction.genKey(this.name()));
  }

  getLastTxn() {
    return Transaction.get(Transaction.genKey(this.name()));
  }

  resetLastTxn() {
    return Transaction.reset(Transaction.genKey(this.name()));
  }

  filterNewTxns(allTxns: Array<any>, lastTxn?: any): NewTxnsWithIndex {
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

    if (!(first && last)) {
      return -1;
    }
    if (first !== last && first.date === last.date) {
      Alert.error(`Failed to identify latest txn`);
      return -1;
    }
    return first.date > last.date ? 0 : txns.length - 1;
  }
}
