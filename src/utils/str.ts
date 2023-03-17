export default class Str {
  static subString(str: string, bounds: Array<string>) : string {
    return str?.split(bounds[0])[1]?.split(bounds[1])[0];
  }

  static hyphenate(str: string): string {
    //   Replaces any patterns between 
    //   EITHER /p| AND |p| AND |p/
    //   OR /p/
    return str.replace(/, |:| /g, '-');
  }
}
