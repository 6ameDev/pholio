export default class AssetConfig {
  private _name: string;
  private _symbol: string;

  constructor(name, symbol) {
    this._name = name;
    this._symbol = symbol;
  }

  public get name() {
    return this._name;
  }

  public get symbol() {
    return this._symbol;
  }
}