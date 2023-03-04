export default class Jsun {
  static walk(json: object, path: Array<string>): object {
    return path.reduce((result, step) => {
      result = result[step];
      return result;
    }, json);
  }

  static parseWithDates(text: string): object {
    return JSON.parse(text, Jsun.dateReviver)
  }

  private static dateReviver(key, value) {
    if (key === "date") return new Date(value);
    return value;
  }
}
