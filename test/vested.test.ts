import Vested from "../src/platforms/vested";
import { SpecHelper as sh } from "./spec_helper";

const vh = sh.Vested;
const platform = new Vested();

it("should return correct id", () => {
  expect(platform.id()).toBe("id-vested");
});

describe("when platform transactions are ordered new to old", () => {
  describe("when last txn does not exist", () => {
    const lastTxn = undefined;
    const accountId = 'random-account-id';

    test("should not return any new txn", () => {
      const response = vh.getResponse(vh.TXNS.slice(0, 1));

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(0);
      expect(latestTxnIndex).toStrictEqual(-1);
    });

    test("should return one new txn", () => {
      const response = vh.getResponse(vh.TXNS.slice(7));

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(1);
      expect(latestTxnIndex).toStrictEqual(0);
    });

    test("should return all new txns", () => {
      const response = vh.getResponse(vh.TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(7);
      expect(latestTxnIndex).toStrictEqual(0);
    });
  });
});
