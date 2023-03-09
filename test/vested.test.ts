import { Ghostfolio } from "../src/ghostfolio";
import Vested from "../src/platforms/vested";
import { SpecHelper as sh } from "./spec_helper";

const vh = sh.Vested;
const gen = sh.Vested.TxnGenerator;
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

  const TXNS = [
    gen.dividend("GOOG", "Aug 15, 2022", 20),
    gen.dividendTax("GOOG", "Aug 15, 2022", 2),
    gen.sell("META", "Aug 03, 2022", 190, 7),
    gen.buy("COIN", "Jul 28, 2022", 46, 26),
    gen.buy("MSFT", "Jul 10, 2022", 260, 0.5),
    gen.cancelled("ABNB", "Jul 10, 2022", 12),
    gen.sell("AMZN", "Jul 10, 2022", 150, 15),
    gen.buy("GOOG", "Jul 05, 2022", 2246, 1),
    gen.instantFunding("Jul 05, 2022"),
    gen.buy("QQQM", "Jun 29, 2022", 117, 0.1),
    gen.buy("BABA", "Jun 29, 2022", 134, 10),
    gen.rejected("ABNB", "Jun 28, 2022", 43),
    gen.buy("META", "Jun 28, 2022", 163, 15),
    gen.buy("AMZN", "Jun 28, 2022", 108, 23),
    gen.deposit("Jun 28, 2022")
  ]

  describe("when last txn does not exist", () => {
    const lastTxn = undefined;
    const accountId = 'random-account-id';

    test("should not return any new txn", () => {
      const txns = [
        gen.cancelled("ABNB", "Jul 10, 2022", 12),
        gen.instantFunding("Jul 05, 2022"),
        gen.rejected("ABNB", "Jun 28, 2022", 43),
        gen.deposit("Jun 28, 2022")
      ];
      const response = vh.getResponse(txns);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(0);
      expect(latestTxnIndex).toStrictEqual(-1);
    });

    test("should return one new txn", () => {
      const txns = [
        gen.buy("AMZN", "Jun 28, 2022", 108, 23),
        gen.deposit("Jun 28, 2022"),
      ];
      const response = vh.getResponse(txns);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(1);
      expect(latestTxnIndex).toStrictEqual(0);
    });

    test("should return all new txns", () => {
      const response = vh.getResponse(TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(11);
      expect(latestTxnIndex).toStrictEqual(0);
    });
  });

  describe("when last txn exists", () => {
    const accountId = 'random-account-id';
    const Type = Ghostfolio.Type;

    test("should return all new txns", () => {
      const response = vh.getResponse(TXNS);
      
      let res = gen.buy("AMZN", "Jun 28, 2022", 108, 23);
      let lastTxn = vh.responseToTxn(res, accountId, Type.BUY, "BUY");
      var { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(10);
      expect(latestTxnIndex).toStrictEqual(0);

      res = gen.buy("GOOG", "Jul 05, 2022", 2246, 1);
      lastTxn = vh.responseToTxn(res, accountId, Type.BUY, "BUY");
      var { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(6);
      expect(latestTxnIndex).toStrictEqual(0);
    });

    test("should not return any new txns", () => {
      const res = gen.dividend("GOOG", "Aug 15, 2022", 20);
      const lastTxn = vh.responseToTxn(res, accountId, Type.BUY, "BUY");
      const response = vh.getResponse(TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(0);
      expect(latestTxnIndex).toStrictEqual(-1);
    });

    test("should return new txns & latest txn index when they are from same date", () => {
      const res = gen.sell("META", "Aug 03, 2022", 190, 7);
      const lastTxn = vh.responseToTxn(res, accountId, Type.SELL, "SELL");
      const response = vh.getResponse(TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn, accountId);
      expect(newTxns.length).toStrictEqual(2);
      expect(latestTxnIndex).toStrictEqual(0);
    });
  });
});
