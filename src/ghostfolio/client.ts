import axios, { AxiosInstance } from "axios";
import Settings from "../models/settings";
import { Api } from "./apis";

let self: Client;

export default class Client {
  private static instance: Client;

  private http: AxiosInstance;

  private constructor(accessToken: string, baseURL: string, timeout?: number) {
    self = this;
    this.http = axios.create({
      baseURL: baseURL,
      timeout: timeout || 3000,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    this.interceptResponses();
  }

  static async getInstance(): Promise<Client> {
    if (!Client.instance) {
      const {ghostfolio: { host, accessToken="" }} = await Settings.get();
      Client.instance = new Client(accessToken, host);
    }
    return Client.instance;
  }

  static async testConnection(host: string, securityToken: string) {
    const axiosInstance = axios.create({ baseURL: host });
    const accessToken = await Api.auth(axiosInstance, securityToken);

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return Api.access(axiosInstance);
  }

  async getAssetSymbols(query: string): Promise<any[]> {
    return Api.symbolsLookup(this.http, query);
  }

  private interceptResponses() {
    console.debug("Registering interceptor for responses.");
    this.http.interceptors.response.use(
      (response) => response,
      this.handleUnauthorizedResponse
    );
  }

  private async handleUnauthorizedResponse(error) {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401 && !originalRequest._isRetry) {
      console.debug(`Intercepted 401 status code, retrying with new access token.`);

      originalRequest._isRetry = true;
      const accessToken = await self.refreshToken();
      self.http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      return self.http(originalRequest);
    }

    return Promise.reject(error);
  }

  private async refreshToken() {
    let settings = await Settings.get();
    const { ghostfolio: { securityToken }} = settings;

    const authToken = await Api.auth(this.http, securityToken);
    settings.setAccessToken(authToken).save();
    return authToken;
  }
}
