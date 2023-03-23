import Kuvera from "../src/platforms/kuvera";
import kh from "./kuvera_helper";
import AssetConfigs from "../src/models/asset-configs";
import PlatformConfigs from "../src/models/platform-configs";

const txnGen = kh.TxnGenerator;
const activityGen = kh.GfActivityGenerator;

let assetFetchSpy;
let platformFetchSpy;
let configByPlatformSpy;
let symbolByNameSpy;

const accountId = 'random-account-id';
const platform = new Kuvera();

beforeAll(() => {
  const platformConfigs = new PlatformConfigs([]);
  platformFetchSpy = jest.spyOn(PlatformConfigs, "fetch").mockResolvedValue(platformConfigs);

  const assetConfigs = new AssetConfigs([]);
  assetFetchSpy = jest.spyOn(AssetConfigs, "fetch").mockResolvedValue(assetConfigs);

  configByPlatformSpy = jest.spyOn(PlatformConfigs.prototype, "configByPlatform").mockImplementation((name: string) => {
    return { name, id: accountId };
  });

  symbolByNameSpy = jest.spyOn(AssetConfigs.prototype, "symbolByName").mockImplementation((name: string) => {
    const NAME_TO_SYMBOL = {
      "AMC MF 001": "AMC001",
      "AMC MF 002": "AMC002",
      "AMC MF 003": "AMC003",
    }
    return NAME_TO_SYMBOL[name];
  });
});

afterAll(() => {
  assetFetchSpy.mockRestore();
  platformFetchSpy.mockRestore();
  configByPlatformSpy.mockRestore();
  symbolByNameSpy.mockRestore();
});

describe("when platform is kuvera", () => {
  it("should return correct name", () => {
    expect(platform.name()).toBe("Kuvera");
  });
});

describe("when platform transactions are ordered new to old", () => {

  describe("when last txn does not exist", () => {
    const lastTxn = undefined;

    describe("when no activity has been done", () => {

      test("should finish depagination with no transactions", () => {
        const response = kh.getResponse([]);
  
        const { status, dePagination, transactions } = platform.dePaginate(response);
        expect(status).toStrictEqual("finished");
        expect(transactions!.length).toStrictEqual(0);
      });

      test("should not transform any transaction", async () => {
        const { activities, missing, toStore } = await platform.transform([]);
        expect(activities?.length).toStrictEqual(0);
        expect(missing?.length).toStrictEqual(0);
        expect(toStore).toBeUndefined();
      });

      test("should filter and return no activities", async () => {
        const { activities, latestIndex } = platform.filterNew([], lastTxn);
        expect(activities!.length).toStrictEqual(0);
        expect(latestIndex).toStrictEqual(-1);
      });
    })

    describe("when one security has been bought", () => {

      test("should finish depagination with one transaction", () => {
        const txns = [txnGen.buy("AMC MF 001", "Jun 28, 2022", 105.49, 20.30)];
        const response = kh.getResponse(txns);

        const { status, dePagination, transactions } = platform.dePaginate(response);
        expect(status).toStrictEqual("finished");
        expect(transactions!.length).toStrictEqual(1);
      });
  
      test("should transform one transaction", async () => {
        const transactions = [txnGen.buy("AMC MF 001", "Jun 28, 2022", 105.49, 20.30)];
        const { activities, missing, toStore } = await platform.transform(transactions);
        expect(activities!.length).toStrictEqual(1);
        expect(missing?.length).toStrictEqual(0);
        expect(toStore).toBeUndefined();
      });
  
      test("should filter and return one activities", () => {
        const inputActivities = [activityGen.buy("AMC MF 001", "Jun 28, 2022", 105.49, 20.30, accountId)];
        const { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);
        expect(activities!.length).toStrictEqual(1);
        expect(latestIndex).toStrictEqual(0);
      });
    })

    describe("when many securities have been bought", () => {

      const txns = [
        txnGen.sell("AMC MF 001", "Jul 05, 2022", 143.64, 20.30),
        txnGen.buy("AMC MF 002", "Jun 28, 2022", 68.10, 100),
        txnGen.buy("AMC MF 001", "Jun 28, 2022", 105.49, 20.30)
      ]

      test("should finish depagination with all transactions", () => {
        const response = kh.getResponse(txns);

        const { status, dePagination, transactions } = platform.dePaginate(response);
        expect(status).toStrictEqual("finished");
        expect(transactions?.length).toStrictEqual(3);
      });
  
      test("should transform all transactions", async () => {
        const { activities, missing, toStore } = await platform.transform(txns);

        expect(activities!.length).toStrictEqual(3);
        expect(missing?.length).toStrictEqual(0);
        expect(toStore).toBeUndefined();
      });
  
      test("should filter and return all activities", () => {
        const inputActivities = [
          activityGen.sell("AMC MF 001", "Jul 05, 2022", 143.64, 20.30, accountId),
          activityGen.buy("AMC MF 002", "Jun 28, 2022", 68.10, 100, accountId),
          activityGen.buy("AMC MF 001", "Jun 28, 2022", 105.49, 20.30, accountId)
        ]
        const { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);

        expect(activities?.length).toStrictEqual(3);
        expect(latestIndex).toStrictEqual(0);
      });
    })
  })

  describe("when last txn exists, filter", () => {
    const inputActivities = [
      activityGen.buy("AMC001", "Sep 10, 2022", 124.25, 25.73, accountId),
      activityGen.buy("AMC003", "Sep 10, 2022", 58.17, 91.82, accountId),
      activityGen.sell("AMC002", "Sep 02, 2022", 104.62, 50, accountId),
      activityGen.buy("AMC001", "Aug 25, 2022", 120.73, 46.69, accountId),
      activityGen.buy("AMC003", "Aug 13, 2022", 52.27, 63.75, accountId),
      activityGen.sell("AMC001", "Jul 05, 2022", 143.64, 20.30, accountId),
      activityGen.buy("AMC002", "Jun 28, 2022", 68.10, 100, accountId),
      activityGen.buy("AMC001", "Jun 28, 2022", 105.49, 20.30, accountId)
    ];

    test("should return all new activities", () => {
      var lastTxn = activityGen.buy("AMC001", "Jun 28, 2022", 105.49, 20.30, accountId);
      var { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);
      expect(activities!.length).toStrictEqual(7);
      expect(latestIndex).toStrictEqual(0);

      var lastTxn = activityGen.sell("AMC001", "Jul 05, 2022", 143.64, 20.30, accountId);
      var { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);
      expect(activities!.length).toStrictEqual(5);
      expect(latestIndex).toStrictEqual(0);
    });

    test("should return no new activities", () => {
      const lastTxn = activityGen.buy("AMC001", "Sep 10, 2022", 124.25, 25.73, accountId);
      const { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);

      expect(activities!.length).toStrictEqual(0);
      expect(latestIndex).toStrictEqual(-1);
    });

    test("should return new activities with latest index when they are from same date", () => {
      const lastTxn = activityGen.sell("AMC002", "Sep 02, 2022", 104.62, 50, accountId);
      const { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);

      expect(activities!.length).toStrictEqual(2);
      expect(latestIndex).toStrictEqual(0);
    });
  })
})
