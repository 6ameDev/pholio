import vh from "./vested_helper";
import PlatformConfigs from "../src/models/platform-configs";
import Vested from "../src/models/platforms/vested";

const txnGen = vh.TxnGenerator;
const activityGen = vh.GfActivityGenerator;

let fetchSpy;
let configByPlatformSpy;

const platform = new Vested();
const accountId = 'random-account-id';

beforeAll(() => {
  const platformConfigs = new PlatformConfigs([]);
  fetchSpy = jest.spyOn(PlatformConfigs, "fetch").mockResolvedValue(platformConfigs);

  configByPlatformSpy = jest.spyOn(PlatformConfigs.prototype, "configByPlatform").mockImplementation((name: string) => {
    return { name, id: accountId };
  });
});

afterAll(() => {
  fetchSpy.mockRestore();
  configByPlatformSpy.mockRestore();
});

describe("when platform is vested", () => {
  it("should return correct name", () => {
    expect(platform.name()).toBe("Vested");
  });
})

describe("when platform transactions are ordered new to old", () => {

  describe("when last txn does not exist", () => {
    const lastTxn = undefined;

    describe("when no activity has been done", () => {

      test("should finish depagination with no transactions", () => {
        const response = vh.getResponse([]);
  
        const { status, dePagination, transactions } = platform.dePaginate(response);
        expect(status).toStrictEqual("finished");
        expect(transactions!.length).toStrictEqual(0);
      });

      test("should not transform any transaction", async () => {
        const { activities, missing, toStore } = await platform.transform([]);
        expect(activities!.length).toStrictEqual(0);
        expect(missing).toBeUndefined();
        expect(toStore).toBeUndefined();
      });

      test("should filter and return no activities", async () => {
        const { activities, latestIndex } = platform.filterNew([], lastTxn);
        expect(activities!.length).toStrictEqual(0);
        expect(latestIndex).toStrictEqual(-1);
      });
    })

    describe("when only deposit has been made", () => {

      test("should finish depagination with no transactions", () => {
        const response = vh.getResponse(txnGen.deposit("Jun 28, 2022"));
  
        const { status, dePagination, transactions } = platform.dePaginate(response);
        expect(status).toStrictEqual("finished");
        expect(transactions!.length).toStrictEqual(0);
      });
    })

    describe("when no securities have been bought or sold", () => {

      test("should finish depagination with no transactions", () => {
        const txns = [
          txnGen.cancelled("ABNB", "Jul 10, 2022", 12),
          txnGen.instantFunding("Jul 05, 2022"),
          txnGen.rejected("ABNB", "Jun 28, 2022", 43),
          txnGen.deposit("Jun 28, 2022")
        ];
        const response = vh.getResponse(txns);
  
        const { status, dePagination, transactions } = platform.dePaginate(response);
        expect(status).toStrictEqual("finished");
        expect(transactions!.length).toStrictEqual(0);
      });
    })

    describe("when one security has been bought", () => {

      test("should finish depagination with one transaction", () => {
        const txns = [
          txnGen.buy("AMZN", "Jun 28, 2022", 108, 23),
          txnGen.deposit("Jun 28, 2022"),
        ];
        const response = vh.getResponse(txns);

        const { status, dePagination, transactions } = platform.dePaginate(response);
        expect(status).toStrictEqual("finished");
        expect(transactions!.length).toStrictEqual(1);
      });
  
      test("should transform one transaction", async () => {
        const transactions = [txnGen.buy("AMZN", "Jun 28, 2022", 108, 23)];
        const { activities, missing, toStore } = await platform.transform(transactions);
        expect(activities!.length).toStrictEqual(1);
        expect(missing).toBeUndefined();
        expect(toStore).toBeUndefined();
      });
  
      test("should filter and return one activities", () => {
        const inputActivities = [activityGen.buy("AMZN", "Jun 28, 2022", 108, 23, accountId)];
        const { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);
        expect(activities!.length).toStrictEqual(1);
        expect(latestIndex).toStrictEqual(0);
      });
    })

    describe("when many securities have been bought", () => {

      const txns = [
        txnGen.dividend("GOOG", "Aug 15, 2022", 20),
        txnGen.dividendTax("GOOG", "Aug 15, 2022", 2),
        txnGen.sell("AMZN", "Jul 10, 2022", 150, 15),
        txnGen.buy("GOOG", "Jul 05, 2022", 2246, 1),
        txnGen.buy("AMZN", "Jun 28, 2022", 108, 23),
      ]

      test("should finish depagination with all transactions", () => {
        const response = vh.getResponse(txns);

        const { status, dePagination, transactions } = platform.dePaginate(response);
        expect(status).toStrictEqual("finished");
        expect(transactions!.length).toStrictEqual(5);
      });
  
      test("should transform all transactions", async () => {
        const { activities, missing, toStore } = await platform.transform(txns);

        expect(activities!.length).toStrictEqual(5);
        expect(missing).toBeUndefined();
        expect(toStore).toBeUndefined();
      });
  
      test("should filter and return all activities", () => {
        const inputActivities = [
          activityGen.dividend("GOOG", "Aug 15, 2022", 20, accountId),
          activityGen.item("GOOG", "Aug 15, 2022", 2, accountId),
          activityGen.sell("AMZN", "Jul 10, 2022", 150, 15, accountId),
          activityGen.buy("GOOG", "Jul 05, 2022", 2246, 1, accountId),
          activityGen.buy("AMZN", "Jun 28, 2022", 108, 23, accountId),
        ]
        const { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);

        expect(activities!.length).toStrictEqual(5);
        expect(latestIndex).toStrictEqual(0);
      });
    })
  });

  describe("when last txn exists, filter", () => {

    const inputActivities = [
      activityGen.dividend("GOOG", "Aug 15, 2022", 20, accountId),
      activityGen.item("GOOG", "Aug 15, 2022", 2, accountId),
      activityGen.sell("AMZN", "Jul 10, 2022", 150, 15, accountId),
      activityGen.buy("GOOG", "Jul 05, 2022", 2246, 1, accountId),
      activityGen.buy("AMZN", "Jun 28, 2022", 108, 23, accountId),
    ]

    test("should return all new activities", () => {
      var lastTxn = activityGen.buy("AMZN", "Jun 28, 2022", 108, 23, accountId);
      var { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);
      expect(activities!.length).toStrictEqual(4);
      expect(latestIndex).toStrictEqual(0);

      var lastTxn = activityGen.buy("GOOG", "Jul 05, 2022", 2246, 1, accountId);
      var { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);
      expect(activities!.length).toStrictEqual(3);
      expect(latestIndex).toStrictEqual(0);
    });

    test("should return no new activities", () => {
      const lastTxn = activityGen.dividend("GOOG", "Aug 15, 2022", 20, accountId);
      const { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);

      expect(activities!.length).toStrictEqual(0);
      expect(latestIndex).toStrictEqual(-1);
    });

    test("should return new activities with latest index when they are from same date", () => {
      const lastTxn = activityGen.sell("AMZN", "Jul 10, 2022", 150, 15, accountId);
      const { activities, latestIndex } = platform.filterNew(inputActivities, lastTxn);

      expect(activities!.length).toStrictEqual(2);
      expect(latestIndex).toStrictEqual(0);
    });
  });
});
