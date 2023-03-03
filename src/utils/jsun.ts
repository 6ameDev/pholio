export default class Jsun {
  static walk(json: object, path: Array<string>): object {
    return path.reduce((result, step) => {
      result = result[step];
      return result;
    }, json);
  }
}
