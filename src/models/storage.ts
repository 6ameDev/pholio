import toPromise from "../promise";

type parserType = (input: any) => any;
type stringifierType<T> = (input: T) => string;

export default class Storage {
  static get<T>(key: string, parseFn: parserType): Promise<T> {
    const promise = toPromise<T>((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        const items = Object.keys(result).map((key) => {
          const valueStr = result[key];
          return parseFn(valueStr);
        });
        resolve(items);
      })
    })

    return promise;
  }

  static set<T>(key: string, item: T, stringifyFn: stringifierType<T>) {
    const valueStr = stringifyFn(item);
    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.set({ [key]: valueStr }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        resolve(valueStr);
      });
    })

    return promise;
  }

  static reset(key: string) {
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