import Filter from "../filter";
import Transaction from "../transaction";
import AssetConfigs from "../asset-configs";
import Depaginator, { DepaginationResult } from "../depaginator";
import { TransformResult } from "../interfaces/transform-result.interface";
import { FilterNewResult } from "../interfaces/filter-new-result.interface";
import { GhostfolioActivity } from "../interfaces/ghostfolio/ghostfolio-activity.interface";

export default abstract class Platform {

  depaginator: Depaginator<any>;
  filter: Filter;

  constructor(depaginator: Depaginator<any>, filter: Filter) {
    this.filter = filter;
    this.depaginator = depaginator;
  }

  readonly abstract locale: string;

  abstract name(): string;

  abstract txnApi(): URL;

  abstract txnPageUrl(): string;

  abstract resolveSymbol(symbol: string, configs: AssetConfigs): string;

  abstract dePaginate(response: string): DepaginationResult<any>;

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
