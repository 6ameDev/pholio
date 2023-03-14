import Configs from "../src/models/configs";
import Kuvera from "../src/platforms/kuvera";
import Settings from "../src/models/settings";
import kh from "./kuvera_helper";

const txnGen = kh.TxnGenerator;
const activityGen = kh.GfActivityGenerator;

const configs = new Configs([]);
const settings = new Settings("", []);
const platform = new Kuvera(configs, settings);

const accountId = "test-account-id";

jest.spyOn(Configs.prototype, "symbolByName").mockImplementation((name: string) => {
  const NAME_TO_SYMBOL = {
    "AMC MF 001": "AMC001",
    "AMC MF 002": "AMC002",
    "AMC MF 003": "AMC003",
  }
  return NAME_TO_SYMBOL[name];
});

jest.spyOn(Settings.prototype, "accountByPlatform").mockImplementation((name: string) => {
  return { name, id: accountId };
});

describe("when platform is kuvera", () => {
  it("should return correct name", () => {
    expect(platform.name()).toBe("Kuvera");
  });

  it("should return correct id", () => {
    expect(platform.id()).toBe("id-kuvera");
  });
});

describe("when platform transactions are ordered new to old", () => {

  describe("when last txn does not exist", () => {
    const lastTxn = undefined;

    describe("when no activity has been done", () => {
      test("should not return any new txn", () => {
        const response = kh.getResponse([]);

        const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
        expect(newTxns!.length).toStrictEqual(0);
        expect(latestTxnIndex).toStrictEqual(-1);
      });
    })

    test("should return one new txn", () => {
      const response = kh.getResponse(txnGen.buy("AMC MF 001", "Jun 28, 2022", 105.49, 20.30));

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(1);
      expect(latestTxnIndex).toStrictEqual(0);
    });

    test("should return all new txns", () => {
      const txns = [
        txnGen.sell("AMC MF 001", "Jul 05, 2022", 143.64, 20.30),
        txnGen.buy("AMC MF 002", "Jun 28, 2022", 68.10, 100),
        txnGen.buy("AMC MF 001", "Jun 28, 2022", 105.49, 20.30)
      ]
      const response = kh.getResponse(txns);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(3);
      expect(latestTxnIndex).toStrictEqual(0);
    });
  })

  describe("when last txn exists", () => {
    const TXNS = [
      txnGen.buy("AMC MF 001", "Sep 10, 2022", 124.25, 25.73),
      txnGen.buy("AMC MF 003", "Sep 10, 2022", 58.17, 91.82),
      txnGen.sell("AMC MF 002", "Sep 02, 2022", 104.62, 50),
      txnGen.buy("AMC MF 001", "Aug 25, 2022", 120.73, 46.69),
      txnGen.buy("AMC MF 003", "Aug 13, 2022", 52.27, 63.75),
      txnGen.sell("AMC MF 001", "Jul 05, 2022", 143.64, 20.30),
      txnGen.buy("AMC MF 002", "Jun 28, 2022", 68.10, 100),
      txnGen.buy("AMC MF 001", "Jun 28, 2022", 105.49, 20.30)
    ];

    test("should return all new txns", () => {
      const response = kh.getResponse(TXNS);

      var lastTxn = activityGen.buy("AMC001", "Jun 28, 2022", 105.49, 20.30, accountId);
      var { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(7);
      expect(latestTxnIndex).toStrictEqual(0);

      var lastTxn = activityGen.sell("AMC001", "Jul 05, 2022", 143.64, 20.30, accountId);
      var { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(5);
      expect(latestTxnIndex).toStrictEqual(0);
    });

    test("should not return any new txns", () => {
      const lastTxn = activityGen.buy("AMC001", "Sep 10, 2022", 124.25, 25.73, accountId);
      const response = kh.getResponse(TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(0);
      expect(latestTxnIndex).toStrictEqual(-1);
    });

    test("should return new txns & latest txn index when they are from same date", () => {
      const lastTxn = activityGen.sell("AMC002", "Sep 02, 2022", 104.62, 50, accountId);
      const response = kh.getResponse(TXNS);

      const { newTxns, latestTxnIndex } = platform.findNewTxns(response, lastTxn);
      expect(newTxns!.length).toStrictEqual(2);
      expect(latestTxnIndex).toStrictEqual(0);
    });
  })
})
