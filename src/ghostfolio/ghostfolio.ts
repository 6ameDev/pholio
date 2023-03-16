export class Ghostfolio {

  static toTransaction(symbol: string, type: Ghostfolio.Type, fee: number, currency: string,
    quantity: number, unitPrice: number, dataSource: Ghostfolio.DataSource, date: Date,
    comment?: string, accountId?: string):
      { symbol: string, type: Ghostfolio.Type, fee: number, currency: string, quantity: number,
        unitPrice: number, dataSource: Ghostfolio.DataSource, date: Date, comment?: string, accountId?: string } {
    return {
      symbol,
      type,
      fee,
      currency,
      quantity,
      unitPrice,
      dataSource: resolveDataSource(type, dataSource),
      date,
      comment,
      accountId,
    };
  }

  static createJsonImport(txns: Array<object>): object {
    return {
      meta: {
        date: new Date(),
        version: "production",
      },
      activities: txns,
    };
  }
}

function resolveDataSource(type: Ghostfolio.Type, dataSource: Ghostfolio.DataSource) {
  if (type === Ghostfolio.Type.ITEM) {
    return Ghostfolio.DataSource.MANUAL;
  } else {
    return dataSource;
  }
}

export namespace Ghostfolio {
  export enum Type {
    BUY = "BUY",
    SELL = "SELL",
    DIVIDEND = "DIVIDEND",
    ITEM = "ITEM",
  }

  export enum DataSource {
    YAHOO = "YAHOO",
    MANUAL = "MANUAL",
    COINGECKO = "COINGECKO",
  }
}
