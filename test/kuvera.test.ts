import Configs from "../src/models/configs";
import Kuvera from "../src/platforms/kuvera";
import Settings from "../src/models/settings";
import kh from "./kuvera_helper";

const txnGen = kh.TxnGenerator;

const configs = new Configs([]);
const settings = new Settings("", []);
const platform = new Kuvera(configs, settings);

jest.spyOn(Configs.prototype, "symbolByName").mockImplementation(() => {
  return "test-symbol";
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
})
