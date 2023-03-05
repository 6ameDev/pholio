import toPromise from "./promise";

const KEY = `pholio-settings`;

export default class Settings {
  static get() {
    console.debug(`Received request to retrieve settings`);
    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.get([KEY], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        const settingsStr = result[KEY];
        const settings = settingsStr ? JSON.parse(settingsStr) : undefined;
        resolve(settings);
      });
    });

    return promise;
  }

  static async set(settings: any) {
    console.debug(`Received request to store settings.`);
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

  static clear() {
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
}
