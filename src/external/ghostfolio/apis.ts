import { AxiosInstance } from "axios";

export namespace Api {
  export function access(http: AxiosInstance) {
    return http.get(`/api/v1/access`)
      .then(() => {
        return { host: { status: "SUCCESS" }, auth: { status: "SUCCESS" } };
      })
      .catch(({ response }) => {
        if (response && response.status === 401) {
          return { host: { status: "SUCCESS" }, auth: { status: "FAIL" } };
        }
        return { host: { status: "FAIL" }, auth: { status: "FAIL" } };
      });
  }

  export function symbolsLookup(http: AxiosInstance, query: string) {
    return http.get(`/api/v1/symbol/lookup?query="${query}"`)
      .then((response) => {
        console.debug(`Response for symbol lookup, query:${query}`, response);
        return response.data.items;
      })
      .catch((error) => console.error(`Failed to get asset symbols.`, error));
  }

  export function auth(http: AxiosInstance, securityToken: string) {
    return http.get(`/api/v1/auth/anonymous/${securityToken}`)
      .then((response) => {
        const {status, data: { authToken }} = response;

        if (authToken) return authToken;
        console.error(`Failed to refresh auth token. Status Code: ${status}. Response: `, response);
      })
      .catch(error => console.error(`Failed to refresh access token.`, error));
  }
}
