import toPromise from "./promise";

const KEY = `pholio-settings`;

export default class Settings {

  static get() {
    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.get([KEY], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        const settingsStr = result[KEY];
        const settings = settingsStr ? JSON.parse(settingsStr) : {};
        resolve(settings);
      });
    });

    return promise;
  }

  static async set(settings: any) {
    const settingsStr = JSON.stringify(settings);

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
}
