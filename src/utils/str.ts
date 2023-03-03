export default class Str {
  static subString(str: string, bounds: Array<string>) : string {
    return str?.split(bounds[0])[1]?.split(bounds[1])[0];
  }
}
