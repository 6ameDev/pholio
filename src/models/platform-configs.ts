import Storage from "./storage";
import Platforms from "../platforms";
import { PlatformConfig } from "./interfaces/platform-config.interface";

const STORAGE_KEY = `key-platform-configs`;

export default class PlatformConfigs {
  private _configs: PlatformConfig[];

  constructor(configs: PlatformConfig[]) {
    this._configs = configs || [];
  }

  public get configs() {
    return this._configs;
  }

  async save() {
    console.debug(`Received request to store Platform configs.`);
    return Storage.set<PlatformConfigs>(STORAGE_KEY, this, PlatformConfigs.stringify);
  }

  static fetch(): Promise<PlatformConfigs> {
    console.debug(`Received request to retrieve Platform configs.`);
    return Storage.get<PlatformConfigs>(STORAGE_KEY, PlatformConfigs.parse, this.createBlank());
  }

  static reset() {
    console.debug(`Received request to reset Platform configs.`);
    return Storage.reset(STORAGE_KEY);
  }

  private static stringify(configs: PlatformConfigs): string {
    const replacer = ['configs', 'name', 'id'];
    return JSON.stringify(configs, replacer, ' ');
  }

  private static parse(text): PlatformConfigs {
    return JSON.parse(text, (key, value) => {
      if (key === "configs") return value.map(item => item as PlatformConfig);
      if (key === "") return new PlatformConfigs(value.configs);
      return value;
    });
  }

  private static createBlank(): PlatformConfigs {
    const platformNames = Platforms.allNames();
    const blankPlatformConfig = platformNames.map((name) => {
      return { name: name, id: "" };
    });
    return new PlatformConfigs(blankPlatformConfig);
  }
}
