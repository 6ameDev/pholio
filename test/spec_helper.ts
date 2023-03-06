export class SpecHelper {
  static baseMocks() {
    global.UIkit = {
      notification: () => {},
    };
  }
}

export namespace SpecHelper {
  export class Vested {
    static TXNS = [
      {"type":"ORDER","description":"Airbnb MARKET Buy Cancelled","amount":null,"commission":0,"symbol":"ABNB","orderSide":"BUY","quantity":"12.80000000","date":"Jul 10, 2022"},
      {"type":"SPUR","description":"Coinbase Global Inc  MARKET Buy","amount":"1248.10","commission":0,"symbol":"COIN","quantity":"26.70000000","fillPrice":"46.75000000","sign":"-","date":"Jun 30, 2022"},
      {"type":"SPUR","description":"Microsoft Corporation MARKET Buy","amount":"754.96","commission":0,"symbol":"MSFT","quantity":"2.90000000","fillPrice":"260.33000000","sign":"-","date":"Jun 29, 2022"},
      {"type":"SPUR","description":"Alphabet Inc. - Class C Shares MARKET Buy","amount":"752.44","commission":0,"symbol":"GOOG","quantity":"0.33500000","fillPrice":"2246.09000000","sign":"-","date":"Jun 29, 2022"},
      {"type":"SPUR","description":"INVESCO NASDAQ 100 ETF MARKET Buy","amount":"1244.32","commission":0,"symbol":"QQQM","quantity":"10.60000000","fillPrice":"117.39000000","sign":"-","date":"Jun 28, 2022"},
      {"type":"SPUR","description":"Alibaba Group MARKET Buy","amount":"1243.79","commission":0,"symbol":"BABA","quantity":"10.60000000","fillPrice":"117.34000000","sign":"-","date":"Jun 28, 2022"},
      {"type":"SPUR","description":"Meta Platforms Inc MARKET Buy","amount":"2458.78","commission":0,"symbol":"META","quantity":"15.00000000","fillPrice":"163.92000000","sign":"-","date":"Jun 28, 2022"},
      {"type":"SPUR","description":"Amazon.com Inc. MARKET Buy","amount":"2494.55","commission":0,"symbol":"AMZN","quantity":"23.00000000","fillPrice":"108.46000000","sign":"-","date":"Jun 28, 2022"}
    ];

    static getResponse(txns: Array<any>): string {
      const RESPONSE_PRE_TXNS = '<script id="__NEXT_DATA__" type="application/json">{"props":{"initialReduxState":{"transactionHistory":{"userTransHistory":'
      const RESPONSE_POST_TXNS = '}}}}</script>'
      return RESPONSE_PRE_TXNS.concat(JSON.stringify(txns), RESPONSE_POST_TXNS);
    }
  }
}