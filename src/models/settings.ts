import Platforms from "../platforms";
import toPromise from "../promise";

const KEY = `pholio-settings`;

export default class Settings {
  private _ghostfolio: { host: string, securityToken: string, accessToken?: string };
  private _accounts: Array<{ name: string; id: string }>;

  constructor(
    ghostfolio: { host: string, securityToken: string },
    accounts: Array<{ name: string; id: string }>
  ) {
    this._ghostfolio = ghostfolio;
    this._accounts = accounts;
  }

  public get ghostfolio() {
    return this._ghostfolio;
  }

  public get accounts() {
    return this._accounts;
  }

  setAccessToken(accessToken: string) {
    this._ghostfolio.accessToken = accessToken;
    return this;
  }

  accountByPlatform(platformName: string): { name: string; id: string } {
    return this._accounts.reduce((result, account) => {
      if (account.name === platformName) {
        result = account;
      }
      return result;
    }, { name: platformName, id: '' });
  }

  stringify(): string {
    const replacer = ['ghostfolio', 'host', 'securityToken', 'accessToken', 'accounts', 'name', 'id'];
    return JSON.stringify(this, replacer, ' ');
  }

  static parse(text: string): Settings {
    return JSON.parse(text, (key, value) => {
      if (key === "") return new Settings(value.ghostfolio, value.accounts);
      return value;
    });
  }

  static get(): Promise<Settings> {
    console.debug(`Received request to retrieve settings`);
    const promise = toPromise<Settings>((resolve, reject) => {
      chrome.storage.local.get([KEY], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        const settingsStr = result[KEY];
        const settings = settingsStr ? Settings.parse(settingsStr) : this.getEmpty();
        resolve(settings);
      });
    });

    return promise;
  }

  async save() {
    console.debug(`Received request to store settings.`);
    const settingsStr = this.stringify();

    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.set({ [KEY]: settingsStr }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        resolve(settingsStr);
      });
    });

    return promise;
  }

  static reset() {
    console.debug(`Received request to reset settings.`);
    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.remove([KEY], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        resolve();
      });
    });

    return promise;
  }

  private static getEmpty() {
    const emptyGhostfolio = { host: "", securityToken: "" };
    const accounts = Platforms.allNames().map((name) => {
      return { name: name, id: "" };
    });
    return new Settings(emptyGhostfolio, accounts);
  }
}
