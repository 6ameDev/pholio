import { DePagination } from "./types/depagination.type";
import { DePaginationStatus as Status } from "./types/depagination-status.type";
import Meth from "../utils/meth";
import { isEqual } from "lodash";

export interface DepaginationResult {
  status: Status;
  transactions?: any[];
  dePagination?: DePagination;
}

export default class Depaginator {
  private transactions: Map<number, any[]>;

  constructor() {
    this.transactions = new Map();
  }

  dePaginate(transactions: any[], pagination?: DePagination): DepaginationResult {
    if (!pagination) {
      return { status: "finished", transactions };
    }

    const { page, totalPages } = pagination;

    if (this.isValid(page, transactions)) {
      if (page === 1) this.transactions.clear();

      this.transactions.set(page, transactions);

      const status = page === totalPages ? "finished" : "continuing";
      const collectedTransactions = this.transactionsArray();
      return { status: status, transactions: collectedTransactions, dePagination: pagination };
    }

    return { status: "failed" };
  }

  private transactionsArray() {
    return [ ...this.transactions.values() ].flat();
  }

  private isValid(page: number, transactions: any[]) {
    if (!transactions.length) return false;

    const collectedPages = [ ...this.transactions.keys() ];
    const expectedPages = Meth.sequence(1, (page-1));

    return isEqual(collectedPages, expectedPages);
  }
}
