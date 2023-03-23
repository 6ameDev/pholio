import Filter from "../models/filter";
import Transaction from "../models/transaction";
import AssetConfigs from "../models/asset-configs";
import Depaginator, { DepaginationResult } from "../models/depaginator";
import { TransformResult } from "../models/interfaces/transform-result.interface";
import { FilterNewResult } from "../models/interfaces/filter-new-result.interface";
import { GhostfolioActivity } from "../models/interfaces/ghostfolio-activity.interface";

export default abstract class Platform {

  depaginator: Depaginator;
  filter: Filter;

  constructor(depaginator: Depaginator, filter: Filter) {
    this.filter = filter;
    this.depaginator = depaginator;
  }

  abstract name(): string;

  abstract txnApi(): URL;

  abstract txnPageUrl(): string;

  abstract resolveSymbol(symbol: string, configs: AssetConfigs): string;

  abstract dePaginate(response: any): DepaginationResult;

  abstract transform(transactions: any[]): Promise<TransformResult>;

  filterNew(allActivities: GhostfolioActivity[], last?: GhostfolioActivity): FilterNewResult {
    return this.filter.filterNew(allActivities, last);
  }

  async setLastTxn(txn: any) {
    return Transaction.set(txn, Transaction.genKey(this.name()));
  }

  getLastTxn() {
    return Transaction.get(Transaction.genKey(this.name()));
  }

  resetLastTxn() {
    return Transaction.reset(Transaction.genKey(this.name()));
  }
}
