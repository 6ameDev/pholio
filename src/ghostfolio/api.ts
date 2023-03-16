import axios, { AxiosInstance } from "axios";
import Settings from "../models/settings";

let self: Api;

export default class Api {
  private static instance: Api;

  private http: AxiosInstance;

  private constructor(accessToken: string, baseURL: string, timeout?: number) {
    self = this;
    this.http = axios.create({
      baseURL: baseURL,
      timeout: timeout || 1000,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    this.interceptResponses();
  }

  static async getInstance(): Promise<Api> {
    if (!Api.instance) {
      const {ghostfolio: { host, accessToken="" }} = await Settings.get();
      Api.instance = new Api(accessToken, host);
    }
    return Api.instance;
  }

  ping() {
    this.http
      .get('/api/v1/access')
      .then(() => console.debug(`Pong`))
      .catch((error) => console.error(`Ping failed.`, error));
  }

  private interceptResponses() {
    console.debug("Registering interceptor for responses.");
    this.http.interceptors.response.use(
      (response) => response,
      this.handleUnauthorizedResponse
    );
  }

  private async handleUnauthorizedResponse(error) {
    const { config, response: { status } } = error;
    const originalRequest = config;

    if (status === 401 && !originalRequest._isRetry) {
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

    return this.http.get(`/api/v1/auth/anonymous/${securityToken}`)
      .then((response) => {
        const {status, data: { authToken }} = response;
        if (authToken) {
          settings.setAccessToken(authToken).save();
          return authToken;
        } else {
          console.error(`Failed to refresh auth token. Status Code: ${status}. Response: `, response);
        }
      })
      .catch(error => console.error(`Failed to refresh access token.`, error));
  }
}
