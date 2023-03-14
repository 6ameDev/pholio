export default class KuveraHelper {

  static getResponse(txns: any): string {
    const transactions = Array.isArray(txns) ? txns : [txns];
    return JSON.stringify(transactions);
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