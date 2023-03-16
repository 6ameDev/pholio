import { Ghostfolio } from "../src/ghostfolio/ghostfolio";
import Meth from "../src/utils/meth";

export default class VestedHelper {

  static getResponse(txn: any): string;
  static getResponse(txns: any[]): string;
 
  static getResponse(txns: any): string {
    const transactions = Array.isArray(txns) ? txns : [txns];
    const txnsStr = JSON.stringify(transactions);

    const RESPONSE_PRE_TXNS = '<script id="__NEXT_DATA__" type="application/json">{"props":{"initialReduxState":{"transactionHistory":{"userTransHistory":'
    const RESPONSE_POST_TXNS = '}}}}</script>'
    return RESPONSE_PRE_TXNS.concat(txnsStr, RESPONSE_POST_TXNS);
  }

  static GfActivityGenerator = {
    buy: (symbol: string, date: string, fillPrice: number, quantity: number, accountId: string) => {
      const type = Ghostfolio.Type.BUY;
      const source = Ghostfolio.DataSource.YAHOO;
      return Ghostfolio.toTransaction(symbol, type, 0, "USD", quantity, fillPrice, source, new Date(date), "BUY", accountId);
    },

    sell: (symbol: string, date: string, fillPrice: number, quantity: number, accountId: string) => {
      const type = Ghostfolio.Type.SELL;
      const source = Ghostfolio.DataSource.YAHOO;
      return Ghostfolio.toTransaction(symbol, type, 0, "USD", quantity, fillPrice, source, new Date(date), "SELL", accountId);
    },

    dividend: (symbol: string, date: string, amount: number, accountId: string) => {
      const type = Ghostfolio.Type.DIVIDEND;
      const source = Ghostfolio.DataSource.YAHOO;
      return Ghostfolio.toTransaction(symbol, type, 0, "USD", 1, amount, source, new Date(date), "DIVIDEND", accountId);
    },

    item: (symbol: string, date: string, amount: number, accountId: string) => {
      const type = Ghostfolio.Type.ITEM;
      const source = Ghostfolio.DataSource.MANUAL;
      return Ghostfolio.toTransaction(symbol, type, 0, "USD", 1, (-1 * amount), source, new Date(date), "DIVIDEND TAX", accountId);
    },
  }

  static TxnGenerator = {
    buy: (symbol: string, date: string, fillPrice: number, quantity: number) => {
      const amount = fillPrice * quantity;
      return {
        "type": "SPUR",
        "commission": 0,
        "date": date,
        "symbol": symbol,
        "amount": amount.toString(),
        "quantity": quantity.toString(),
        "fillPrice": fillPrice.toString(),
      }
    },

    sell: (symbol: string, date: string, fillPrice: number, quantity: number) => {
      const amount = fillPrice * quantity;
      return {
        "type": "SSAL",
        "commission": 0,
        "date": date,
        "symbol": symbol,
        "amount": amount.toString(),
        "quantity": quantity.toString(),
        "fillPrice": fillPrice.toString(),
      }
    },

    dividend: (symbol: string, date: string, amount: number) => {
      return {
        "type": "DIV",
        "commission": 0,
        "symbol": symbol,
        "date": date,
        "amount": amount.toString(),
      }
    },

    dividendTax: (symbol: string, date: string, amount: number) => {
      return {
        "type": "DIVTAX",
        "commission": 0,
        "symbol": symbol,
        "date": date,
        "amount": (-1 * amount),
      }
    },

    cancelled: (symbol: string, date: string, quantity: number) => {
      return {
        "type": "ORDER",
        "orderSide": "BUY",
        "commission": 0,
        "amount": null,
        "symbol": symbol,
        "date": date,
        "quantity": quantity,
      }
    },

    rejected: (symbol: string, date: string, quantity: number) => {
      return {
        "type": "ORDER",
        "amount": null,
        "commission": 0,
        "orderSide": "BUY",
        "symbol": symbol,
        "date": date,
        "quantity": quantity,
      }
    },

    instantFunding: (date) => {
      return {
        "type": "JNLC",
        "commission": 0,
        "amount": Meth.random(1000, 10000),
        "date": date
      }
    },

    deposit: (date) => {
      return {
        "type": "CSR",
        "commission": 0,
        "amount": Meth.random(1000, 10000),
        "date": date
      }
    }
  }
}
