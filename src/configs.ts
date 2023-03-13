import AssetConfig from "./asset_config";
import toPromise from "./storage/promise";
import { isEqual, differenceWith } from "lodash";

const KEY = `pholio-configs`;

export default class Configs {
  private _assets: AssetConfig[];

  constructor(assets: AssetConfig[]) {
    this._assets = assets || [];
  }

  public get assets() {
    return this._assets;
  }

  addAssets(assets: AssetConfig[]): Configs {
    const newAssets = differenceWith(assets, this._assets, isEqual);
    this._assets.push(...newAssets);
    return this;
  }

  symbolByName(assetName: string): string {
    const asset = Array.from(this._assets).reduce((result, asset) => {
      if(asset.name === assetName) {
        result = asset;
      }
      return result;
    }, new AssetConfig('', ''));
    return asset.symbol;
  }

  nameBySymbol(symbol: string): string {
    const asset = Array.from(this._assets).reduce((result, asset) => {
      if(asset.symbol === symbol) {
        result = asset;
      }
      return result;
    }, new AssetConfig('', ''));
    return asset.name;
  }

  stringify(): string {
    const replacer = ['assets', 'name', 'symbol'];
    return JSON.stringify(this, replacer, ' ');
  }

  static parse(text: string): Configs {
    return JSON.parse(text, (key, value) => {
      if (key === "assets") return value.map(item => new AssetConfig(item.name, item.symbol));
      if (key === "") return new Configs(value.assets);
      return value;
    });
  }

  static get(): Promise<Configs> {
    console.debug(`Received request to retrieve configs`);
    const promise = toPromise<Configs>((resolve, reject) => {
      chrome.storage.local.get([KEY], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        const configsStr = result[KEY];
        const configs = configsStr ? Configs.parse(configsStr) : new Configs([]);
        resolve(configs);
      });
    });

    return promise;
  }

  async save() {
    console.debug(`Received request to store configs.`);
    const configsStr = this.stringify();

    const promise = toPromise((resolve, reject) => {
      chrome.storage.local.set({ [KEY]: configsStr }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        resolve(configsStr);
      });
    });

    return promise;
  }

  static reset() {
    console.debug(`Received request to reset configs.`);
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
