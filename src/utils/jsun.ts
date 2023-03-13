export default class Jsun {
  static walk(json: object, path: Array<string>): object {
    return path.reduce((result, step) => {
      result = result[step];
      return result;
    }, json);
  }

  static flip(json: object): object {
    const entriesArr = Object.entries(json);
    const flippedArr = entriesArr.map(([key, value]) => [value, key]);
    return Object.fromEntries(flippedArr)
  }

  static parseWithDates(text: string): object {
    return JSON.parse(text, Jsun.dateReviver)
  }

  private static dateReviver(key, value) {
    if (key === "date") return new Date(value);
    return value;
  }
}
