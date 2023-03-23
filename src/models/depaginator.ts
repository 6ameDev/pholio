import Meth from "../utils/meth";
import { isEqual } from "lodash";
import { DePagination } from "./interfaces/depagination.interface";
import { DePaginationStatus as Status } from "./types/depagination-status.type";

export interface DepaginationResult<T> {
  status: Status;
  transactions?: T[];
  dePagination?: DePagination;
}

export default class Depaginator<T> {
  private transactions: Map<number, T[]>;

  constructor() {
    this.transactions = new Map();
  }

  dePaginate(transactions: T[], pagination?: DePagination): DepaginationResult<T> {
    if (!pagination) {
      return { status: "finished", transactions };
    }

    const { page, totalPages } = pagination;

    if (page === 1) this.transactions.clear();

    if (this.isValid(page, transactions)) {
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

  private isValid(page: number, transactions: T[]) {
    if (!transactions.length) return false;

    const collectedPages = [ ...this.transactions.keys() ];
    const expectedPages = Meth.sequence(1, (page-1));

    return isEqual(collectedPages, expectedPages);
  }
}
