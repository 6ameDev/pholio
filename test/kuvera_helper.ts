import { Ghostfolio } from "../src/ghostfolio";

export default class KuveraHelper {

  static getResponse(txns: any): string {
    const transactions = Array.isArray(txns) ? txns : [txns];
    return JSON.stringify(transactions);
  }

  static GfActivityGenerator = {
    buy: (symbol: string, date: string, unitPrice: number, quantity: number, accountId: string) => {
      const type = Ghostfolio.Type.BUY;
      const source = Ghostfolio.DataSource.YAHOO;
      return Ghostfolio.toTransaction(symbol, type, 0, "INR", quantity, unitPrice, source, new Date(date), "BUY", accountId);
    },

    sell: (symbol: string, date: string, fillPrice: number, quantity: number, accountId: string) => {
      const type = Ghostfolio.Type.SELL;
      const source = Ghostfolio.DataSource.YAHOO;
      return Ghostfolio.toTransaction(symbol, type, 0, "INR", quantity, fillPrice, source, new Date(date), "SELL", accountId);
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