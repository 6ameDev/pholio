import Storage from "./storage";
import { isEqual, differenceWith } from "lodash";
import { AssetConfig } from "./interfaces/asset-config.interface";

const STORAGE_KEY = `key-asset-configs`;

export default class AssetConfigs {
  private _assetConfigs: AssetConfig[];

  constructor(assetConfigs: AssetConfig[]) {
    this._assetConfigs = assetConfigs || [];
  }

  public get assetConfigs() {
    return this._assetConfigs;
  }

  addAssets(assets: AssetConfig[]): AssetConfigs {
    const newAssets = differenceWith(assets, this._assetConfigs, isEqual);
    this._assetConfigs.push(...newAssets);
    return this;
  }

  symbolByName(assetName: string): string {
    return this.find("name", assetName).name;
  }

  nameBySymbol(symbol: string): string {
    return this.find("symbol", symbol).symbol;
  }

  async save() {
    console.debug(`Received request to store Asset Configs.`);
    return Storage.set<AssetConfigs>(STORAGE_KEY, this, AssetConfigs.stringify);
  }

  static fetch(): Promise<AssetConfigs> {
    console.debug(`Received request to retrieve Asset Configs.`);
    return Storage.get<AssetConfigs>(STORAGE_KEY, AssetConfigs.parse);
  }

  static reset() {
    console.debug(`Received request to reset configs.`);
    return Storage.reset(STORAGE_KEY);
  }

  private find(by: string, value: string): AssetConfig {
    const result = Array.from(this._assetConfigs).reduce((result, assetConfig) => {
      if (assetConfig[by] === value) {
        result = assetConfig;
      }
      return result;
    }, {name: '', symbol: ''});
    return result;
  }

  private static stringify(assetConfigs: AssetConfigs): string {
    const replacer = ['assetConfigs', 'name', 'symbol'];
    return JSON.stringify(assetConfigs, replacer, ' ');
  }

  private static parse(text: string): AssetConfigs {
    return JSON.parse(text, (key, value) => {
      if (key === "assetConfigs") return value.map(item => item as AssetConfig);
      if (key === "") return new AssetConfigs(value.assetConfigs);
      return value;
    });
  }
}
