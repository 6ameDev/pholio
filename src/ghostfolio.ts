import axios, { AxiosInstance } from 'axios';

export class Ghostfolio {

  static http: AxiosInstance;

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

  static getHttp() {
    if (this.http) return this.http;
    this.http = axios.create({
      baseURL: 'http://your-ghostfolio-host/api/v1/',
      timeout: 1000,
      headers: {'Authorization': 'Bearer insert-access-token'}
    });
    return this.http;
  }

  static intercept() {
    this.getHttp().interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response: { status } } = error;
        const originalRequest = config;
        if (status === 401 && !originalRequest._isRetry) {
          console.debug(`Intercepted 401 status code, retrying with new access token.`);

          originalRequest._isRetry = true;
          const accessToken = await this.refreshAccessToken();
          originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
          return this.getHttp()(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  static async refreshAccessToken() {
    const dummySecret = 'foo';
    return this.getHttp().get(`auth/anonymous/${dummySecret}`)
      .then((response) => {
        const {status, data: { authToken }} = response;
        if (status === 200) return authToken;
        console.warn(`Received ${status} status code while refreshing access token.`, response);
      })
      .catch(error => console.error(`Failed to refresh access token.`, error));
  }

  static ping() {
    this.getHttp().get('access')
      .then(() => console.debug(`Pong`))
      .catch((error) => {
        console.error(`Ping failed.`, error)
      });
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
