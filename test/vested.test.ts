import { baseMocks } from "./spec_helper";
import vh from "./vested_helper";
import Vested from "../src/platforms/vested";
import { Ghostfolio } from "../src/ghostfolio";
import Configs from "../src/configs";
import Settings from "../src/settings";

baseMocks();
const txnGen = vh.TxnGenerator;
const activityGen = vh.GfActivityGenerator;

const configs = new Configs([]);
const settings = new Settings("", []);
const platform = new Vested(configs, settings);

const accountId = 'random-account-id';

const accountByPlatformMock = jest
  .spyOn(Settings.prototype, "accountByPlatform")
  .mockImplementation((name: string) => {
    return { name, id: accountId };
  });

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
    txnGen.dividend("GOOG", "Aug 15, 2022", 20),
    txnGen.dividendTax("GOOG", "Aug 15, 2022", 2),
    txnGen.sell("META", "Aug 03, 2022", 190, 7),
    txnGen.buy("COIN", "Jul 28, 2022", 46, 26),
    txnGen.buy("MSFT", "Jul 10, 2022", 260, 0.5),
    txnGen.cancelled("ABNB", "Jul 10, 2022", 12),
    txnGen.sell("AMZN", "Jul 10, 2022", 150, 15),
    txnGen.buy("GOOG", "Jul 05, 2022", 2246, 1),
    txnGen.instantFunding("Jul 05, 2022"),
    txnGen.buy("QQQM", "Jun 29, 2022", 117, 0.1),
    txnGen.buy("BABA", "Jun 29, 2022", 134, 10),
    txnGen.rejected("ABNB", "Jun 28, 2022", 43),
    txnGen.buy("META", "Jun 28, 2022", 163, 15),
    txnGen.buy("AMZN", "Jun 28, 2022", 108, 23),
    txnGen.deposit("Jun 28, 2022")
  ]

  describe("when last txn does not exist", () => {
    const lastTxn = undefined;

    describe("when no activity has been done", () => {
      test("should not return any new txn", () => {
        const response = vh.getResponse([]);
  
        const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
        expect(newTxns!.length).toStrictEqual(0);
        expect(latestTxnIndex).toStrictEqual(-1);
      });
    })

    describe("when only deposit has been made", () => {
      test("should not return any new txn", () => {
        const response = vh.getResponse(txnGen.deposit("Jun 28, 2022"));
  
        const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
        expect(newTxns!.length).toStrictEqual(0);
        expect(latestTxnIndex).toStrictEqual(-1);
      });
    })

    describe("when no securities have been bought or sold", () => {
      test("should not return any new txn", () => {
        const txns = [
          txnGen.cancelled("ABNB", "Jul 10, 2022", 12),
          txnGen.instantFunding("Jul 05, 2022"),
          txnGen.rejected("ABNB", "Jun 28, 2022", 43),
          txnGen.deposit("Jun 28, 2022")
        ];
        const response = vh.getResponse(txns);
  
        const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
        expect(newTxns!.length).toStrictEqual(0);
        expect(latestTxnIndex).toStrictEqual(-1);
      });
    })

    test("should return one new txn", () => {
      const txns = [
        txnGen.buy("AMZN", "Jun 28, 2022", 108, 23),
        txnGen.deposit("Jun 28, 2022"),
      ];
      const response = vh.getResponse(txns);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(1);
      expect(latestTxnIndex).toStrictEqual(0);
    });

    test("should return all new txns", () => {
      const response = vh.getResponse(TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(11);
      expect(latestTxnIndex).toStrictEqual(0);
    });
  });

  describe("when last txn exists", () => {
    test("should return all new txns", () => {
      const response = vh.getResponse(TXNS);

      var lastTxn = activityGen.buy("AMZN", "Jun 28, 2022", 108, 23, accountId);
      var { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(10);
      expect(latestTxnIndex).toStrictEqual(0);

      var lastTxn = activityGen.buy("GOOG", "Jul 05, 2022", 2246, 1, accountId);
      var { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(6);
      expect(latestTxnIndex).toStrictEqual(0);
    });

    test("should not return any new txns", () => {
      const lastTxn = activityGen.dividend("GOOG", "Aug 15, 2022", 20, accountId);
      const response = vh.getResponse(TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(0);
      expect(latestTxnIndex).toStrictEqual(-1);
    });

    test("should return new txns & latest txn index when they are from same date", () => {
      const lastTxn = activityGen.sell("META", "Aug 03, 2022", 190, 7, accountId);
      const response = vh.getResponse(TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(2);
      expect(latestTxnIndex).toStrictEqual(0);
    });
  });
});
