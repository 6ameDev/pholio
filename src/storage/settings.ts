import Platforms from "../platforms";
import toPromise from "./promise";

const KEY = `pholio-settings`;

export default class Settings {
  private _ghostfolioHost: string;
  private _accounts: Array<{ name: string; id: string }>;

  constructor(
    ghostfolioHost: string,
    accounts: Array<{ name: string; id: string }>
  ) {
    this._ghostfolioHost = ghostfolioHost;
    this._accounts = accounts;
  }

  public get ghostfolioHost() {
    return this._ghostfolioHost;
  }

  public get accounts() {
    return this._accounts;
  }

  accountByPlatform(platformName: string): { name: string; id: string } {
    return this._accounts.reduce((result, account) => {
      if (account.name === platformName) {
        result = account;
      }
      return result;
    });
  }

  stringify(): string {
    const replacer = ['ghostfolioHost', 'accounts', 'name', 'id'];
    return JSON.stringify(this, replacer, ' ');
  }

  static parse(text: string): Settings {
    return JSON.parse(text, (key, value) => {
      if (key === "") return new Settings(value.ghostfolioHost, value.accounts);
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

  static async set(settings: Settings) {
    console.debug(`Received request to store settings.`);
    const settingsStr = settings.stringify();

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
    const platforms = Platforms.all();
    const accounts = platforms.map((platform) => {
      return { name: platform.name(), id: "" };
    });
    return new Settings("", accounts);
  }
}
