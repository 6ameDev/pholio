import Jsun from "../utils/jsun";
import toPromise from "./promise";

export default class Transaction {

  static genKey(platformName: string) {
    return `${platformName.toLowerCase()}-last-txn`;
  }

  static get(key: string) {
    console.debug(`Received request to retrieve txn for ${key}`)
    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        const txnStr = result[key];
        const txn = txnStr ? Jsun.parseWithDates(txnStr) : null;
        resolve(txn);
      });
    });

    return promise;
  }

  static async set(txn: any, key: string) {
    console.debug(`Received request to store txn for ${key}`)
    const txnStr = JSON.stringify(txn);

    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.set({ [key]: txnStr }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        resolve(txnStr);
      });
    });

    return promise;
  }

  static reset(key: string) {
    console.debug(`Received request to reset txn for ${key}.`);
    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.remove([key], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        resolve();
      });
    });

    return promise;
  }
}
