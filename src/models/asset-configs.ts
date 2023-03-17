import Storage from "./storage";
import { isEqual, differenceWith } from "lodash";
import { AssetConfig } from "./interfaces/asset-config.interface";

const STORAGE_KEY = `key-asset-configs`;

export default class AssetConfigs {
  private _configs: AssetConfig[];

  constructor(configs: AssetConfig[]) {
    this._configs = configs || [];
  }

  public get configs() {
    return this._configs;
  }

  addAssets(assets: AssetConfig[]): AssetConfigs {
    const newAssets = differenceWith(assets, this._configs, isEqual);
    this._configs.push(...newAssets);
    return this;
  }

  symbolByName(assetName: string): string {
    return this.find("name", assetName).symbol;
  }

  nameBySymbol(symbol: string): string {
    return this.find("symbol", symbol).name;
  }

  async save() {
    console.debug(`Received request to store Asset Configs.`);
    return Storage.set<AssetConfigs>(STORAGE_KEY, this, AssetConfigs.stringify);
  }

  static fetch(): Promise<AssetConfigs> {
    console.debug(`Received request to retrieve Asset Configs.`);
    const fallback = new AssetConfigs([]);
    return Storage.get<AssetConfigs>(STORAGE_KEY, AssetConfigs.parse, fallback);
  }

  static reset() {
    console.debug(`Received request to reset configs.`);
    return Storage.reset(STORAGE_KEY);
  }

  private find(by: string, value: string): AssetConfig {
    const result = Array.from(this._configs).reduce((result, config) => {
      if (config[by] === value) {
        result = config;
      }
      return result;
    }, {name: '', symbol: ''});
    return result;
  }

  private static stringify(configs: AssetConfigs): string {
    const replacer = ['configs', 'name', 'symbol'];
    return JSON.stringify(configs, replacer, ' ');
  }

  private static parse(text): AssetConfigs {
    return JSON.parse(text, (key, value) => {
      if (key === "configs") return value.map(item => item as AssetConfig);
      if (key === "") return new AssetConfigs(value.configs);
      return value;
    });
  }
}
