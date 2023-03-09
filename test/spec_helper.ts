import { Ghostfolio } from "../src/ghostfolio";
import Meth from "../src/utils/meth";

export class SpecHelper {
  static baseMocks() {
    global.UIkit = {
      notification: () => {},
    };
  }
}

export namespace SpecHelper {
  export class Vested {

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
          "amount": -1 * amount,
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

    // This convertor breaks when DIV or DIVTAX is introduced.
    static responseToTxn(txn: any, accountId, type, comment) {
      return Ghostfolio.toTransaction(txn.symbol, type, txn.commission, "USD", parseFloat(txn.quantity), parseFloat(txn.fillPrice), Ghostfolio.DataSource.YAHOO, new Date(txn.date), comment, accountId);
    }

    static getResponse(txns: Array<any>): string {
      const RESPONSE_PRE_TXNS = '<script id="__NEXT_DATA__" type="application/json">{"props":{"initialReduxState":{"transactionHistory":{"userTransHistory":'
      const RESPONSE_POST_TXNS = '}}}}</script>'
      return RESPONSE_PRE_TXNS.concat(JSON.stringify(txns), RESPONSE_POST_TXNS);
    }
  }
}