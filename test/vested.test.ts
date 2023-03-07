import { Ghostfolio } from "../src/ghostfolio";
import Vested from "../src/platforms/vested";
import { SpecHelper as sh } from "./spec_helper";

const vh = sh.Vested;
const platform = new Vested();

describe("when platform is vested", () => {
  it("should return correct name", () => {
    expect(platform.name()).toBe("Vested");
  });

  it("should return correct id", () => {
    expect(platform.id()).toBe("id-vested");
  });
})

describe("when platform transactions are ordered new to old", () => {
  describe("when last txn does not exist", () => {
    const lastTxn = undefined;
    const accountId = 'random-account-id';

    test("should not return any new txn", () => {
      const cancelledTxns = vh.TXNS.slice(0, 1);
      const response = vh.getResponse(cancelledTxns);

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

  describe("when last txn exists", () => {
    const accountId = 'random-account-id';
    const Type = Ghostfolio.Type;

    test("should return all new txns", () => {
      const response = vh.getResponse(vh.TXNS);
      
      let res = vh.TXNS.slice(-1)[0];
      let lastTxn = vh.responseToTxn(res, accountId, Type.BUY, "BUY");
      var { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(6);
      expect(latestTxnIndex).toStrictEqual(0);

      res = vh.TXNS[4];
      lastTxn = vh.responseToTxn(res, accountId, Type.BUY, "BUY");
      var { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(3);
      expect(latestTxnIndex).toStrictEqual(0);
    });

    test("should not return any new txns", () => {
      const res = vh.TXNS[1];
      const lastTxn = vh.responseToTxn(res, accountId, Type.BUY, "BUY");
      const response = vh.getResponse(vh.TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(0);
      expect(latestTxnIndex).toStrictEqual(-1);
    });

    test("should return new txns & latest txn index when they are from same date", () => {
      const res = vh.TXNS[4];
      const lastTxn = vh.responseToTxn(res, accountId, Type.BUY, "BUY");
      const response = vh.getResponse(vh.TXNS.slice(2));

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(2);
      expect(latestTxnIndex).toStrictEqual(0);
    });
  });
});
