import Gf from "../src/models/ghostfolio";
import { GhostfolioType as GfType } from "../src/models/enums/ghostfolio-type.enum";
import { GhostfolioDataSource as GfDataSource } from "../src/models/enums/ghostfolio-datasource.enum";

export default class KuveraHelper {

  static getResponse(txns: any): string {
    const transactions = Array.isArray(txns) ? txns : [txns];
    return JSON.stringify(transactions);
  }

  static GfActivityGenerator = {
    buy: (symbol: string, date: string, unitPrice: number, quantity: number, accountId: string) => {
      const type = GfType.BUY;
      const source = GfDataSource.YAHOO;
      return Gf.createActivity(symbol, type, 0, "INR", quantity, unitPrice, source, new Date(date), "BUY", accountId);
    },

    sell: (symbol: string, date: string, fillPrice: number, quantity: number, accountId: string) => {
      const type = GfType.SELL;
      const source = GfDataSource.YAHOO;
      return Gf.createActivity(symbol, type, 0, "INR", quantity, fillPrice, source, new Date(date), "SELL", accountId);
    },
  }

  static TxnGenerator = {
    buy: (schemeName: string, date: string, nav: number, units: number) => {
      const amount = nav * units;
      return {
        "trans_type": "buy",
        "nav": nav,
        "units": units,
        "order_date": date,
        "amount": (amount + Math.random()),
        "allotted_amount": amount,
        "scheme_name": schemeName,
      }
    },

    sell: (schemeName: string, date: string, nav: number, units: number) => {
      const amount = nav * units;
      return {
        "trans_type": "sell",
        "nav": nav,
        "units": units,
        "order_date": date,
        "amount": amount,
        "allotted_amount": amount,
        "scheme_name": schemeName,
      }
    },
  }
}